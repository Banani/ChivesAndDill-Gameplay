import _ from "lodash";
import { useEffect, useState } from "react";

export interface DetailsStats {
    id: string,
    amount: number,
};

export const useDetailsStats = ({ characterPowerPointsEvents, eventPropertyId, eventType }) => {

    const [detailsStats, updateDetailsStats] = useState<DetailsStats[]>([]);

    useEffect(() => {
        const events = characterPowerPointsEvents.filter((event) => (event.type === eventType));
        const toUpdateDetailsStats = _.cloneDeep(detailsStats);

        events.forEach(event => {
            let stateIndexId = _.findIndex(toUpdateDetailsStats, (detailsStat) => { return detailsStat.id === event[eventPropertyId]; });
            if (stateIndexId === -1) {
                toUpdateDetailsStats.push({
                    id: event[eventPropertyId],
                    amount: 0,
                });
                stateIndexId = toUpdateDetailsStats.length - 1;
            }
            toUpdateDetailsStats[stateIndexId].amount += event.amount;

            while (stateIndexId !== 0 && toUpdateDetailsStats[stateIndexId].amount > toUpdateDetailsStats[stateIndexId - 1].amount) {
                const temp = toUpdateDetailsStats[stateIndexId];
                toUpdateDetailsStats[stateIndexId] = toUpdateDetailsStats[stateIndexId - 1];
                toUpdateDetailsStats[stateIndexId - 1] = temp;
                stateIndexId--;
            }

        });

        updateDetailsStats(toUpdateDetailsStats);

    }, [characterPowerPointsEvents])

    const clearDetailsStats = () => {
        updateDetailsStats([]);
    }

    return { detailsStats, clearDetailsStats };
}