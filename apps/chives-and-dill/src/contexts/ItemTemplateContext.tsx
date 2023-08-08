import { GlobalStoreModule, ItemClientActions, ItemTemplate } from '@bananos/types';
import { filter } from 'lodash';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useEngineModuleReader } from '../hooks';
import { EngineContext } from './EngineApiContext';

interface ItemTemplateContextReturns {
    itemTemplates: Record<string, ItemTemplate>,
    requestItemTemplate: (itemTemplateId) => void;
}

export const ItemTemplateContext = React.createContext<ItemTemplateContextReturns>(null);

export const ItemTemplateContextProvider = ({ children }) => {
    const [requestedItemsIds, setRequestedItemsIds] = useState<string[]>([]);
    const { data: itemTemplates, lastUpdateTime } = useEngineModuleReader(GlobalStoreModule.ITEMS);
    const { callEngineAction } = useContext(EngineContext);
    const [wasRequested, setWasRequested] = useState(false);

    useEffect(() => {
        if (wasRequested) {
            return;
        }

        requestRequiredItemTemplates();
    }, [requestedItemsIds, wasRequested]);

    useEffect(() => {
        if (wasRequested) {
            setWasRequested(false);
            requestRequiredItemTemplates();
        }
    }, [lastUpdateTime]);

    const requestRequiredItemTemplates = () => {
        const requiredItemTemplates = filter(requestedItemsIds, (id) => !itemTemplates[id]);
        if (requiredItemTemplates.length > 0) {
            callEngineAction({
                type: ItemClientActions.RequestItemTemplates,
                itemTemplateIds: requiredItemTemplates
            });
            setRequestedItemsIds((prev: string[]) => prev.filter(id => requestedItemsIds.indexOf(id) !== -1));
            setWasRequested(true);
        }
    }

    const output = useMemo(() => ({
        itemTemplates: itemTemplates as Record<string, ItemTemplate>,
        requestItemTemplate: (itemTemplate: string) => {
            setRequestedItemsIds((prev: string[]) => prev.indexOf(itemTemplate) === -1 ? [...prev, itemTemplate] : prev);
        }
    }), [lastUpdateTime]);

    return (
        <ItemTemplateContext.Provider
            value={output}
        >
            {children}
        </ItemTemplateContext.Provider>
    );
};
