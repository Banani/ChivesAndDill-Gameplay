import { GlobalStoreModule } from '@bananos/types';
import { useContext, useEffect, useState } from 'react';
import { EngineApiContext } from '../contexts/EngineApi';
import { useEngineModuleReader } from './useEngineModuleReader';

interface ItemTemplateProviderProps {
    itemTemplateIds: string[];
}

export const useItemTemplateProvider = ({ itemTemplateIds }: ItemTemplateProviderProps) => {
    const { data: itemTemplates, lastUpdateTime } = useEngineModuleReader(GlobalStoreModule.ITEMS);

    const context = useContext(EngineApiContext);
    const { requestItemTemplates } = context;
    const [wasRequested, setWasRequested] = useState(false);

    useEffect(() => { console.log(itemTemplates) }, [lastUpdateTime]);

    useEffect(() => {
        if (wasRequested) {
            return;
        }

        const requiredItemTemplates = itemTemplateIds.filter((id) => !itemTemplates[id]);
        if (requiredItemTemplates.length > 0) {
            requestItemTemplates(requiredItemTemplates);
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
