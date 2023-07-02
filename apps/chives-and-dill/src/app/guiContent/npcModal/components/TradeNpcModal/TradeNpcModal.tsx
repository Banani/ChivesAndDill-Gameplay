import { GlobalStoreModule, NpcClientMessages } from '@bananos/types';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { EngineApiContext } from 'apps/chives-and-dill/src/contexts/EngineApi';
import { KeyBoardContext } from 'apps/chives-and-dill/src/contexts/KeyBoardContext';
import { useEngineModuleReader, useItemTemplateProvider } from 'apps/chives-and-dill/src/hooks';
import { usePagination } from 'apps/creator-web/src/app/views/components/pagination/usePagination';
import _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../../../../gameController/socketContext';
import { MoneyBar } from '../../../../guiContent/moneyBar/MoneyBar';
import { ModalHeader } from '../ModalHeader/ModalHeader';
import styles from './TradeNpcModal.module.scss';

export const TradeNpcModal = ({ closeNpcModal }) => {

    const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;
    const { data: activeConversation } = useEngineModuleReader(GlobalStoreModule.NPC_CONVERSATION);
    const { data: characters } = useEngineModuleReader(GlobalStoreModule.CHARACTER);
    const PlayerMoney = useEngineModuleReader(GlobalStoreModule.CURRENCY).data[activeCharacterId];

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
    const { itemTemplates } = useItemTemplateProvider({ itemTemplateIds: Object.keys(activeNpc.stock) });

    useEffect(() => {
        keyBoardContext.addKeyHandler({
            id: 'TradeNpcModalEscape',
            matchRegex: 'Escape',
            keydown: engineApiContext.closeNpcConversationDialog,
        });

        return () => {
            keyBoardContext.removeKeyHandler('TradeNpcModalEscape');
        };
    }, []);

    const allItems = _.map(activeNpc.stock, (_, itemId) =>
        itemTemplates[itemId] ?
            (<div className={styles.Item} onClick={() => buyItem(itemTemplates[itemId], activeNpc)}>
                <img src={itemTemplates[itemId].image} className={styles.ItemImage} alt=""></img>
                {itemTemplates[itemId].stack > 1 && <div className={styles.Stack}>{itemTemplates[itemId].stack}</div>}
                <div className={styles.ItemInfoWrapper}>
                    <div className={styles.ItemText}>{itemTemplates[itemId].name}</div>
                    <MoneyBar currency={itemTemplates[itemId].value} />
                </div>
            </div>
            ) : null);

    useEffect(() => {
        updateItemsAmount(_.size(allItems));
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

    console.log(123)

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
                    <MoneyBar currency={PlayerMoney} />
                </div>
            </div>
        </div>
    );
};
