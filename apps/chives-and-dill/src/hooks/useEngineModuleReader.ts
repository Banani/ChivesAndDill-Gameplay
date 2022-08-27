import type { GlobalStore, GlobalStoreModule } from '@bananos/types';
import { useContext } from 'react';
import { EngineContexts } from '../contexts/PackageContext';

export const useEngineModuleReader = (moduleName: GlobalStoreModule) => {
   const context = useContext(EngineContexts[moduleName]);

   return {
      data: context?.data,
      events: context?.events,
      recentData: context?.recentData,
      lastUpdateTime: context?.lastUpdateTime,
   } as GlobalStore[typeof moduleName];
};
