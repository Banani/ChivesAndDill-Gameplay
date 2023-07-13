import { now } from "lodash";
import React, { FunctionComponent, useEffect, useState } from "react";
import styles from "./SpellLoader.module.scss";

interface SpellLoaderProps {
    castTime: number;
    cooldown: number;
}

export const SpellLoader: FunctionComponent<SpellLoaderProps> = ({ castTime, cooldown }) => {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (!castTime || !cooldown) {
            return;
        }

        setProgress(0);
        const interval = setInterval(() => {
            const newProgress = Math.min(((now() - castTime) / cooldown) * 100, 100);

            setProgress(newProgress);
            if (newProgress === 100) {
                clearInterval(interval);
            }
        }, 1000 / 60);

        return () => clearInterval(interval);
    }, [castTime])

    return <div
        className={styles.spellLoader}
        style={{ background: `conic-gradient(rgba(0, 0, 0, 0) ${progress}%, rgba(30, 30, 30, 0.75) 0)` }}>
    </div>
}