import { GlobalStoreModule } from '@bananos/types';
import { EngineApiContext } from 'apps/chives-and-dill/src/contexts/EngineApi';
import { MenuContext } from 'apps/chives-and-dill/src/contexts/MenuContext';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import { map } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { Button } from '../../components/button/Button';
import { ConfirmationDialog } from '../ConfirmationDialog';
import { ChannelNumeratorContext } from '../contexts';
import { InputDialog } from '../InputDialog';
import styles from './ChatChannels.module.scss';

enum ActiveModal {
   CreateChannel = 'CreateChannel',
   AddMember = 'AddMember',
   LeaveChatChannel = 'LeaveChatChannel',
   DeleteChatChannel = 'DeleteChatChannel',
}

export const ChatChannels = () => {
   const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;
   const { data: characters } = useEngineModuleReader(GlobalStoreModule.CHARACTER);
   const { data: chatChannels } = useEngineModuleReader(GlobalStoreModule.CHAT_CHANNEL);

   const engineApiContext = useContext(EngineApiContext);
   const channelNumeratorContext = useContext(ChannelNumeratorContext);
   const menuContext = useContext(MenuContext);

   const [activeModal, setActiveModal] = useState<ActiveModal>(null);
   const [selectedChannelId, setSelectedChannelId] = useState(null);

   useEffect(() => {
      if (selectedChannelId && !chatChannels[selectedChannelId].membersIds[activeCharacterId]) {
         setSelectedChannelId(null);
      }
   }, [chatChannels, activeCharacterId, selectedChannelId]);

   return (
      <>
         <div className={styles.chatChannels}>
            <div className={styles.contentHolder}>
               <div className={styles.objectList + ' ' + styles.channelList}>
                  {map(channelNumeratorContext.channelNumerations, (chatChannelId, chatNumber) => (
                     <div key={chatChannelId}>
                        <button className={`${styles.channelName} ${styles.listElement}`} onClick={() => setSelectedChannelId(chatChannelId)}>
                           {`${chatNumber}. ${chatChannels[chatChannelId].name}`}
                        </button>
                     </div>
                  ))}
               </div>

               <div className={styles.objectList + ' ' + styles.memberList}>
                  {selectedChannelId &&
                     map(chatChannels[selectedChannelId].membersIds, (_, memberId) => (
                        <div
                           key={selectedChannelId + '_' + memberId}
                           className={styles.listElement}
                           onContextMenu={(e) => {
                              e.preventDefault();
                              if (activeCharacterId === memberId) {
                                 menuContext.setActions([
                                    {
                                       label: 'Leave Channel',
                                       action: () => engineApiContext.leaveChatChannel({ chatChannelId: selectedChannelId }),
                                    },
                                 ]);
                              } else if (chatChannels[selectedChannelId].characterOwnerId === activeCharacterId) {
                                 menuContext.setActions([
                                    {
                                       label: 'Promote to owner',
                                       action: () => engineApiContext.changeChatChannelOwner({ chatChannelId: selectedChannelId, newOwnerId: memberId }),
                                    },
                                    {
                                       label: 'Kick from channel',
                                       action: () =>
                                          engineApiContext.removePlayerCharacterFromChatChannel({ chatChannelId: selectedChannelId, characterId: memberId }),
                                    },
                                 ]);
                              }
                           }}
                        >
                           {chatChannels[selectedChannelId].characterOwnerId === memberId && (
                              <img className={styles.crown} src="https://cdn-icons-png.flaticon.com/512/91/91188.png?w=360" />
                           )}
                           <div className={styles.memberName}>{characters[memberId].name}</div>
                        </div>
                     ))}
               </div>
            </div>
            <div className={styles.actionHolder}>
               {selectedChannelId && chatChannels[selectedChannelId].characterOwnerId === activeCharacterId && (
                  <>
                     <Button className={styles.actionButton} onClick={() => setActiveModal(ActiveModal.AddMember)}>
                        Add Member
                     </Button>
                     <Button className={styles.actionButton} onClick={() => setActiveModal(ActiveModal.DeleteChatChannel)}>
                        Delete Channel
                     </Button>
                  </>
               )}
               {selectedChannelId && (
                  <Button className={styles.actionButton} onClick={() => setActiveModal(ActiveModal.LeaveChatChannel)}>
                     Leave Channel
                  </Button>
               )}
               <Button className={styles.actionButton} onClick={() => setActiveModal(ActiveModal.CreateChannel)}>
                  Create Channel
               </Button>
            </div>
         </div>

         <InputDialog
            isVisible={activeModal === ActiveModal.CreateChannel}
            cancel={() => setActiveModal(null)}
            message={'Create Channel'}
            mainAction={(chatChannelName) => {
               engineApiContext.createChatChannel({ chatChannelName });
               setActiveModal(null);
            }}
         />

         <InputDialog
            isVisible={activeModal === ActiveModal.AddMember}
            cancel={() => setActiveModal(null)}
            message={`Who would you like to invite to ${chatChannels?.[selectedChannelId]?.name}`}
            mainAction={(characterName) => {
               engineApiContext.invitePlayerCharacterToChatChannel({ chatChannelId: selectedChannelId, characterName });
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
               engineApiContext.leaveChatChannel({ chatChannelId: selectedChannelId });
            }}
         />

         <ConfirmationDialog
            isVisible={activeModal === ActiveModal.DeleteChatChannel}
            cancel={() => setActiveModal(null)}
            message={`Are you sure, you want to delete ${chatChannels?.[selectedChannelId]?.name}?`}
            accept={() => {
               setSelectedChannelId(null);
               setActiveModal(null);
               engineApiContext.deleteChatChannel({ chatChannelId: selectedChannelId });
            }}
         />
      </>
   );
};
