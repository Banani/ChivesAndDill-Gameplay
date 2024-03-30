import { GlobalStore, GlobalStoreModule, PartialEnginePackage, RecursivePartial } from '@bananos/types';
import { forEach, now } from 'lodash';
import React, { FunctionComponent, useEffect, useState } from 'react';

interface PackageContextReturns {
    updatePackage: (enginePackage: RecursivePartial<GlobalStore>) => void;
    state: Record<GlobalStoreModule, any>;
}

export const PackageContext = React.createContext<PackageContextReturns>(null);

export const EngineContexts: Record<GlobalStoreModule, React.Context<any>> = {
    [GlobalStoreModule.CHARACTER_MOVEMENTS]: React.createContext<GlobalStore[GlobalStoreModule.CHARACTER_MOVEMENTS]>(null),
    [GlobalStoreModule.CHARACTER_CLASS]: React.createContext<GlobalStore[GlobalStoreModule.CHARACTER_CLASS]>(null),
    [GlobalStoreModule.PROJECTILE_MOVEMENTS]: React.createContext<GlobalStore[GlobalStoreModule.PROJECTILE_MOVEMENTS]>(null),
    [GlobalStoreModule.SPELL_CHANNELS]: React.createContext<GlobalStore[GlobalStoreModule.SPELL_CHANNELS]>(null),
    [GlobalStoreModule.CHARACTER_POWER_POINTS]: React.createContext<GlobalStore[GlobalStoreModule.CHARACTER_POWER_POINTS]>(null),
    [GlobalStoreModule.TIME_EFFECTS]: React.createContext<GlobalStore[GlobalStoreModule.TIME_EFFECTS]>(null),
    [GlobalStoreModule.AREA_TIME_EFFECTS]: React.createContext<GlobalStore[GlobalStoreModule.AREA_TIME_EFFECTS]>(null),
    [GlobalStoreModule.SPELLS]: React.createContext<GlobalStore[GlobalStoreModule.SPELLS]>(null),
    [GlobalStoreModule.POWER_STACKS]: React.createContext<GlobalStore[GlobalStoreModule.POWER_STACKS]>(null),
    [GlobalStoreModule.ABSORB_SHIELDS]: React.createContext<GlobalStore[GlobalStoreModule.ABSORB_SHIELDS]>(null),
    [GlobalStoreModule.CHARACTER]: React.createContext<GlobalStore[GlobalStoreModule.CHARACTER]>(null),
    [GlobalStoreModule.ACTIVE_CHARACTER]: React.createContext<GlobalStore[GlobalStoreModule.ACTIVE_CHARACTER]>(null),
    [GlobalStoreModule.MAP_SCHEMA]: React.createContext<GlobalStore[GlobalStoreModule.MAP_SCHEMA]>(null),
    [GlobalStoreModule.ACTIVE_LOOT]: React.createContext<GlobalStore[GlobalStoreModule.ACTIVE_LOOT]>(null),
    [GlobalStoreModule.ERROR_MESSAGES]: React.createContext<GlobalStore[GlobalStoreModule.ERROR_MESSAGES]>(null),
    [GlobalStoreModule.CHAT_CHANNEL]: React.createContext<GlobalStore[GlobalStoreModule.CHAT_CHANNEL]>(null),
    [GlobalStoreModule.CHAT_MESSAGES]: React.createContext<GlobalStore[GlobalStoreModule.CHAT_MESSAGES]>(null),
    [GlobalStoreModule.EXPERIENCE]: React.createContext<GlobalStore[GlobalStoreModule.EXPERIENCE]>(null),
    [GlobalStoreModule.CURRENCY]: React.createContext<GlobalStore[GlobalStoreModule.CURRENCY]>(null),
    [GlobalStoreModule.BACKPACK_SCHEMA]: React.createContext<GlobalStore[GlobalStoreModule.BACKPACK_SCHEMA]>(null),
    [GlobalStoreModule.BACKPACK_ITEMS]: React.createContext<GlobalStore[GlobalStoreModule.BACKPACK_ITEMS]>(null),
    [GlobalStoreModule.ITEMS]: React.createContext<GlobalStore[GlobalStoreModule.ITEMS]>(null),
    [GlobalStoreModule.NPC_CONVERSATION]: React.createContext<GlobalStore[GlobalStoreModule.NPC_CONVERSATION]>(null),
    [GlobalStoreModule.NPC_STOCK]: React.createContext<GlobalStore[GlobalStoreModule.NPC_STOCK]>(null),
    [GlobalStoreModule.QUEST_DEFINITION]: React.createContext<GlobalStore[GlobalStoreModule.QUEST_DEFINITION]>(null),
    [GlobalStoreModule.NPC_QUESTS]: React.createContext<GlobalStore[GlobalStoreModule.NPC_QUESTS]>(null),
    [GlobalStoreModule.QUEST_PROGRESS]: React.createContext<GlobalStore[GlobalStoreModule.QUEST_PROGRESS]>(null),
    [GlobalStoreModule.CORPSE_DROP]: React.createContext<GlobalStore[GlobalStoreModule.CORPSE_DROP]>(null),
    [GlobalStoreModule.EQUIPMENT]: React.createContext<GlobalStore[GlobalStoreModule.EQUIPMENT]>(null),
    [GlobalStoreModule.ATTRIBUTES]: React.createContext<GlobalStore[GlobalStoreModule.ATTRIBUTES]>(null),
    [GlobalStoreModule.COMBAT_STATE]: React.createContext<GlobalStore[GlobalStoreModule.COMBAT_STATE]>(null),
    [GlobalStoreModule.AVAILABLE_SPELLS]: React.createContext<GlobalStore[GlobalStoreModule.AVAILABLE_SPELLS]>(null),
    [GlobalStoreModule.SPELL_DEFINITION]: React.createContext<GlobalStore[GlobalStoreModule.SPELL_DEFINITION]>(null),
    [GlobalStoreModule.SPELL_CAST_TIME]: React.createContext<GlobalStore[GlobalStoreModule.SPELL_CAST_TIME]>(null),
    [GlobalStoreModule.PARTY]: React.createContext<GlobalStore[GlobalStoreModule.PARTY]>(null),
    [GlobalStoreModule.PARTY_INVITATION]: React.createContext<GlobalStore[GlobalStoreModule.PARTY_INVITATION]>(null),
};

