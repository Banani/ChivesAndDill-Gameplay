import type { GlobalStoreModule } from '@bananos/types';
import { useContext } from 'react';
import { PackageContext } from '../contexts/PackageContext';

export const useEngineModuleReader = (moduleName: GlobalStoreModule) => {
    const packageContext = useContext(PackageContext);
    const state = packageContext.state[moduleName];
    // console.log(packageContext)

    return {
        data: state.data,
        events: state.events,
        recentData: state.recentData,
        lastUpdateTime: state.lastUpdateTime,
        lastUpdateEventTime: state.lastUpdateEventTime,
    } as any;
};
