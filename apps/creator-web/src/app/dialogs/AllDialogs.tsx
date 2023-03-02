import { ItemTemplateDialog } from './ItemTemplateDialog';
import { MonsterTemplateDialog } from './monsterTemplateDialog';
import { NpcTemplateDialog } from './npcTemplateDialog';
import { QuestDialog } from './questDialog';

export const AllDialogs = () => {
    return (
        <>
            <NpcTemplateDialog />
            <MonsterTemplateDialog />
            <ItemTemplateDialog />
            <QuestDialog />
        </>
    );
};
