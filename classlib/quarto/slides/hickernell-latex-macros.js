<script>
  window.MathJax = {
    startup: {
      typeset: false,
      pageReady: () => {
        const typesetAndLayout = (() => {
          let busy = false;
          let queued = false;

          const run = async () => {
            if (busy) {
              queued = true;
              return;
            }
            busy = true;
            queued = false;

            try {
              await MathJax.typesetPromise();
              if (window.Reveal && typeof Reveal.layout === "function") {
                Reveal.layout();
              }
            } finally {
              busy = false;
              if (queued) {
                requestAnimationFrame(run);
              }
            }
          };

          return () => requestAnimationFrame(run);
        })();

        return MathJax.startup.defaultPageReady().then(() => {
          if (window.Reveal) {
            Reveal.on("ready", typesetAndLayout);
            Reveal.on("slidechanged", typesetAndLayout);
            Reveal.on("fragmentshown", typesetAndLayout);
            Reveal.on("fragmenthidden", typesetAndLayout);
          }
          typesetAndLayout();
        });
      }
    },
    
    svg: {
      mtextInheritFont: true,
      fontCache: "global"
    },
    
    tex: {
      macros: {

        mathlink: ["\\href{#1}{\\text{\\color{##0f8b8d}{#2}}}", 2],
        frag: ["{\\class{fragment}{#2}}", 2],
        notimplies: "\\ \\mathrel{\\not\\!\\!\\!\\Longrightarrow}",
        convas: ["\\xrightarrow{\\mathsf{a.s.}}", 0],
        convp:  ["\\xrightarrow{\\Prob}", 0],
        convd:  ["\\xrightarrow{\\mathsf{d}}", 0],

        nconvas: ["\\mathrel{\\;\\not\\!\\!\\!\\xrightarrow{\\mathsf{a.s.}}}", 0],
        nconvp:  ["\\mathrel{\\;\\not\\!\\xrightarrow{\\Prob}}", 0],
        nconvd:  ["\\mathrel{\\;\\not\\!\\xrightarrow{\\mathsf{d}}}", 0],

        asto: ["\\xrightarrow{\\mathsf{a.s.}}", 0],
        pto:  ["\\xrightarrow{\\Prob}", 0],
        dto:  ["\\xrightarrow{\\mathsf{d}}", 0],

        success: "{\\operatorname{succ}}",
        sinc:    "{\\operatorname{sinc}}",
        sech:    "{\\operatorname{sech}}",
        csch:    "{\\operatorname{csch}}",

        Prob: "{\\mathbb{P}}",
        Ex:   "{\\mathbb{E}}",


        dist:  "{\\operatorname{dist}}",
        spn:   "{\\operatorname{span}}",
        sgn:   "{\\operatorname{sgn}}",
        releff: "{\\operatorname{rel-eff}}",
        mse:   "{\\operatorname{mse}}",
        rmse:  "{\\operatorname{rmse}}",
        rank:  "{\\operatorname{rank}}",
        erfc:  "{\\operatorname{erfc}}",
        erf:   "{\\operatorname{erf}}",
        cov:   "{\\operatorname{cov}}",
        cost:  "{\\operatorname{cost}}",
        comp:  "{\\operatorname{comp}}",
        corr:  "{\\operatorname{corr}}",
        diag:  "{\\operatorname{diag}}",
        power: "{\\operatorname{power}}",
        var:   "{\\operatorname{var}}",
        opt:   "{\\operatorname{opt}}",
        brandnew: "{\\operatorname{new}}",
        std:   "{\\operatorname{std}}",
        se:    "{\\operatorname{se}}",
        kurt:  "{\\operatorname{kurt}}",
        med:   "{\\operatorname{med}}",
        vol:   "{\\operatorname{vol}}",
        bias:  "{\\operatorname{bias}}",
        RR:   "{\\mathrm{RR}}",

        Bern:  "{\\operatorname{Bern}}",
        Bin:   "{\\operatorname{Bin}}",
        Unif:  "{\\operatorname{Unif}}",
        Norm:  "{\\operatorname{N}}",
        Exp:   "{\\operatorname{Exp}}",
        Gam:   "{\\operatorname{Gamma}}",
        Pois:  "{\\operatorname{Pois}}",
        Geom:  "{\\operatorname{Geom}}",
        Cauchy:"{\\operatorname{Cauchy}}",
        Laplace:"{\\operatorname{Laplace}}",
        Beta:  "{\\operatorname{Beta}}",
        Weibull:"{\\operatorname{Weibull}}",
        Lognorm:"{\\operatorname{Lognormal}}",
        GP:     "{\\operatorname{GP}}",

        argmin: ["\\operatorname*{argmin}", 0],
        argmax: ["\\operatorname*{argmax}", 0],
        Argmin: ["\\argmin\\limits_{#1}", 1],
        Argmax: ["\\argmax\\limits_{#1}", 1],

        sign:  "{\\operatorname{sign}}",
        spann: "{\\operatorname{span}}",
        cond:  "{\\operatorname{cond}}",
        trace: "{\\operatorname{trace}}",
        Si:    "{\\operatorname{Si}}",
        col:   "{\\operatorname{col}}",
        nullspace: "{\\operatorname{null}}",
        Order: "{\\mathcal{O}}",

        IIDsim: "\\mathrel{\\stackrel{\\mathrm{IID}}{\\sim}}",
        LDsim:  "\\mathrel{\\stackrel{\\mathrm{LD}}{\\sim}}",
        appxsim: "\\mathrel{\\stackrel{\\cdot}{\\sim}}",

        naturals:  "{\\mathbb{N}}",
        natzero:   "{\\mathbb{N}_0}",
        integers:  "{\\mathbb{Z}}",
        rationals: "{\\mathbb{Q}}",
        reals:     "{\\mathbb{R}}",
        complex:   "{\\mathbb{C}}",
        bbone:     "{\\mathbb{1}}",
        indic:     "{\\mathop{\\mathchoice{\\large\\mathbb{1}}{\\large\\mathbb{1}}{\\mathbb{1}}{\\mathbb{1}}}}",  // indic: enlarged blackboard-bold indicator (uses mathchoice so subscripts scale)

        abs:  ["{\\left\\lvert #1 \\right\\rvert}", 1],
        norm: ["{\\left\\lVert #1 \\right\\rVert}", 1],
        ip:   ["{\\left\\langle #1, #2 \\right\\rangle}", 2],
        dim:   "{\\operatorname{dim}}",
        df:   "{\\mathrm{df}}",


        bvec: ["{\\boldsymbol{#1}}", 1],
        avec: ["{\\vec{#1}}", 1],
        vecsym: ["{\\boldsymbol{#1}}", 1],

        vf:  "{\\boldsymbol{f}}",
        tvf: "{\\widetilde{\\boldsymbol{f}}}",
        vk:  "{\\boldsymbol{k}}",
        vt:  "{\\boldsymbol{t}}",
        vT:  "{\\boldsymbol{T}}",
        vx:  "{\\boldsymbol{x}}",
        vX:  "{\\boldsymbol{X}}",
        vy:  "{\\boldsymbol{y}}",
        tvy: "{\\widetilde{\\boldsymbol{y}}}",
        vY:  "{\\boldsymbol{Y}}",
        vz:  "{\\boldsymbol{z}}",
        vZ:  "{\\boldsymbol{Z}}",

        tg:  "{\\widetilde{g}}",
        th:  "{\\widetilde{h}}",

        valpha: "{\\boldsymbol{\\alpha}}",
        vbeta:  "{\\boldsymbol{\\beta}}",
        vgamma: "{\\boldsymbol{\\gamma}}",
        vdelta: "{\\boldsymbol{\\delta}}",
        vepsilon: "{\\boldsymbol{\\epsilon}}",
        vlambda:  "{\\boldsymbol{\\lambda}}",
        vsigma:   "{\\boldsymbol{\\sigma}}",
        vtheta:   "{\\boldsymbol{\\theta}}",
        vTheta:   "{\\boldsymbol{\\Theta}}",
        vomega:   "{\\boldsymbol{\\omega}}",
        vpi:      "{\\boldsymbol{\\pi}}",
        vphi:     "{\\boldsymbol{\\phi}}",
        vPhi:     "{\\boldsymbol{\\Phi}}",
        vmu:      "{\\boldsymbol{\\mu}}",
        vnu:     "{\\boldsymbol{\\nu}}",

        htheta: "{\\widehat{\\theta}}",
        hTheta: "{\\widehat{\\Theta}}",
        hbeta:  "{\\widehat{\\beta}}",
        hlambda: "{\\widehat{\\lambda}}",
        hmu:    "{\\widehat{\\mu}}",
        hsigma: "{\\widehat{\\sigma}}",
        hSigma: "{\\widehat{\\Sigma}}",
        hP:     "{\\widehat{P}}",
        hX:     "{\\widehat{X}}",
        hY:     "{\\widehat{Y}}",
        hZ:     "{\\widehat{Z}}",

        ct: "{\\mathcal{T}}",
        cx: "{\\mathcal{X}}",

        vzero: "{\\boldsymbol{0}}",
        vone:  "{\\boldsymbol{1}}",
        vinf:  "{\\boldsymbol{\\infty}}",
        
        barD: "{\\overline{D}}",
        barx: "{\\overline{x}}",
        barX: "{\\overline{X}}",
        barY: "{\\overline{Y}}",
        bary: "{\\overline{y}}",
        barZ: "{\\overline{Z}}",

        me:  "{\\mathrm{e}}",
        mi:  "{\\mathrm{i}}",
        mpi: "{\\mathrm{\\pi}}",
        mK: "{\\mathsf{K}}",
        tmK: "{\\widetilde{\\mathsf{K}}}",
        mSigma: "{\\mathsf{\\Sigma}}",

        dif: "{\\mathrm{d}}",
        IID: "{\\mathrm{IID}}",
        MLE: "{\\mathrm{MLE}}",
        LRT: "{\\mathrm{LRT}}",

        exstar: "{\\mathop{\\mathchoice{\\color{gold}{\\Large\\star}}{\\color{gold}{\\Large\\star}}{\\color{gold}{\\large\\star}}{\\color{gold}{\\star}}}}",
        exeq: "{\\mathrel{\\,\\overset{\\exstar}{=}\\,}}",
        exsim: "{\\mathrel{\\,\\overset{\\exstar}{\\sim}\\,}}",
        
      } 
    }
  };
</script>

