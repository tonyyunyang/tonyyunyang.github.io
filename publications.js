/* ============================================================
   Publication + blog data. Edit freely — everything on the
   gallery and paper pages is generated from this file.

   Per entry:
   - slug        stable id, used in URLs (paper.html?p=<slug>)
     and for media files (media/<slug>.mp4 — drop a video there
     and both the card and the paper page pick it up).
   - links       omit / null any that don't exist — the paper
     page dock only renders what is present.
   - highlight   author name to emphasize.
   ============================================================ */

window.SITE_AUTHOR = "Tongyun Yang";

window.PUBLICATIONS = [
  {
    slug: "emotion-vr",
    date: "2025-09-03",
    title:
      "Through the Eyes of Emotion: A Multi-faceted Eye Tracking Dataset for Emotion Recognition in Virtual Reality",
    authors: [
      "Tongyun Yang",
      "Bishwas Regmi",
      "Lingyu Du",
      "Andreas Bulling",
      "Xucong Zhang",
      "Guohao Lan",
    ],
    venue: "Proc. ACM IMWUT",
    venueLong:
      "Proceedings of the ACM on Interactive, Mobile, Wearable and Ubiquitous Technologies 9(3), 1–41",
    year: "2025",
    links: {
      pdf: "https://dl.acm.org/doi/pdf/10.1145/3749545",
      page: "https://dl.acm.org/doi/abs/10.1145/3749545",
      code: null,
      scholar:
        "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=rIFdBYAAAAAJ&citation_for_view=rIFdBYAAAAAJ:d1gkVwhDpl0C",
    },
    abstract:
      "Virtual Reality (VR) is transforming cognitive and psychological research by enabling immersive simulations that elicit authentic emotional responses. The high demand for VR-based emotion recognition is also evident in fields such as mental healthcare, education, and entertainment, where understanding users' emotional states can enhance user experience and system effectiveness. However, the lack of comprehensive datasets hinders progress in VR-based emotion recognition. In this paper, we present a comprehensive, multi-faceted eye-tracking dataset collected from 26 participants using 28 emotional video stimuli rendered in a custom virtual environment. Our dataset is the first to incorporate high-frame-rate periocular videos, capturing subtle motions, such as micro-expressions and eyebrow shifts, which are critical for emotion analysis. Additionally, it includes high-frequency eye-tracking data, offering gaze…",
    bibtex: `@article{yang2025through,
  title     = {Through the Eyes of Emotion: A Multi-faceted Eye Tracking Dataset for Emotion Recognition in Virtual Reality},
  author    = {Yang, Tongyun and Regmi, Bishwas and Du, Lingyu and Bulling, Andreas and Zhang, Xucong and Lan, Guohao},
  journal   = {Proceedings of the ACM on Interactive, Mobile, Wearable and Ubiquitous Technologies},
  volume    = {9},
  number    = {3},
  pages     = {1--41},
  year      = {2025},
  publisher = {ACM},
  doi       = {10.1145/3749545}
}`,
  },
  {
    slug: "twinrouterbench",
    date: "2026-05-14",
    title:
      "TwinRouterBench: Fast Static and Live Dynamic Evaluation for Realistic Agentic LLM Routing",
    authors: [
      "Pei Yang",
      "Wanyi Chen",
      "Tongyun Yang",
      "Pengbin Feng",
      "Jiarong Xing",
      "Wentao Guo",
      "Yuhang Yao",
      "Yuhang Han",
      "Hanchen Li",
      "Xu Wang",
      "Zeyu Wang",
      "Jie Xiao",
      "Anjie Yang",
      "Liang Tian",
      "Lynn Ai",
      "Eric Yang",
      "Tianyu Shi",
    ],
    venue: "RLEval Workshop",
    venueLong:
      "RLEval: Methods and Reinforcement Learning Environments for Evaluating AI Agents (also arXiv:2605.18859)",
    year: "2026",
    links: {
      pdf: "https://arxiv.org/pdf/2605.18859",
      page: "https://arxiv.org/abs/2605.18859",
      code: null,
      scholar:
        "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=rIFdBYAAAAAJ&citation_for_view=rIFdBYAAAAAJ:Y0pCki6q_DkC",
    },
    abstract:
      "LLM routing matters most in long-horizon applications such as coding agents, deep research systems, and computer-use agents, where a single user request triggers many model calls. Routing each call to the cheapest sufficient model can cut costs without sacrificing quality, yet existing router benchmarks evaluate routers only on one-shot prompts. They never expose the router-visible prefix at an intermediate agent step, never test whether a cheaper replacement preserves downstream task success, and often rely on online LLM judges at evaluation time. We introduce TwinRouterBench, a step-level routing benchmark with two tracks. The static track provides 970 router-visible prefixes from 520 instances across SWE-bench, BFCL, mtRAG, QMSum, and PinchBench, each paired with an execution-verified target tier estimated under a released downgrade-and-cascade protocol; scoring is deterministic arithmetic over tier labels, trajectory membership, and token costs, with no online evaluator-side LLM judge. The dynamic track supplies a harness that runs routers on the full 500-case SWE-bench Verified suite…",
    bibtex: `@inproceedings{yang2026twinrouterbench,
  title     = {TwinRouterBench: Fast Static and Live Dynamic Evaluation for Realistic Agentic LLM Routing},
  author    = {Yang, Pei and Chen, Wanyi and Yang, Tongyun and Feng, Pengbin and Xing, Jiarong and Guo, Wentao and Yao, Yuhang and Han, Yuhang and Li, Hanchen and Wang, Xu and Wang, Zeyu and Xiao, Jie and Yang, Anjie and Tian, Liang and Ai, Lynn and Yang, Eric and Shi, Tianyu},
  booktitle = {RLEval: Methods and Reinforcement Learning Environments for Evaluating AI Agents},
  note      = {arXiv preprint arXiv:2605.18859},
  year      = {2026}
}`,
  },
  {
    slug: "mera",
    date: "2026",
    title:
      "MERA: Model Evolution and Routing with Skill Adaptation for Agentic Systems at Scale",
    authors: [
      "Yuhang Yao",
      "Zeyu Wang",
      "Tongyun Yang",
      "Wanyi Chen",
      "Yuhang Han",
      "Jie Xiao",
      "Chengke Bao",
      "Tianyu Shi",
    ],
    venue: "RLEval Workshop",
    venueLong:
      "RLEval: Methods and Reinforcement Learning Environments for Evaluating AI Agents",
    year: "2026",
    links: {
      pdf: "https://openreview.net/pdf?id=6oyBiDMCHs",
      page: "https://openreview.net/forum?id=6oyBiDMCHs",
      code: null,
      scholar:
        "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=rIFdBYAAAAAJ&citation_for_view=rIFdBYAAAAAJ:Tyk-4Ss8FVUC",
    },
    abstract:
      "Language-model agents increasingly mix strong but expensive frontier models with cheaper models that are useful only on safe subsets of a workflow. The challenge is not only to choose a model once per user request, but to adapt many individual invocations inside a multi-step trace without silently degrading quality. We present MERA, a trace-driven framework that jointly evolves three tracks: SkillBook statistics for recurring prompt signatures, a learned invocation-level router, and a small-model adapter. The main empirical finding is that the joint schedule matters: in a code-generation setting with 590 executable code tasks and 3,328 weakly labelled router examples, the best four-cycle order is Skill → LLM → Router. This setting reaches 87.3% router accuracy with 4.4% fallback and reduces estimated serving cost to 51.8% of always using the large model…",
    bibtex: `@inproceedings{yao2026mera,
  title     = {MERA: Model Evolution and Routing with Skill Adaptation for Agentic Systems at Scale},
  author    = {Yao, Yuhang and Wang, Zeyu and Yang, Tongyun and Chen, Wanyi and Han, Yuhang and Xiao, Jie and Bao, Chengke and Shi, Tianyu},
  booktitle = {RLEval: Methods and Reinforcement Learning Environments for Evaluating AI Agents},
  year      = {2026}
}`,
  },
  {
    slug: "reverse-imaging",
    date: "2025-09",
    title:
      "Reverse Imaging for Wide-spectrum Generalization of Cardiac MRI Segmentation",
    authors: [
      "Yidong Zhao",
      "Peter Kellman",
      "Hui Xue",
      "Tongyun Yang",
      "Yi Zhang",
      "Yuchi Han",
      "Orlando Simonetti",
      "Qian Tao",
    ],
    venue: "MICCAI",
    venueLong:
      "International Conference on Medical Image Computing and Computer-Assisted Intervention, LNCS 15962, 555–565",
    year: "2025",
    links: {
      pdf: null,
      page: "https://link.springer.com/chapter/10.1007/978-3-032-04947-6_53",
      code: null,
      scholar:
        "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=rIFdBYAAAAAJ&citation_for_view=rIFdBYAAAAAJ:u-x6o8ySG0sC",
    },
    abstract:
      "Pretrained segmentation models for cardiac magnetic resonance imaging (MRI) struggle to generalize across different imaging sequences due to significant variations in image contrast. These variations arise from changes in imaging protocols, yet the same fundamental spin properties, including proton density, T1, and T2 values, govern all acquired images. With this core principle, we introduce Reverse Imaging, a novel physics-driven method for cardiac MRI data augmentation and domain adaptation to fundamentally solve the generalization problem. Our method reversely infers the underlying spin properties from observed cardiac MRI images, by solving ill-posed nonlinear inverse problems regularized by the prior distribution of spin properties. We acquire this “spin prior” by learning a generative diffusion model from the multiparametric SAturation-recovery single-SHot acquisition sequence (mSASHA) dataset…",
    bibtex: `@inproceedings{zhao2025reverse,
  title        = {Reverse Imaging for Wide-Spectrum Generalization of Cardiac MRI Segmentation},
  author       = {Zhao, Yidong and Kellman, Peter and Xue, Hui and Yang, Tongyun and Zhang, Yi and Han, Yuchi and Simonetti, Orlando and Tao, Qian},
  booktitle    = {International Conference on Medical Image Computing and Computer-Assisted Intervention},
  pages        = {555--565},
  year         = {2025},
  organization = {Springer Nature Switzerland}
}`,
  },
  {
    slug: "pruning-nnunet",
    date: "2025-07",
    title: "Pruning nnU-Net with Minimal Performance Loss",
    authors: ["Tongyun Yang", "Yidong Zhao", "Qian Tao"],
    venue: "MIDL Short Papers",
    venueLong: "Medical Imaging with Deep Learning — Short Papers",
    year: "2025",
    links: {
      pdf: "https://openreview.net/pdf?id=uTTOhthEDR",
      page: "https://openreview.net/forum?id=uTTOhthEDR",
      code: null,
      scholar:
        "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=rIFdBYAAAAAJ&citation_for_view=rIFdBYAAAAAJ:u5HHmVD_uO8C",
    },
    abstract:
      "nnU-Net is widely known for its accurate and robust segmentation performance in medical imaging tasks. However, the trained networks are typically heavily parameterized, and the high computational demand limits their deployment on devices with constrained resources. In this paper, we show that more than 80% of the trained nnU-Net weights can be removed without significant performance degradation, maintaining a proxy Dice score of >0.95. This applies to both 2D and 3D configurations across four different medical image segmentation datasets. Interestingly, we observe that critical weights consistently concentrate near the U-Net encoder and decoder ends, while the bottleneck layers can be heavily pruned. These findings highlight the significant weight redundancy in nnU-Net and suggest opportunities for further optimization, to facilitate deployment of the model on devices with limited resources.",
    bibtex: `@inproceedings{yang2025pruning,
  title     = {Pruning nnU-Net with Minimal Performance Loss},
  author    = {Yang, Tongyun and Zhao, Yidong and Tao, Qian},
  booktitle = {Medical Imaging with Deep Learning -- Short Papers},
  year      = {2025}
}`,
  },
];

/* Blog posts — none yet. Add entries shaped like:
   { slug: "my-post", title: "…", date: "2026-08", href: "posts/my-post.html" } */
window.BLOG_POSTS = [];

/* Order newest first and derive display indices (01 = most recent). */
window.PUBLICATIONS.sort(function (a, b) {
  return (b.date || "").localeCompare(a.date || "");
});
window.PUBLICATIONS.forEach(function (p, i) {
  p.index = String(i + 1).padStart(2, "0");
});
