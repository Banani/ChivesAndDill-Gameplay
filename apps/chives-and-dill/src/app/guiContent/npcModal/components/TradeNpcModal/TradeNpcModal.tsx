import { GlobalStoreModule } from '@bananos/types';
import { KeyBoardContext } from 'apps/chives-and-dill/src/contexts/KeyBoardContext';
import { EngineApiContext } from 'apps/chives-and-dill/src/contexts/EngineApi';
import React, { useContext, useEffect } from 'react';
import styles from './TradeNpcModal.module.scss';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import { MoneyBar } from '../../../../guiContent/moneyBar/MoneyBar';
import _ from 'lodash';
import { ModalHeader } from '../ModalHeader/ModalHeader';

export const TradeNpcModal = () => {

   const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;
   const { data: activeConversation } = useEngineModuleReader(GlobalStoreModule.NPC_CONVERSATION);
   const { data: characters } = useEngineModuleReader(GlobalStoreModule.CHARACTER);

   const engineApiContext = useContext(EngineApiContext);
   const keyBoardContext = useContext(KeyBoardContext);
   const activeNpc = characters[activeConversation[activeCharacterId]?.npcId];

   useEffect(() => {
      keyBoardContext.addKeyHandler({
         id: 'TradeNpcModalEscape',
         matchRegex: 'Escape',
         keydown: engineApiContext.closeNpcConversationDialog,
      });

      return () => {
         keyBoardContext.removeKeyHandler('TradeNpcModalEscape');
      };
   }, [engineApiContext.closeNpcConversationDialog, keyBoardContext]);

   const items = _.map(activeNpc.stock, (item) => (
      < div className={styles.Item}>
         <img src={item.image} className={styles.ItemImage} alt=""></img>
         <div className={styles.Stack}>{item.stack}</div>
         <div className={styles.ItemInfoWrapper}>
            <div className={styles.ItemText}>{item.name}</div>
            <MoneyBar currency={item.value} />
         </div>
      </div>
   ));

   return (
      <div className={styles.NpcModal}>
         <ModalHeader activeNpc={activeNpc} />
         <div className={styles.ContentWrapper}>
            <div className={styles.ItemsWrapper}>{items}</div>
            <div className={styles.MoneyBarWrapper}>
               <MoneyBar currency={6435422} />
            </div>
         </div>
      </div>
   );
};
