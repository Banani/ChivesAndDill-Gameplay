import type { GlobalStoreModule } from '@bananos/types';
import { useContext } from 'react';
import { PackageContext } from '../contexts/PackageContext';

export const useEngineModuleReader = (moduleName: GlobalStoreModule) => {
    const state = useContext(PackageContext).state[moduleName];

    return {
        data: state.data,
        events: state.events,
        recentData: state.recentData,
        lastUpdateTime: state.lastUpdateTime,
        lastUpdateEventTime: state.lastUpdateEventTime,
    } as any;
};
