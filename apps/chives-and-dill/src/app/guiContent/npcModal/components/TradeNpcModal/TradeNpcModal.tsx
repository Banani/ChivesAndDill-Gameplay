import { GlobalStoreModule, NpcClientActions } from '@bananos/types';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { ItemPreview } from 'apps/chives-and-dill/src/components/itemPreview/ItemPreview';
import { EngineContext } from 'apps/chives-and-dill/src/contexts/EngineApiContext';
import { ItemTemplateContext } from 'apps/chives-and-dill/src/contexts/ItemTemplateContext';
import { KeyBoardContext } from 'apps/chives-and-dill/src/contexts/KeyBoardContext';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import { usePagination } from 'apps/creator-web/src/app/views/components/pagination/usePagination';
import _, { forEach } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { ItemPreviewHighlight } from '../../../../../components/itemPreview/ItemPreview';
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

    const { callEngineAction } = useContext(EngineContext);

    const { start, end, prevPage, nextPage, page, allPagesCount } = usePagination({
        pageSize: 10,
        itemsAmount,
    });

    useEffect(() => {
        setPaginationRange({ start, end });
    }, [start, end]);

    const keyBoardContext = useContext(KeyBoardContext);
    const { itemTemplates, requestItemTemplate } = useContext(ItemTemplateContext);
    const activeNpc = characters[activeConversation[activeCharacterId]?.npcId];

    useEffect(() => {
        forEach(Object.keys(activeNpc.stock), (itemTemplateId) => {
            if (!itemTemplates[itemTemplateId]) {
                requestItemTemplate(itemTemplateId);
            }
        });
    }, [itemTemplates, requestItemTemplate, activeNpc.stock]);

    useEffect(() => {
        keyBoardContext.addKeyHandler({
            id: 'TradeNpcModalEscape',
            matchRegex: 'Escape',
            keydown: () => callEngineAction({ type: NpcClientActions.CloseNpcConversationDialog }),
        });

        return () => {
            keyBoardContext.removeKeyHandler('TradeNpcModalEscape');
        };
    }, []);

    const allItems = _.map(activeNpc.stock, (_, itemTemplateId) =>
        itemTemplates[itemTemplateId] ? (
            <div className={styles.ItemContainer} key={itemTemplateId}>
                <ItemPreview
                    itemTemplate={itemTemplates[itemTemplateId]}
                    handleItemClick={() => buyItem(itemTemplates[itemTemplateId], activeNpc)}
                    showMoney={true}
                    highlight={ItemPreviewHighlight.icon}
                />
            </div>
        ) : null
    );

    useEffect(() => {
        updateItemsAmount(_.size(allItems));
    }, [allItems, start, end]);

    const pagination = (items) => {
        if (itemsAmount > 10) {
            return Object.entries(items)
                .slice(paginationRange.start, paginationRange.end)
                .map((entry) => entry[1]);
        } else {
            return items;
        }
    };

    const buyItem = (item, npc) => {
        callEngineAction({
            type: NpcClientActions.BuyItemFromNpc,
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
                    {page !== 1 ? (
                        <div className={styles.PaginationSide}>
                            <button className={styles.PaginationButton} onClick={prevPage}>
                                <ArrowUpwardIcon />
                            </button>
                            <div className={styles.PaginationText}>Prev</div>
                        </div>
                    ) : null}
                    {page !== allPagesCount ? (
                        <div className={`${styles.PaginationSide} ${styles.RightPaginationSide}`}>
                            <div className={styles.PaginationText}>Next</div>
                            <button className={styles.PaginationButton} onClick={nextPage}>
                                <ArrowDownwardIcon />
                            </button>
                        </div>
                    ) : null}
                </div>
                <div className={styles.MoneyBarWrapper}>
                    <MoneyBar currency={PlayerMoney} />
                </div>
            </div>
        </div>
    );
};
