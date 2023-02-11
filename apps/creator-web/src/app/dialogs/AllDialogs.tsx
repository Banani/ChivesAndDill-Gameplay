import { ItemTemplateDialog } from './ItemTemplateDialog';
import { NpcTemplateDialog } from './npcTemplateDialog';
import { QuestDialog } from './questDialog';

export const AllDialogs = () => {
    return (
        <>
            <NpcTemplateDialog />
            <ItemTemplateDialog />
            <QuestDialog />
        </>
    );
};
