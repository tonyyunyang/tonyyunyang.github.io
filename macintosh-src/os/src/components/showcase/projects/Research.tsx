import React from 'react';

export interface ResearchProjectsProps {}

interface PaperProps {
    title: string;
    venue: string;
    year: string;
    slug: string;
    children: React.ReactNode;
}

const Paper: React.FC<PaperProps> = ({ title, venue, year, slug, children }) => {
    return (
        <div className="text-block">
            <h2>{title}</h2>
            <br />
            <p>
                <b>
                    {venue} · {year}
                </b>
            </p>
            <br />
            <p>{children}</p>
            <br />
            <ul>
                <li>
                    <a href={`/paper.html?p=${slug}`}>
                        <p>
                            <b>[Paper Page]</b> - Abstract, PDF, & BibTeX
                        </p>
                    </a>
                </li>
            </ul>
        </div>
    );
};

const ResearchProjects: React.FC<ResearchProjectsProps> = (props) => {
    return (
        <div className="site-page-content">
            <h1>Research</h1>
            <h3>Publications & Projects</h3>
            <br />
            <div className="text-block">
                <p>
                    My research has converged on two threads: settings where
                    data is sensitive and public data is scarce, and applied
                    systems that exploit the full power of frontier models.
                    Each paper below links to its page in the AI Research
                    gallery on my main site, with the abstract, PDF, and
                    BibTeX. You can also find everything on my{' '}
                    <a
                        rel="noreferrer"
                        target="_blank"
                        href="https://scholar.google.com/citations?user=rIFdBYAAAAAJ&hl=en"
                    >
                        Google Scholar
                    </a>
                    .
                </p>
            </div>
            <Paper
                title="MERA"
                venue="ACM CAIS, RLEval Workshop"
                year="2026"
                slug="mera"
            >
                Model Evolution and Routing with Skill Adaptation for agentic
                systems at scale — how a fleet of models can specialize and
                route work among themselves as usage grows.
            </Paper>
            <Paper
                title="TwinRouterBench"
                venue="ACM CAIS, RLEval Workshop"
                year="2026"
                slug="twinrouterbench"
            >
                Fast static and live dynamic evaluation for realistic agentic
                LLM routing — the benchmark side of my routing work with
                Gradient Network.
            </Paper>
            <Paper
                title="Through the Eyes of Emotion"
                venue="IMWUT / UbiComp"
                year="2025"
                slug="emotion-vr"
            >
                A multi-faceted eye-tracking dataset for emotion recognition in
                virtual reality — the first large-scale public dataset of its
                kind, covering seven discrete emotions, plus an efficient
                recognition method.
            </Paper>
            <Paper
                title="Reverse Imaging"
                venue="MICCAI"
                year="2025"
                slug="reverse-imaging"
            >
                Wide-spectrum generalization of cardiac MRI segmentation by
                inverting the imaging physics — making segmentation models
                robust across scanners and sequences.
            </Paper>
            <Paper
                title="Pruning nnU-Net"
                venue="MIDL, Short Papers"
                year="2025"
                slug="pruning-nnunet"
            >
                Pruning nnU-Net with minimal performance loss — showing the
                default medical segmentation workhorse can be structurally
                pruned to 99% sparsity, with a 6× improvement in training
                efficiency.
            </Paper>
            <div className="text-block">
                <h2>In the pipeline</h2>
                <br />
                <p>
                    <b>Diffusion Weights</b> — can fine-tuning be reframed as a
                    generative prediction problem instead of step-by-step SGD?
                    We used a U-Net diffusion model to forecast future
                    parameter states from earlier checkpoints, reaching 3.2×
                    wall-clock acceleration with comparable downstream
                    performance. Submitted to ACL'26.
                </p>
                <br />
                <p>
                    <b>Cost-Adaptive LLM Routing with Specialist Models</b> —
                    extending the routing benchmark with specialist models
                    fine-tuned on trajectories from stronger models: the more
                    you use the system, the better the small models get, and
                    the cheaper the whole system becomes. In preparation for
                    EMNLP'26.
                </p>
                <br />
                <p>
                    <b>Human Intent World Model</b> — with MeetaVista, a
                    synthetic dataset for modeling customer intent distilled
                    from classical sales literature, used to fine-tune a
                    vision-language model that infers intent from visual cues.
                    Deployed in real-world interaction tasks.
                </p>
            </div>
        </div>
    );
};

export default ResearchProjects;
