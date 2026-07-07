import React from 'react';
import ResumeDownload from './ResumeDownload';

export interface ExperienceProps {}

const Experience: React.FC<ExperienceProps> = (props) => {
    return (
        <div className="site-page-content">
            <ResumeDownload />
            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>Independent</h1>
                        <a
                            rel="noreferrer"
                            target="_blank"
                            href={
                                'https://scholar.google.com/citations?user=rIFdBYAAAAAJ&hl=en'
                            }
                        >
                            <h4>Google Scholar</h4>
                        </a>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>AI Researcher</h3>
                        <b>
                            <p>Mar 2026 - Present</p>
                        </b>
                    </div>
                </div>
            </div>
            <div className="text-block">
                <p>
                    A long-term, self-motivated role based in Amsterdam and
                    remote. I collaborate with industry (Tencent, Gradient
                    Network, Commonstack, and others) and academia (McGill,
                    Tsinghua, and others), leading research spanning
                    cost-efficient LLMs, LLMs for optimization, agentic harness
                    frameworks, and world models.
                </p>
            </div>
            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>IMDEA Networks</h1>
                        <a
                            rel="noreferrer"
                            target="_blank"
                            href={'https://networks.imdea.org/'}
                        >
                            <h4>networks.imdea.org</h4>
                        </a>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>Marie Skłodowska-Curie Fellow</h3>
                        <b>
                            <p>Jul 2025 - May 2026</p>
                        </b>
                    </div>
                </div>
            </div>
            <div className="text-block">
                <p>
                    In Madrid, I investigated privacy-preserving wireless
                    sensing systems that convert wireless signals into
                    actionable insights for human and obstacle detection, with
                    a focus on representation learning and world models for
                    wireless signals to enable feature extraction and dynamic
                    predictive reasoning.
                </p>
            </div>
            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>TU Delft</h1>
                        <a
                            rel="noreferrer"
                            target="_blank"
                            href={'https://www.tudelft.nl/'}
                        >
                            <h4>www.tudelft.nl</h4>
                        </a>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>AI Research Engineer, Imaging Physics</h3>
                        <b>
                            <p>Jan 2025 - Jul 2025</p>
                        </b>
                    </div>
                </div>
            </div>
            <div className="text-block">
                <p>
                    I investigated weight redundancy in nnU-Net using
                    unstructured followed by structured pruning, and
                    demonstrated that nnU-Net can be structurally pruned to 99%
                    sparsity with minimal performance degradation — a 6×
                    improvement in training efficiency plus faster inference.
                    The results were published in MIDL'25.
                </p>
            </div>
            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>TU Delft</h1>
                        <a
                            rel="noreferrer"
                            target="_blank"
                            href={'https://www.tudelft.nl/'}
                        >
                            <h4>www.tudelft.nl</h4>
                        </a>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>HCI Research Assistant, Embedded Systems</h3>
                        <b>
                            <p>Jun 2023 - Oct 2024</p>
                        </b>
                    </div>
                </div>
            </div>
            <div className="text-block">
                <p>
                    I constructed the first large-scale public dataset for
                    emotion recognition based solely on eye tracking in
                    immersive environments, covering seven discrete emotions,
                    and developed an efficient, scalable recognition method.
                    The results were published in IMWUT/UbiComp'25.
                </p>
            </div>
            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>NXP</h1>
                        <a
                            rel="noreferrer"
                            target="_blank"
                            href={'https://www.nxp.com/'}
                        >
                            <h4>www.nxp.com</h4>
                        </a>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>Automation Engineer</h3>
                        <b>
                            <p>Dec 2020 - Jul 2021</p>
                        </b>
                    </div>
                </div>
            </div>
            <div className="text-block">
                <p>
                    At NXP Semiconductors in Nijmegen, I developed an automated
                    test bench system for CAN chips, integrating comprehensive
                    diagnostic protocols to enable efficient defect analysis
                    and ensure robust post-production performance.
                </p>
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    header: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
    },
    skillRow: {
        flex: 1,
        justifyContent: 'space-between',
    },
    skillName: {
        minWidth: 56,
    },
    skill: {
        flex: 1,
        padding: 8,
        alignItems: 'center',
    },
    progressBar: {
        flex: 1,
        background: 'red',
        marginLeft: 8,
        height: 8,
    },
    hoverLogo: {
        height: 32,
        marginBottom: 16,
    },
    headerContainer: {
        alignItems: 'flex-end',
        width: '100%',
        justifyContent: 'center',
    },
    hoverText: {
        marginBottom: 8,
    },
    indent: {
        marginLeft: 24,
    },
    headerRow: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
    },
};

export default Experience;
