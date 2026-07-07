import React from 'react';

import strength from '../../../assets/pictures/tony-strength.jpg';
import wife from '../../../assets/pictures/tony-wife.jpg';
import jiandan from '../../../assets/pictures/tony-jiandan.jpg';
import family from '../../../assets/pictures/tony-family.jpg';

export interface LifeProjectsProps {}

const LifeProjects: React.FC<LifeProjectsProps> = (props) => {
    return (
        <div className="site-page-content">
            <h1>Life</h1>
            <h3>Beyond the Desk</h3>
            <br />
            <div className="text-block">
                <p>
                    Research is a marathon, and I mean that literally. Most of
                    what keeps my work sustainable happens away from the
                    keyboard, so this page is for everything that doesn't fit
                    in a BibTeX entry.
                </p>
            </div>
            <div className="text-block">
                <h2>Running & Lifting</h2>
                <br />
                <p>
                    I run regularly — my personal best in a half marathon is{' '}
                    <b>1:43:53</b>, and I'm always quietly negotiating with
                    myself about which minute falls next. Between runs I
                    bodybuild through consistent strength training. The two
                    keep each other honest: the running keeps the lifting
                    humble, and the lifting keeps the running injury-free.
                </p>
                <br />
                <div className="captioned-image" style={styles.figureNarrow}>
                    <img src={strength} style={styles.image} alt="" />
                    <p>
                        <sub>
                            <b>Figure 1:</b> Me, 2026. Consistency compounds.
                        </sub>
                    </p>
                </div>
                <p>
                    When I'm not running or lifting, I love cooking —
                    especially for family. It's the one kind of systems
                    engineering where everyone is happy to review the output.
                    And when the weather wins, I'm out hiking or on a tennis
                    court.
                </p>
            </div>
            <div className="text-block">
                <h2>The Home Team</h2>
                <br />
                <p>
                    None of the above happens alone. My wife is my favorite
                    hiking partner, my toughest food critic, and the reason
                    the running shoes still get used on mornings when the bed
                    argues otherwise.
                </p>
                <br />
                <div className="captioned-image">
                    <img src={wife} style={styles.image} alt="" />
                    <p>
                        <sub>
                            <b>Figure 2:</b> Golden hour — my wife and I, and
                            the co-author of everything else on this site.
                        </sub>
                    </p>
                </div>
                <div style={styles.sideBySide}>
                    <div style={styles.sideText}>
                        <p>
                            The other member of the household is our cat,{' '}
                            <b>煎蛋</b> — "Fried Egg." The name is
                            fortune-certified: 我们五行缺火缺金，煎蛋两者兼得 —
                            our five-elements chart runs short on fire and
                            metal, and a fried egg supplies both. The fire
                            that cooks it, and the gold it turns into.
                        </p>
                        <br />
                        <p>
                            He has never once caught a fish, but he supervises
                            every one I cook.
                        </p>
                    </div>
                    <div style={styles.sideImage}>
                        <div
                            className="captioned-image"
                            style={{ marginBottom: 0 }}
                        >
                            <img src={jiandan} style={styles.image} alt="" />
                            <p>
                                <sub>
                                    <b>Figure 3:</b> 煎蛋, quality-control
                                    inspector, on duty.
                                </sub>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-block">
                <br />
                <div className="captioned-image" style={styles.figureSmall}>
                    <img src={family} style={styles.image} alt="" />
                    <p>
                        <sub>
                            <b>Figure 4:</b> Bangkok, the good old days — in
                            memory of my Dad.
                        </sub>
                    </p>
                </div>
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    image: {
        height: 'auto',
        width: '100%',
    },
    figureNarrow: {
        width: '68%',
    },
    figureSmall: {
        width: '56%',
    },
    sideBySide: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 32,
    },
    sideText: {
        flex: 1.1,
        flexDirection: 'column',
        textAlign: 'justify',
        alignSelf: 'center',
    },
    sideImage: {
        flex: 0.9,
        flexDirection: 'column',
    },
};

export default LifeProjects;
