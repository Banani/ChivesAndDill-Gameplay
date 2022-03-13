import { GlobalStoreModule, ChatChannelClientMessages } from '@bananos/types';
import { checkIfErrorWasHandled, checkIfPackageIsValid, EngineManager } from 'apps/engine/src/app/testUtilities';
import { Classes } from 'apps/engine/src/app/types/Classes';
import { merge, now } from 'lodash';

jest.mock('lodash', () => ({
   ...(jest.requireActual('lodash') as any),
   now: jest.fn(),
}));

interface setupEngineProps {
   chatChannelName: string;
   watchForErrors: boolean;
}

const CURRENT_MODULE = GlobalStoreModule.CHAT_MESSAGES;

const setupEngine = (props: Partial<setupEngineProps> = {}) => {
   const { chatChannelName, watchForErrors } = merge({ chatChannelName: 'channelName', watchForErrors: false }, props);
   const engineManager = new EngineManager({ watchForErrors });

   const players = {
      '1': engineManager.preparePlayerWithCharacter({ name: 'character_1', class: Classes.Tank }),
      '2': engineManager.preparePlayerWithCharacter({ name: 'character_2', class: Classes.Tank }),
      '3': engineManager.preparePlayerWithCharacter({ name: 'character_3', class: Classes.Tank }),
   };

   let dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ChatChannelClientMessages.CreateChatChannel, chatChannelName });

   const recentlyCreatedChatChannelId = Object.keys(dataPackage.chatChannel.data)[0];

   dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
      type: ChatChannelClientMessages.InvitePlayerCharacterToChatChannel,
      chatChannelId: recentlyCreatedChatChannelId,
      characterName: players['2'].character.name,
   });

   return { engineManager, players, chatChannelName, recentlyCreatedChatChannelId };
};

describe('Chat module - Send chat message action', () => {
   it('Chat members should receive chat message', () => {
      const { engineManager, players, recentlyCreatedChatChannelId } = setupEngine();
      const message = 'Hello there.';
      const currentTime = '12221';

      (now as jest.Mock).mockReturnValue(currentTime);

      let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: ChatChannelClientMessages.SendChatMessage,
         chatChannelId: recentlyCreatedChatChannelId,
         message,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['2'].socketId);

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
         data: {
            chatMessage_0: { authorId: players['1'].characterId, chatChannelId: recentlyCreatedChatChannelId, id: 'chatMessage_0', message, time: currentTime },
         },
      });
   });

   it('Message author should also receive his chat message', () => {
      const { engineManager, players, recentlyCreatedChatChannelId } = setupEngine();
      const message = 'Hello there.';
      const currentTime = '12221';

      (now as jest.Mock).mockReturnValue(currentTime);

      let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: ChatChannelClientMessages.SendChatMessage,
         chatChannelId: recentlyCreatedChatChannelId,
         message,
      });

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
         data: {
            chatMessage_0: { authorId: players['1'].characterId, chatChannelId: recentlyCreatedChatChannelId, id: 'chatMessage_0', message, time: currentTime },
         },
      });
   });

   it('Only members should receive chat message', () => {
      const { engineManager, players, recentlyCreatedChatChannelId } = setupEngine();
      const message = 'Hello there.';
      const currentTime = '12221';

      (now as jest.Mock).mockReturnValue(currentTime);

      let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: ChatChannelClientMessages.SendChatMessage,
         chatChannelId: recentlyCreatedChatChannelId,
         message,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['3'].socketId);

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
         data: {},
      });
   });

   it('Player should get error message when tries to write a message when chat channel does not exist', () => {
      const { engineManager, players, recentlyCreatedChatChannelId } = setupEngine();
      const message = 'Hello there.';

      let dataPackage = engineManager.callPlayerAction(players['3'].socketId, {
         type: ChatChannelClientMessages.SendChatMessage,
         chatChannelId: 'SOME_RANDOM_ID',
         message,
      });

      checkIfErrorWasHandled(CURRENT_MODULE, 'Chat channel does not exist.', dataPackage);
   });

   it('Player should get error message when tries to write a message when he is not a member', () => {
      const { engineManager, players, recentlyCreatedChatChannelId } = setupEngine();
      const message = 'Hello there.';

      let dataPackage = engineManager.callPlayerAction(players['3'].socketId, {
         type: ChatChannelClientMessages.SendChatMessage,
         chatChannelId: recentlyCreatedChatChannelId,
         message,
      });

      checkIfErrorWasHandled(CURRENT_MODULE, 'You are not a member of this chat channel.', dataPackage);
   });

   it('Messages should be deleted when chat channel is deleted', () => {
      const { engineManager, players, recentlyCreatedChatChannelId } = setupEngine();
      const message1 = 'Hello there.';
      const message2 = 'General PeePeePooPoo.';

      let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: ChatChannelClientMessages.SendChatMessage,
         chatChannelId: recentlyCreatedChatChannelId,
         message: message1,
      });

      dataPackage = engineManager.callPlayerAction(players['2'].socketId, {
         type: ChatChannelClientMessages.SendChatMessage,
         chatChannelId: recentlyCreatedChatChannelId,
         message: message2,
      });

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: ChatChannelClientMessages.DeleteChatChannel,
         chatChannelId: recentlyCreatedChatChannelId,
      });

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
         toDelete: { chatMessage_0: null, chatMessage_1: null },
      });
   });

   it('Only messages from deleted chat channel should be deleted', () => {
      const { engineManager, players, recentlyCreatedChatChannelId } = setupEngine({ watchForErrors: true });
      const message1 = 'Hello there.';
      const message2 = 'General PeePeePooPoo.';

      let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: ChatChannelClientMessages.SendChatMessage,
         chatChannelId: recentlyCreatedChatChannelId,
         message: message1,
      });

      dataPackage = engineManager.callPlayerAction(players['2'].socketId, {
         type: ChatChannelClientMessages.SendChatMessage,
         chatChannelId: recentlyCreatedChatChannelId,
         message: message2,
      });

      dataPackage = engineManager.callPlayerAction(players['2'].socketId, {
         type: ChatChannelClientMessages.CreateChatChannel,
         chatChannelName: 'some_name',
      });
      const secChatChannelId = Object.keys(dataPackage.chatChannel.data)[0];

      engineManager.callPlayerAction(players['2'].socketId, {
         type: ChatChannelClientMessages.InvitePlayerCharacterToChatChannel,
         characterName: players['1'].character.name,
         chatChannelId: secChatChannelId,
      });

      engineManager.callPlayerAction(players['1'].socketId, {
         type: ChatChannelClientMessages.SendChatMessage,
         chatChannelId: secChatChannelId,
         message: 'Siema',
      });

      dataPackage = engineManager.callPlayerAction(players['2'].socketId, {
         type: ChatChannelClientMessages.DeleteChatChannel,
         chatChannelId: secChatChannelId,
      });

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
         toDelete: { chatMessage_2: null },
      });
   });
});
