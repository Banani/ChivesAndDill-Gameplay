import { ChatChannelClientActions, GlobalStoreModule } from '@bananos/types';
import { EngineContext } from 'apps/chives-and-dill/src/contexts/EngineApiContext';
import { MenuContext } from 'apps/chives-and-dill/src/contexts/MenuContext';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import { map } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { RectangleButton } from '../../components/rectangleButton/RectangleButton';
import { ConfirmationDialog } from '../ConfirmationDialog';
import { InputDialog } from '../InputDialog';
import { ChannelNumeratorContext } from '../contexts';
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

    const channelNumeratorContext = useContext(ChannelNumeratorContext);
    const menuContext = useContext(MenuContext);
    const { callEngineAction } = useContext(EngineContext);

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
                                                    action: () => callEngineAction({
                                                        type: ChatChannelClientActions.LeaveChatChannel,
                                                        chatChannelId: selectedChannelId
                                                    }),
                                                },
                                            ]);
                                        } else if (chatChannels[selectedChannelId].characterOwnerId === activeCharacterId) {
                                            menuContext.setActions([
                                                {
                                                    label: 'Promote to owner',
                                                    action: () => callEngineAction({
                                                        type: ChatChannelClientActions.ChangeChatChannelOwner,
                                                        chatChannelId: selectedChannelId,
                                                        newOwnerId: memberId
                                                    }),
                                                },
                                                {
                                                    label: 'Kick from channel',
                                                    action: () =>
                                                        callEngineAction({
                                                            type: ChatChannelClientActions.RemovePlayerCharacterFromChatChannel,
                                                            chatChannelId: selectedChannelId,
                                                            characterId: memberId
                                                        }),
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
                            <RectangleButton className={styles.actionButton} onClick={() => setActiveModal(ActiveModal.AddMember)}>
                                Add Member
                            </RectangleButton>
                            <RectangleButton className={styles.actionButton} onClick={() => setActiveModal(ActiveModal.DeleteChatChannel)}>
                                Delete Channel
                            </RectangleButton>
                        </>
                    )}
                    {selectedChannelId && (
                        <RectangleButton className={styles.actionButton} onClick={() => setActiveModal(ActiveModal.LeaveChatChannel)}>
                            Leave Channel
                        </RectangleButton>
                    )}
                    <RectangleButton className={styles.actionButton} onClick={() => setActiveModal(ActiveModal.CreateChannel)}>
                        Create Channel
                    </RectangleButton>
                </div>
            </div>

            <InputDialog
                isVisible={activeModal === ActiveModal.CreateChannel}
                cancel={() => setActiveModal(null)}
                message={'Create Channel'}
                mainAction={(chatChannelName) => {
                    callEngineAction({
                        type: ChatChannelClientActions.CreateChatChannel,
                        chatChannelName
                    });
                    setActiveModal(null);
                }}
            />

            <InputDialog
                isVisible={activeModal === ActiveModal.AddMember}
                cancel={() => setActiveModal(null)}
                message={`Who would you like to invite to ${chatChannels?.[selectedChannelId]?.name}`}
                mainAction={(characterName) => {
                    callEngineAction({
                        type: ChatChannelClientActions.AddPlayerCharacterToChatChannel,
                        chatChannelId: selectedChannelId,
                        characterName
                    });
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
                    callEngineAction({
                        type: ChatChannelClientActions.LeaveChatChannel,
                        chatChannelId: selectedChannelId
                    });
                }}
            />

            <ConfirmationDialog
                isVisible={activeModal === ActiveModal.DeleteChatChannel}
                cancel={() => setActiveModal(null)}
                message={`Are you sure, you want to delete ${chatChannels?.[selectedChannelId]?.name}?`}
                accept={() => {
                    setSelectedChannelId(null);
                    setActiveModal(null);
                    callEngineAction({
                        type: ChatChannelClientActions.DeleteChatChannel,
                        chatChannelId: selectedChannelId
                    });
                }}
            />
        </>
    );
};
