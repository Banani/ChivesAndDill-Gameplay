import { useState } from "react";
import { States } from "../Details";
import { DetailsStats } from "./useDetailsStats";

interface FightStats {
    startFightTime: number,
    endFightTime: number,
    details: Record<States, DetailsStats[]>
}

export const useStatsAgregator = () => {

    const [fightHistory, setFightHistory] = useState({});
    const [increment, setIncrement] = useState(1);

    const addFightsStats = (params: FightStats) => {
        setFightHistory((prevState) => ({
            ...prevState,
            [increment]: params
        }));
        setIncrement(prev => prev + 1);
    }

    return { addFightsStats, fightHistory };
}