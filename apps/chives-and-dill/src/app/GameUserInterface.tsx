
import React from 'react';
import { QueryModalManager } from './guiContent/QueryModalManager';
import { ActivePlayerTimeEffects } from './guiContent/activePlayerTimeEffects/ActivePlayerTimeEffects';
import { BottomBar } from './guiContent/bottomBar/BottomBar';
import { CharacterEq } from './guiContent/characterEq/CharacterEq';
import { CharacterFrames } from './guiContent/characterFrames/CharacterFrames';
import { Details } from './guiContent/details/Details';
import { PartyModal } from './guiContent/party/Party';
import { QuestManager } from './guiContent/quests';

export function GameUserInterface() {

    /* {!_.isEmpty(activeLoot[Object.keys(activeLoot ?? {})?.[0]]) ? <LootModal
                monsterId={Object.keys(activeLoot ?? {})?.[0]}
                activeLoot={activeLoot[Object.keys(activeLoot ?? {})?.[0]]} /> : null}
         */

    return (
        <>
            <CharacterFrames />
            <Details />
            <QueryModalManager />
            <QuestManager />
            <PartyModal />
            <BottomBar />
            <ActivePlayerTimeEffects />
            <CharacterEq />
        </>
    );
}
