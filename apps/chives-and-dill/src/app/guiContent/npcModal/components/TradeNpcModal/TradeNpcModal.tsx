import { GlobalStoreModule, NpcClientMessages } from '@bananos/types';
import { KeyBoardContext } from 'apps/chives-and-dill/src/contexts/KeyBoardContext';
import { EngineApiContext } from 'apps/chives-and-dill/src/contexts/EngineApi';
import React, { useContext, useEffect, useState } from 'react';
import styles from './TradeNpcModal.module.scss';
import { useEngineModuleReader, useItemTemplateProvider } from 'apps/chives-and-dill/src/hooks';
import { MoneyBar } from '../../../../guiContent/moneyBar/MoneyBar';
import _ from 'lodash';
import { ModalHeader } from '../ModalHeader/ModalHeader';
import { usePagination } from 'apps/creator-web/src/app/mapEditor/spritePanel/components/usePagination';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { SocketContext } from '../../../../gameController/socketContext';

export const TradeNpcModal = ({ closeNpcModal }) => {

   const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;
   const { data: activeConversation } = useEngineModuleReader(GlobalStoreModule.NPC_CONVERSATION);
   const { data: characters } = useEngineModuleReader(GlobalStoreModule.CHARACTER);

   const [paginationRange, setPaginationRange] = useState({ start: 0, end: 0 });
   const [itemsAmount, updateItemsAmount] = useState(0);

   const context = useContext(SocketContext);
   const { socket } = context;

   const { start, end, prevPage, nextPage, page, allPagesCount } = usePagination({
      pageSize: 10,
      itemsAmount,
   });

   useEffect(() => {
      setPaginationRange({ start, end });
   }, [start, end]);

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

   const allItems = _.map(activeNpc.stock, (item) => (
      < div className={styles.Item} onClick={() => buyItem(item, activeNpc)}>
         <img src={item.image} className={styles.ItemImage} alt=""></img>
         <div className={styles.Stack}>{item.stack}</div>
         <div className={styles.ItemInfoWrapper}>
            <div className={styles.ItemText}>{item.name}</div>
            <MoneyBar currency={item.value} />
         </div>
      </div >
   ));

   useEffect(() => {
      updateItemsAmount(_.size(allItems))
   }, [allItems, start, end]);

   const pagination = (items) => {
      if (itemsAmount > 10) {
         return Object.entries(items).slice(paginationRange.start, paginationRange.end).map(entry => entry[1]);
      } else {
         return items;
      }
   }

   const buyItem = (item, npc) => {
      socket?.emit(NpcClientMessages.BuyItemFromNpc, {
         npcId: npc.id,
         itemTemplateId: item.id,
      });
   };

   return (
      <div className={styles.NpcModal}>
         <ModalHeader activeNpc={activeNpc} closeNpcModal={closeNpcModal} />
         <div className={styles.ContentWrapper}>
            <div className={styles.ItemsWrapper}>{pagination(allItems)}</div>
            <div className={styles.PaginationContainer}>
               {page !== 1 ?
                  <div className={styles.PaginationSide}>
                     <button className={styles.PaginationButton} onClick={prevPage}><ArrowUpwardIcon /></button>
                     <div className={styles.PaginationText}>Prev</div>
                  </div> : null}
               {page !== allPagesCount ? <div className={`${styles.PaginationSide} ${styles.RightPaginationSide}`}>
                  <div className={styles.PaginationText}>Next</div>
                  <button className={styles.PaginationButton} onClick={nextPage}><ArrowDownwardIcon /></button>
               </div> : null}
            </div>
            <div className={styles.MoneyBarWrapper}>
               <MoneyBar currency={6435422} />
            </div>
         </div>
      </div>
   );
};
