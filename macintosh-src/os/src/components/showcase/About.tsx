import React from 'react';
import beach from '../../assets/pictures/tony-childhood-beach.jpg';
import meNow from '../../assets/pictures/tony-headshot.jpg';
import { Link } from 'react-router-dom';
import ResumeDownload from './ResumeDownload';

export interface AboutProps {}

const About: React.FC<AboutProps> = (props) => {
    return (
        // add on resize listener
        <div className="site-page-content">
            <h1 style={{ marginLeft: -16 }}>Welcome</h1>
            <h3>I'm Tongyun (Tony) Yang</h3>
            <br />
            <div className="text-block">
                <p>
                    I'm an independent AI researcher & engineer based in
                    Amsterdam. In October of 2024 I graduated from TU Delft with
                    my MSc in Computer Systems Engineering, and my work since
                    has run the whole spectrum of AI — from medical imaging and
                    emotion recognition in VR to LLM routing and agentic
                    systems.
                </p>
                <br />
                <p>
                    Thank you for taking the time to check out my portfolio. I
                    really hope you enjoy exploring it as much as I enjoyed
                    building it — do open the Credits app on the desktop for
                    the story behind this site. If you have any questions or
                    comments, feel free to contact me using{' '}
                    <Link to="/contact">this form</Link> or shoot me an email at{' '}
                    <a href="mailto:tonyyunyang@outlook.com">
                        tonyyunyang@outlook.com
                    </a>
                </p>
            </div>
            <ResumeDownload />
            <div className="text-block">
                <h3>About Me</h3>
                <br />
                <p>
                    From a young age I've been taking things apart to see how
                    they work. I was born and raised in Bangkok, and when I
                    was nine my family moved back to China — where I grew up
                    and eventually started a bachelor's degree in Electrical
                    Engineering. Halfway through it I moved to the
                    Netherlands to continue my studies, arriving just in time
                    for Covid to close the world around me. I stayed anyway,
                    the Netherlands slowly became home, and in 2022 I started
                    my MSc in Computer Systems Engineering at TU Delft.
                </p>
                <br />
                <div className="captioned-image">
                    <img src={beach} style={styles.image} alt="" />
                    <p>
                        <sub>
                            <b>Figure 1:</b> Little me on a beach in Thailand,
                            already pointing at what to build next :)
                        </sub>
                    </p>
                </div>

                <p>
                    At TU Delft I found my way into research. I built the first
                    large-scale public dataset for emotion recognition based
                    solely on eye tracking in VR (published in
                    IMWUT/UbiComp'25), and showed that nnU-Net can be
                    structurally pruned to 99% sparsity with minimal
                    performance loss (MIDL'25). After graduating I spent a year
                    as a Marie Skłodowska-Curie Fellow at IMDEA Networks in
                    Madrid, working on privacy-preserving wireless sensing.
                    You can browse all of my publications on my{' '}
                    <Link to="/projects/research">Research</Link> page.
                </p>
                <br />
                <p>
                    These days I work independently, collaborating with
                    industry (Tencent, Gradient Network, Commonstack) and
                    academia (McGill, Tsinghua) on cost-efficient LLMs, LLM
                    routing, agentic harness frameworks, and world models. I
                    believe AI is moving from a scaling race to a systems race:
                    larger models still matter, but what really matters is how
                    we train, route, compress, deploy, and apply them under
                    real constraints. And right now,{' '}
                    <b>
                        I'm looking for new opportunities — in academia and
                        industry alike
                    </b>
                    . If you're working on something interesting, my{' '}
                    <Link to="/contact">door is open</Link>.
                </p>
                <br />
                <br />
                <div style={{}}>
                    <div
                        style={{
                            flex: 1,
                            textAlign: 'justify',
                            alignSelf: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <h3>My Hobbies</h3>
                        <br />
                        <p>
                            Beyond research, I spend most of my free time
                            moving: I run regularly (my half-marathon personal
                            best is 1:43:53) and lift through consistent
                            strength training. I also love cooking — especially
                            for family — plus hiking and tennis. You can read
                            more about all of this on my{' '}
                            <Link to="/projects/life">Life</Link> page.
                        </p>
                        <br />
                        <p>
                            The other constant is language: I'm a native
                            Mandarin speaker living my daily life in English,
                            and the gap between the two is part of why the
                            Wittgenstein line on my landing page resonates with
                            me.
                        </p>
                    </div>
                    <div style={styles.verticalImage}>
                        <img src={meNow} style={styles.image} alt="" />
                        <p>
                            <sub>
                                <b>Figure 2:</b> Me, 2026
                            </sub>
                        </p>
                    </div>
                </div>
                <br />
                <br />
                <p>
                    Thanks for reading about me! I hope that you enjoy
                    exploring the rest of my portfolio website and everything
                    it has to offer. If you find the easter egg make sure to
                    let me know by email :) Good luck and have fun!
                </p>
                <br />
                <p>
                    If you have any questions or comments I would love to hear
                    them. You can reach me through the{' '}
                    <Link to="/contact">contact page</Link> or shoot me an email
                    at{' '}
                    <a href="mailto:tonyyunyang@outlook.com">
                        tonyyunyang@outlook.com
                    </a>
                </p>
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    contentHeader: {
        marginBottom: 16,
        fontSize: 48,
    },
    image: {
        height: 'auto',
        width: '100%',
    },
    topImage: {
        height: 'auto',
        width: '100%',
        marginBottom: 32,
    },
    verticalImage: {
        alignSelf: 'center',
        // width: '80%',
        marginLeft: 32,
        flex: 0.8,

        alignItems: 'center',
        // marginBottom: 32,
        textAlign: 'center',
        flexDirection: 'column',
    },
};

export default About;
