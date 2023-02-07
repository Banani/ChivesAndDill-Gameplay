import { ItemTemplateDialog } from './ItemTemplateDialog';
import { NpcTemplateDialog } from './npcTemplateDialog';
import { QuestDialog } from './QuestDialog';

export const AllDialogs = () => {
   return (
      <>
         <NpcTemplateDialog />
         <ItemTemplateDialog />
         <QuestDialog />
      </>
   );
};