const deleteRequestedFields = (data: any, pathToDelete: any) => {
    forEach(pathToDelete, (toDelete, key) => {
        if (toDelete === null) {
            delete data[key];
        } else {
            deleteRequestedFields(data[key], toDelete);
        }
    });
};

export const customMerge = (data: any, pathToUpdate: any) => {
    forEach(pathToUpdate, (toUpdate, key) => {
        if (typeof toUpdate === 'object' && toUpdate !== null) {
            // to jest po to jesli obiekt zmieni typ, najpierw bedzie liczba, potem nagle obiektem
            if (typeof data[key] !== 'object' || data[key] === null) {
                data[key] = {};
            }

            if (Array.isArray(pathToUpdate[key])) {
                data[key] = toUpdate;
            } else {
                customMerge(data[key], pathToUpdate[key]);
            }
        } else {
            data[key] = toUpdate;
        }
    });
    return data;
};

const internalState = {};
for (let i in EngineContexts) {
    internalState[i] = {
        data: {},
        recentData: {},
        events: [],
        lastUpdateTime: 0,
        lastEventUpdateTime: 0
    }
}

export const PackageContextProvider: FunctionComponent = ({ children }) => {
    const [state, setState] = useState(null);

    // CZY TO NA PEWNO POPRAWIA PERFORMANCE? 
    // init state
    useEffect(() => {
        setState({ internalState });
    }, []);


    const updatePackage = (payload: any) => {
        forEach(payload, (module: PartialEnginePackage<any>, moduleName: string) => {
            const currentTime = now();
            if (module.events) {
                internalState[moduleName].events = module.events;
                internalState[moduleName].lastEventUpdateTime = currentTime;
            }

            customMerge(internalState[moduleName].data, module.data);
            deleteRequestedFields(internalState[moduleName].data, module.toDelete);

            internalState[moduleName].lastUpdateTime = currentTime;
            internalState[moduleName].recentData = module.data;
        });

        setState({ internalState });

        (window as any).engineState = internalState;
    };

    if (!state) {
        return null;
    }

    return (
        <PackageContext.Provider
            value={
                {
                    state: state.internalState,
                    updatePackage,
                } as PackageContextReturns
            }
        >
            {children}
        </PackageContext.Provider>
    );
};
