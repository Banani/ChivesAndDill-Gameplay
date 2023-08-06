import { AbsorbShieldTrack, ExperienceExternalTrack, GlobalStoreModule, PowerPointsTrack, PowerStackType, TimeEffect } from '@bananos/types';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import React, { useContext } from 'react';
import { GameControllerContext } from '../../gameController/gameController';
import styles from './CharacterFrames.module.scss';
import { PlayerIcon } from './playerIcon/PlayerIcon';
import { TargetIcon } from './targetIcon/TargetIcon';

interface CharacterFramesData {
    activeCharacterId: string,
    activeTargetId: string,
    experience: Record<string, ExperienceExternalTrack>,
    characters: Record<string, any>,
    characterPowerPoints: Record<string, PowerPointsTrack>,
    powerStacks: Record<string, Partial<Record<PowerStackType, number>>>,
    combatState: Record<string, boolean>,
    timeEffects: Record<string, TimeEffect>,
    absorbShields: Record<string, AbsorbShieldTrack>,
    lastUpdate: string
}

export const CharacterFramesContext = React.createContext<CharacterFramesData>(null);

export const CharacterFrames = () => {
    const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;
    const { data: experience, lastUpdateTime: experienceLastUpdateTime } = useEngineModuleReader(GlobalStoreModule.EXPERIENCE);
    const { data: characters, lastUpdateTime: charactersLastUpdateTime } = useEngineModuleReader(GlobalStoreModule.CHARACTER);
    const { data: characterPowerPoints, lastUpdateTime: lastUpdateTimeCharacterPowerPoints } = useEngineModuleReader(GlobalStoreModule.CHARACTER_POWER_POINTS);
    const { data: powerStacks, lastUpdateTime: powerStacksLastUpdateTime } = useEngineModuleReader(GlobalStoreModule.POWER_STACKS);
    const { data: combatState, lastUpdateTime: combatStateLastUpdateTime } = useEngineModuleReader(GlobalStoreModule.COMBAT_STATE);
    const { data: timeEffects, lastUpdateTime: timeEffectsLastUpdateTime } = useEngineModuleReader(GlobalStoreModule.TIME_EFFECTS);
    const { data: absorbShields, lastUpdateTime: absorbShieldsLastUpdateTime } = useEngineModuleReader(GlobalStoreModule.ABSORB_SHIELDS);
    const { activeTargetId } = useContext(GameControllerContext);

    return <CharacterFramesInternal
        activeTargetId={activeTargetId}
        activeCharacterId={activeCharacterId}
        experience={experience as Record<string, ExperienceExternalTrack>}
        characters={characters}
        characterPowerPoints={characterPowerPoints as Record<string, PowerPointsTrack>}
        powerStacks={powerStacks as Record<string, Partial<Record<PowerStackType, number>>>}
        combatState={combatState as Record<string, boolean>}
        timeEffects={timeEffects as Record<string, TimeEffect>}
        absorbShields={absorbShields as Record<string, AbsorbShieldTrack>}
        lastUpdate={
            lastUpdateTimeCharacterPowerPoints + "#" +
            experienceLastUpdateTime + "#" +
            charactersLastUpdateTime + "#" +
            powerStacksLastUpdateTime + "#" +
            combatStateLastUpdateTime + "#" +
            timeEffectsLastUpdateTime + "#" +
            absorbShieldsLastUpdateTime
        }
    />
}



const CharacterFramesInternal = React.memo((characterFramesData: CharacterFramesData) => {
    return (
        <CharacterFramesContext.Provider value={characterFramesData}>
            <div className={styles.CharacterFrames}>
                {characterFramesData.activeCharacterId ? <PlayerIcon playerId={characterFramesData.activeCharacterId}></PlayerIcon> : null}
                <TargetIcon />
            </div>
        </CharacterFramesContext.Provider >
    );
}, (oldProps, newProps) => oldProps.lastUpdate === newProps.lastUpdate);
