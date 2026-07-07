import React from 'react';
// @ts-ignore
import computer from '../../../assets/pictures/projects/software/computer.mp4';
import ResumeDownload from '../ResumeDownload';
import VideoAsset from '../../general/VideoAsset';

export interface SoftwareProjectsProps {}

const SoftwareProjects: React.FC<SoftwareProjectsProps> = (props) => {
    return (
        <div className="site-page-content">
            <h1>Software</h1>
            <h3>Projects</h3>
            <br />
            <p>
                Below are some of my favorite software projects I have worked
                on over the last few years.
            </p>
            <br />
            <ResumeDownload />
            <br />
            <div className="text-block">
                <h2>tonyyunyang.github.io</h2>
                <br />
                <p>
                    My personal website — and the website you are on right now.
                    It's a dependency-free vanilla HTML/CSS/JS site: the
                    landing page is a study of Rauno Freiberg's wonderful
                    raunofreiberg.com, rebuilt from scratch with a hand-rolled
                    spring physics engine, and it grew an AI research gallery
                    with per-paper pages, scramble-decode text animations, and
                    a magnifying dock.
                </p>
                <br />
                <p>
                    The retro computer you are sitting at is <b>My Macintosh</b>
                    : an adaptation of Henry Heffernan's incredible open-source
                    portfolio, used with his blessing. Henry built the 3D scene
                    in Blender and Three.js, and the "operating system" you are
                    clicking through is a React app rendered onto the CRT with
                    CSS 3D transforms. I self-host both parts, swapped every
                    personal detail for my own, and kept all of his
                    interactive toys intact — check the Credits app on the
                    desktop for the full attribution.
                </p>
                <br />
                <div className="captioned-image">
                    <VideoAsset src={computer} />
                    <p style={styles.caption}>
                        <sub>
                            <b>Figure 1:</b> Henry Heffernan's Blender scene of
                            the 3D computer setup — the exact scene this
                            experience runs on. All modeling credit to Henry
                            and his contributors.
                        </sub>
                    </p>
                </div>
                <h3>Links:</h3>
                <ul>
                    <li>
                        <a
                            rel="noreferrer"
                            target="_blank"
                            href="https://github.com/tonyyunyang/tonyyunyang.github.io"
                        >
                            <p>
                                <b>[GitHub]</b> - This Website
                            </p>
                        </a>
                    </li>
                    <li>
                        <a
                            rel="noreferrer"
                            target="_blank"
                            href="https://github.com/henryjeff/portfolio-website"
                        >
                            <p>
                                <b>[GitHub]</b> - Henry's 3D Site Repository
                            </p>
                        </a>
                    </li>
                    <li>
                        <a
                            rel="noreferrer"
                            target="_blank"
                            href="https://github.com/henryjeff/portfolio-inner-site"
                        >
                            <p>
                                <b>[GitHub]</b> - Henry's OS Site Repository
                            </p>
                        </a>
                    </li>
                </ul>
            </div>
            <div className="text-block">
                <h2>Agentic Coding Bench</h2>
                <br />
                <p>
                    A benchmark for agentic coding, built in collaboration with
                    Gradient Network. Rather than testing isolated,
                    single-function tasks like most existing benchmarks, we
                    measure whether an AI agent can plan and build a complete
                    software project from scratch. Each challenge is derived
                    from a real open-source project and given to the agent only
                    as a product brief, with the reference solution and grading
                    hidden.
                </p>
                <br />
                <p>
                    The goal is to compare today's strongest coding agents on
                    realistic, project-level work. We plan to scale the
                    benchmark from an initial proof-of-concept set toward a
                    large public release, and the outcome is in preparation for
                    submission to a top-tier AI venue.
                </p>
            </div>
            <div className="text-block">
                <h2>LLM Router</h2>
                <br />
                <p>
                    A benchmark for evaluating LLM routing strategies, also
                    built with Gradient Network. The project tested whether the
                    easy steps inside complex tasks can be assigned to
                    lower-cost models without sacrificing accuracy, across
                    coding, tool use, and more. Routing preserved the same
                    performance while reducing cost by more than 90% compared
                    with using a single frontier model for every step.
                </p>
                <br />
                <p>
                    The outcome of this project is submitted to NeurIPS'26 and
                    is currently under review, and it grew into a follow-up on
                    cost-adaptive routing with specialist models — you can read
                    about that on my Research page.
                </p>
            </div>
            <ResumeDownload />
        </div>
    );
};

const styles: StyleSheetCSS = {
    video: {
        width: '100%',
        padding: 12,
    },
    caption: {
        width: '80%',
    },
};

export default SoftwareProjects;
