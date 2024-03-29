import { GlobalStoreModule, ItemClientActions } from '@bananos/types';
import { useContext, useEffect, useState } from 'react';
import { EngineContext } from '../contexts/EngineApiContext';
import { useEngineModuleReader } from './useEngineModuleReader';

interface ItemTemplateProviderProps {
    itemTemplateIds: string[];
}

export const useItemTemplateProvider = ({ itemTemplateIds }: ItemTemplateProviderProps) => {
    const { data: itemTemplates, lastUpdateTime } = useEngineModuleReader(GlobalStoreModule.ITEMS);

    const { callEngineAction } = useContext(EngineContext);
    const [wasRequested, setWasRequested] = useState(false);

    useEffect(() => {
        if (wasRequested) {
            return;
        }

        const requiredItemTemplates = itemTemplateIds.filter((id) => !itemTemplates[id]);
        if (requiredItemTemplates.length > 0) {
           callEngineAction({
              type: ItemClientActions.RequestItemTemplates,
              itemTemplateIds: requiredItemTemplates,
           });
           setWasRequested(true);
        }
    }, [itemTemplateIds, wasRequested]);

    useEffect(() => {
        if (wasRequested) {
            setWasRequested(false);
        }
    }, [Object.keys(itemTemplates).length]);

    return { itemTemplates };
};
