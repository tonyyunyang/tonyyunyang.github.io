import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Easing } from '../Animation';

interface HomeButtonProps {}

const HomeButton: React.FC<HomeButtonProps> = ({}) => {
    const [isHovering, setIsHovering] = useState(false);
    const [isActive, setIsActive] = useState(false);

    return (
        <a href="/" style={styles.link} id="prevent-click">
            <motion.div
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onMouseDown={() => setIsActive(true)}
                onMouseUp={() => setIsActive(false)}
                style={Object.assign({}, styles.container, {
                    background: isHovering ? 'white' : 'black',
                })}
                className="icon-control-container"
                id="prevent-click"
                animate={
                    isActive ? 'active' : isHovering ? 'hovering' : 'default'
                }
                variants={containerVars}
            >
                <p
                    id="prevent-click"
                    style={Object.assign({}, styles.text, {
                        color: isHovering ? 'black' : 'white',
                    })}
                >
                    ← Home
                </p>
            </motion.div>
        </a>
    );
};

const containerVars = {
    hovering: {
        transition: {
            duration: 0.1,
            ease: 'easeOut',
        },
    },
    active: {
        scale: 0.9,
        transition: {
            duration: 0.1,
            ease: Easing.expOut,
        },
    },
    default: {
        scale: 1,
        transition: {
            duration: 0.2,
            ease: 'easeOut',
        },
    },
};

const styles: StyleSheetCSS = {
    link: {
        textDecoration: 'none',
    },
    container: {
        // matches the toggle boxes' height; width hugs the label
        width: 'auto',
        paddingLeft: 12,
        paddingRight: 12,
        textAlign: 'center',
        display: 'flex',
        boxSizing: 'border-box',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
    },
    text: {
        whiteSpace: 'nowrap',
    },
};

export default HomeButton;
