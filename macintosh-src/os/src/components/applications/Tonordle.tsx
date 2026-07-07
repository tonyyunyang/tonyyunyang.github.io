import React from 'react';
import Window from '../os/Window';
import Wordle from '../wordle/Wordle';

export interface TonordleAppProps extends WindowAppProps {}

const TonordleApp: React.FC<TonordleAppProps> = (props) => {
    return (
        <Window
            top={20}
            left={300}
            width={600}
            height={860}
            windowBarIcon="windowGameIcon"
            windowTitle="Tonordle"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText={'© Copyright 2026 Tongyun Yang'}
        >
            <div className="site-page">
                <Wordle />
            </div>
        </Window>
    );
};

export default TonordleApp;
