
import React from 'react';
import { BottomBar } from './guiContent/bottomBar/BottomBar';
import { Details } from './guiContent/details/Details';

export function GameUserInterface() {


    /*      {activeCharacterId ? <ActivePlayerTimeEffects playerId={activeCharacterId} /> : null}
            {!_.isEmpty(activeLoot[Object.keys(activeLoot ?? {})?.[0]]) ? <LootModal
                monsterId={Object.keys(activeLoot ?? {})?.[0]}
                activeLoot={activeLoot[Object.keys(activeLoot ?? {})?.[0]]} /> : null}
            {activeNpc ? <NpcModal questDefinition={questDefinition as Record<string, QuestSchema>} activeNpc={activeNpc} /> : null}
         */

    // pamietac o spowolnieniu
    return (
        <>
            {/* <CharacterFrames /> */}
            {/* <ChatManager /> */}
            <Details />
            {/* <QueryModalManager /> */}
            {/* <QuestManager /> */}
            {/* <PartyModal /> */}
            <BottomBar />
        </>
    );
}
