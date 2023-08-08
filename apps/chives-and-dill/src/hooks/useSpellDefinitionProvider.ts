import { GlobalStoreModule, SpellClientActions } from '@bananos/types';
import _ from 'lodash';
import { useContext, useEffect, useMemo, useState } from 'react';
import { EngineContext } from '../contexts/EngineApiContext';
import { useEngineModuleReader } from './useEngineModuleReader';

interface SpellDefinitionProviderProps {
    spellDefinitionIds: string[];
}

export const useSpellDefinitionProvider = ({ spellDefinitionIds }: SpellDefinitionProviderProps) => {
    const { data: spellDefinitions } = useEngineModuleReader(GlobalStoreModule.SPELL_DEFINITION);

    const { callEngineAction } = useContext(EngineContext);
    const [wasRequested, setWasRequested] = useState(false);

    useEffect(() => {
        if (wasRequested) {
            return;
        }

        const requiredSpellDefinitions = spellDefinitionIds.filter((id) => !spellDefinitions[id]);
        if (requiredSpellDefinitions.length > 0) {
            callEngineAction({
                type: SpellClientActions.RequestSpellDefinitions,
                spellIds: requiredSpellDefinitions
            })
            setWasRequested(true);
        }
    }, [spellDefinitionIds, wasRequested, spellDefinitions]);

    useEffect(() => {
        if (wasRequested) {
            setWasRequested(false);
        }
    }, [Object.keys(spellDefinitions).length]);

    const calculatedSpellDefinitions = useMemo(
        () =>
            _.chain(spellDefinitionIds)
                .keyBy()
                .mapValues((definitionId) => spellDefinitions[definitionId])
                .value(),
        [spellDefinitionIds, spellDefinitions]
    );

    return { spellDefinitions: calculatedSpellDefinitions };
};
