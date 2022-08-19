import { EngineApiContext } from 'apps/chives-and-dill/src/contexts/EngineApi';
import { useEnginePackageProvider } from 'apps/chives-and-dill/src/hooks';
import { map } from 'lodash';
import React, { useContext, useState } from 'react';
import { ConfirmationDialog } from '../ConfirmationDialog';
import { InputDialog } from '../InputDialog';
import styles from './ChatChannels.module.scss';

enum ActiveModal {
   CreateChannel = 'CreateChannel',
   AddMember = 'AddMember',
   LeaveChatChannel = 'LeaveChatChannel',
   DeleteChatChannel = 'DeleteChatChannel',
}

export const ChatChannels = () => {
   const [activeModal, setActiveModal] = useState<ActiveModal>(null);
   const { chatChannels, characters, activeCharacterId } = useEnginePackageProvider();
   const context = useContext(EngineApiContext);
   const [selectedChannelId, setSelectedChannelId] = useState(null);

   return (
      <>
         <div className={styles.chatChannels}>
            <div className={styles.contentHolder}>
               <div className={styles.objectList}>
                  {map(chatChannels, (chatChannel) => (
                     <div onClick={() => setSelectedChannelId(chatChannel.id)}>{chatChannel.name}</div>
                  ))}
               </div>
               <div className={styles.objectList}>
                  {selectedChannelId && map(chatChannels[selectedChannelId].membersIds, (_, memberId) => <>{characters[memberId].name}</>)}
               </div>
            </div>
            <div className={styles.actionHolder}>
               {selectedChannelId && chatChannels[selectedChannelId].characterOwnerId === activeCharacterId && (
                  <>
                     <button onClick={() => setActiveModal(ActiveModal.AddMember)}>Add Member</button>
                     <button onClick={() => setActiveModal(ActiveModal.DeleteChatChannel)}>Delete Channel</button>
                  </>
               )}
               {selectedChannelId && <button onClick={() => setActiveModal(ActiveModal.LeaveChatChannel)}>Leave Channel</button>}
               <button onClick={() => setActiveModal(ActiveModal.CreateChannel)}>Create Channel</button>
            </div>
         </div>

         <InputDialog
            isVisible={activeModal === ActiveModal.CreateChannel}
            cancel={() => setActiveModal(null)}
            message={'Create Channel'}
            mainAction={(chatChannelName) => {
               context.createChatChannel({ chatChannelName });
               setActiveModal(null);
            }}
         />

         <InputDialog
            isVisible={activeModal === ActiveModal.AddMember}
            cancel={() => setActiveModal(null)}
            message={`Who would you like to invite to ${chatChannels?.[selectedChannelId]?.name}`}
            mainAction={(characterName) => {
               context.invitePlayerCharacterToChatChannel({ chatChannelId: selectedChannelId, characterName });
               setActiveModal(null);
            }}
         />

         <ConfirmationDialog
            isVisible={activeModal === ActiveModal.LeaveChatChannel}
            cancel={() => setActiveModal(null)}
            message={`Are you sure, you want to leave ${chatChannels?.[selectedChannelId]?.name}?`}
            accept={() => {
               setSelectedChannelId(null);
               setActiveModal(null);
               context.leaveChatChannel({ chatChannelId: selectedChannelId });
            }}
         />

         <ConfirmationDialog
            isVisible={activeModal === ActiveModal.DeleteChatChannel}
            cancel={() => setActiveModal(null)}
            message={`Are you sure, you want to delete ${chatChannels?.[selectedChannelId]?.name}?`}
            accept={() => {
               setSelectedChannelId(null);
               setActiveModal(null);
               context.deleteChatChannel({ chatChannelId: selectedChannelId });
            }}
         />
      </>
   );
};
