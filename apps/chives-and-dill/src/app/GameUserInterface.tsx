import { Details } from '@mui/icons-material';
import React from 'react';
import { CharacterFrames } from './guiContent/characterFrames/CharacterFrames';
import { ChatManager } from './guiContent/chat';

export function GameUserInterface() {


    /* {activeCharacterId ? <BottomBar /> : null}
            {activeCharacterId ? <ActivePlayerTimeEffects playerId={activeCharacterId} /> : null}
            <QuestManager />
            {!_.isEmpty(activeLoot[Object.keys(activeLoot ?? {})?.[0]]) ? <LootModal
                monsterId={Object.keys(activeLoot ?? {})?.[0]}
                activeLoot={activeLoot[Object.keys(activeLoot ?? {})?.[0]]} /> : null}
            {activeNpc ? <NpcModal questDefinition={questDefinition as Record<string, QuestSchema>} activeNpc={activeNpc} /> : null}
            <PartyModal />
            <QueryModalManager /> */

    return (
        <>
            <CharacterFrames />
            <ChatManager />
            <Details />
        </>
    );
}
