
import React from 'react';
import { QueryModalManager } from './guiContent/QueryModalManager';
import { ActivePlayerTimeEffects } from './guiContent/activePlayerTimeEffects/ActivePlayerTimeEffects';
import { Backpacks } from './guiContent/backpacks/Backpacks';
import { BottomBar } from './guiContent/bottomBar/BottomBar';
import { CharacterEq } from './guiContent/characterEq/CharacterEq';
import { CharacterFrames } from './guiContent/characterFrames/CharacterFrames';
import { ChatManager } from './guiContent/chat';
import { Details } from './guiContent/details/Details';
import { LootModal } from './guiContent/lootModal/LootModal';
import { NpcModal } from './guiContent/npcModal/NpcModal';
import { PartyModal } from './guiContent/party/Party';
import { QuestManager } from './guiContent/quests';

export function GameUserInterface() {
    return (
        <>
            <LootModal />
            <CharacterFrames />
            <ChatManager />
            <Details />
            <QueryModalManager />
            <QuestManager />
            <PartyModal />
            <BottomBar />
            <NpcModal />
            <ActivePlayerTimeEffects />
            <CharacterEq />
            <Backpacks />
        </>
    );
}
