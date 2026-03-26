import numpy as np
from scipy.stats import f, norm, t


def fit_ols(X, y):
    """
    Fit an ordinary least squares model using a QR decomposition.

    Parameters
    ----------
    X : ndarray, shape (n, d)
        Design matrix.
    y : ndarray, shape (n,)
        Response vector.

    Returns
    -------
    dict
        Dictionary containing fitted quantities and basic diagnostics.
    """
    X = np.asarray(X, dtype=float)
    y = np.asarray(y, dtype=float)

    n, d = X.shape
    if y.shape[0] != n:
        raise ValueError("X and y have incompatible shapes.")
    if n <= d:
        raise ValueError("Need n > d to estimate error variance.")

    Q, R = np.linalg.qr(X, mode="reduced")
    beta_hat = np.linalg.solve(R, Q.T @ y)
    y_hat = X @ beta_hat
    resid = y - y_hat

    sse = float(resid @ resid)
    df_resid = n - d
    s2 = sse / df_resid
    s = np.sqrt(s2)

    Z = np.linalg.solve(R, np.eye(d))
    XtX_inv = Z @ Z.T

    h = np.sum((X @ XtX_inv) * X, axis=1)

    se_beta = np.sqrt(s2 * np.diag(XtX_inv))

    return {
        "n": n,
        "d": d,
        "df_resid": df_resid,
        "Q": Q,
        "R": R,
        "beta_hat": beta_hat,
        "y_hat": y_hat,
        "resid": resid,
        "sse": sse,
        "s2": s2,
        "s": s,
        "XtX_inv": XtX_inv,
        "h": h,
        "se_beta": se_beta,
    }


def leverage_values(X, XtX_inv=None):
    """
    Return the leverage values h_i = p_ii.
    """
    X = np.asarray(X, dtype=float)
    if XtX_inv is None:
        XtX_inv = np.linalg.inv(X.T @ X)
    return np.sum((X @ XtX_inv) * X, axis=1)


def standardized_residuals(resid, s, h):
    """
    Return standardized residuals r_i = e_i / (s sqrt(1 - h_i)).
    """
    resid = np.asarray(resid, dtype=float)
    h = np.asarray(h, dtype=float)
    return resid / (s * np.sqrt(1.0 - h))


def studentized_residuals(resid, s2, h, n, d):
    """
    Return internally studentized residuals using leave-one-out variance estimates.
    """
    resid = np.asarray(resid, dtype=float)
    h = np.asarray(h, dtype=float)

    denom_df = n - d - 1
    if denom_df <= 0:
        raise ValueError("Need n - d - 1 > 0 for studentized residuals.")

    s2_i = ((n - d) * s2 - resid**2 / (1.0 - h)) / denom_df
    return resid / np.sqrt(s2_i * (1.0 - h))


def beta_confidence_intervals(beta_hat, XtX_inv, s2, alpha, df):
    """
    Return pointwise confidence intervals for the regression coefficients.
    """
    beta_hat = np.asarray(beta_hat, dtype=float)
    XtX_inv = np.asarray(XtX_inv, dtype=float)

    tcrit = t.ppf(1.0 - alpha / 2.0, df=df)
    se_beta = np.sqrt(s2 * np.diag(XtX_inv))
    return np.column_stack([
        beta_hat - tcrit * se_beta,
        beta_hat + tcrit * se_beta,
    ])


def mean_and_prediction_bands(Xg, beta_hat, XtX_inv, s2, alpha, df):
    """
    Return fitted mean response and pointwise confidence/prediction bands.
    """
    Xg = np.asarray(Xg, dtype=float)
    beta_hat = np.asarray(beta_hat, dtype=float)
    XtX_inv = np.asarray(XtX_inv, dtype=float)

    mu_hat = Xg @ beta_hat
    tcrit = t.ppf(1.0 - alpha / 2.0, df=df)

    quad = np.sum((Xg @ XtX_inv) * Xg, axis=1)
    se_mean = np.sqrt(s2 * quad)
    se_pred = np.sqrt(s2 * (1.0 + quad))

    ci = np.column_stack([
        mu_hat - tcrit * se_mean,
        mu_hat + tcrit * se_mean,
    ])
    pi = np.column_stack([
        mu_hat - tcrit * se_pred,
        mu_hat + tcrit * se_pred,
    ])

    return {
        "mu_hat": mu_hat,
        "se_mean": se_mean,
        "se_pred": se_pred,
        "ci": ci,
        "pi": pi,
    }


def confidence_ellipse_shape(XtX_inv, s2, alpha, n, d):
    """
    Return the geometric ingredients of the joint confidence ellipse for beta.
    """
    XtX_inv = np.asarray(XtX_inv, dtype=float)

    c2 = d * s2 * f.ppf(1.0 - alpha, dfn=d, dfd=n - d)
    Sigma = c2 * XtX_inv

    eigvals, eigvecs = np.linalg.eigh(Sigma)
    order = np.argsort(eigvals)[::-1]
    eigvals = eigvals[order]
    eigvecs = eigvecs[:, order]

    angle = np.degrees(np.arctan2(eigvecs[1, 0], eigvecs[0, 0]))
    width = 2.0 * np.sqrt(eigvals[0])
    height = 2.0 * np.sqrt(eigvals[1])

    return {
        "Sigma": Sigma,
        "angle": angle,
        "width": width,
        "height": height,
        "eigvals": eigvals,
        "eigvecs": eigvecs,
    }


def normal_qq_data(residuals):
    """
    Return theoretical normal quantiles and sorted residuals for a Q-Q plot.
    """
    residuals = np.asarray(residuals, dtype=float)
    n = residuals.shape[0]
    r_sorted = np.sort(residuals)
    p = (np.arange(1, n + 1) - 0.5) / n
    z_theory = norm.ppf(p)
    return z_theory, r_sorted


def generate_quadratic_regression_example(
    n=30,
    beta_true=np.array([0.10, 0.90]),
    sigma=1.0,
    alpha=0.05,
    seed_start=1,
    seed_stop=500,
):
    """
    Generate the example Y = beta_1 + beta_2 x^2 + eps and search for a seed
    where the confidence interval for beta_1 contains 0.
    """
    beta_true = np.asarray(beta_true, dtype=float)

    for seed in range(seed_start, seed_stop + 1):
        rng = np.random.default_rng(seed)

        x = np.linspace(0.0, 3.0, n)
        eps = rng.normal(0.0, sigma, size=n)
        y = beta_true[0] + beta_true[1] * x**2 + eps
        X = np.column_stack([np.ones(n), x**2])

        fit = fit_ols(X, y)
        beta_ci = beta_confidence_intervals(
            fit["beta_hat"], fit["XtX_inv"], fit["s2"], alpha, df=fit["df_resid"]
        )

        if beta_ci[0, 0] <= 0.0 <= beta_ci[0, 1]:
            fit["seed"] = seed
            fit["alpha"] = alpha
            fit["beta_true"] = beta_true
            fit["x"] = x
            fit["y"] = y
            fit["X"] = X
            fit["eps"] = eps
            fit["beta_ci"] = beta_ci
            fit["r_standardized"] = standardized_residuals(
                fit["resid"], fit["s"], fit["h"]
            )
            fit["r_studentized"] = studentized_residuals(
                fit["resid"], fit["s2"], fit["h"], fit["n"], fit["d"]
            )
            return fit

    raise RuntimeError("No suitable seed found.")
