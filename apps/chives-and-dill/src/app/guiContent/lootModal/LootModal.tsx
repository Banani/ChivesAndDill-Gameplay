import { GlobalStoreModule, PlayerClientActions } from '@bananos/types';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { ItemPreview, ItemPreviewHighlight } from 'apps/chives-and-dill/src/components/itemPreview/ItemPreview';
import { EngineContext } from 'apps/chives-and-dill/src/contexts/EngineApiContext';
import { ItemTemplateContext } from 'apps/chives-and-dill/src/contexts/ItemTemplateContext';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import _, { forEach } from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { usePagination } from '../../../components/pagination/usePagination';
import { RectangleButton } from '../components/rectangleButton/RectangleButton';
import { CalculateCurrenty } from '../moneyBar/CalculateCurrency';
import styles from "./LootModal.module.scss";

export const LootModal = () => {
    const { data: activeLootData } = useEngineModuleReader(GlobalStoreModule.ACTIVE_LOOT);
    const activeCorpseId = Object.keys(activeLootData ?? {})?.[0]
    const activeLoot = activeLootData[activeCorpseId];
    const monsterId = Object.keys(activeLoot ?? {})?.[0];

    const [mousePosition, setMousePosition] = useState({ x: null, y: null });
    const [itemsAmount, updateItemsAmount] = useState(0);
    const [paginationRange, setPaginationRange] = useState({ start: 0, end: 0 });

    const { callEngineAction } = useContext(EngineContext);
    const { itemTemplates, requestItemTemplate } = useContext(ItemTemplateContext);

    const { start, end, prevPage, nextPage, page, allPagesCount } = usePagination({
        pageSize: 3,
        itemsAmount,
    });

    useEffect(() => {
        if (!activeLoot) {
            return;
        }

        forEach(activeLoot.items, item => {
            requestItemTemplate(item.itemTemplateId);
        });
    }, [activeLoot, itemTemplates]);

    useEffect(() => {
        setPaginationRange({ start, end });
    }, [start, end]);

    useEffect(() => {
        if (!activeLoot) {
            return;
        }

        if (activeLoot.coins) {
            updateItemsAmount(1 + _.size(activeLoot.items));
        } else {
            updateItemsAmount(_.size(activeLoot.items));
        }
    }, [activeLoot?.items, activeLoot?.coins]);

    const updateMousePosition = useCallback(
        (e) => {

            if (_.isEmpty(activeLoot)) {
                setMousePosition({ x: null, y: null });
            }

            if (mousePosition.x === null) {
                setMousePosition({ x: e.offsetX, y: e.offsetY });
            }
        },
        [mousePosition, activeLoot]
    );

    useEffect(() => {
        window.addEventListener('click', updateMousePosition);

        return () => window.removeEventListener('click', updateMousePosition);
    }, [activeLoot, updateMousePosition]);

    const handleItemClick = (itemId) => {
        callEngineAction({
            type: PlayerClientActions.PickItemFromCorpse,
            corpseId: activeCorpseId,
            itemId
        });
    };

    const handleCoinsClick = (corpseId) => {
        callEngineAction({
            type: PlayerClientActions.PickCoinsFromCorpse,
            corpseId
        });
    };

    const coinAmount = (type) => {
        if (type.amount) {
            return type.amount ? <div>{type.amount + ' ' + type.text}</div> : null;
        }
    };

    const coinImage = (coins) => {
        if (coins.gold.amount) {
            return coins.gold.image;
        }

        if (coins.silver.amount) {
            return coins.silver.image;
        }

        return coins.copper.image;
    };

    const coins = () => {
        if (activeLoot?.coins) {
            const coinsTemplate = CalculateCurrenty(activeLoot.coins) as any;

            return (
                <div className={styles.Item} onClick={() => handleCoinsClick(monsterId)}>
                    <img src={coinImage(coinsTemplate)} className={styles.ItemImage} alt=""></img>
                    <div className={styles.RewardText}>
                        {coinAmount(coinsTemplate.gold)}
                        {coinAmount(coinsTemplate.silver)}
                        {coinAmount(coinsTemplate.copper)}
                    </div>
                </div>
            );
        }
    };

    const activeItems = () => {
        let items = _.chain(activeLoot ? activeLoot.items : [])
            .pickBy(drop => itemTemplates[drop.itemTemplateId])
            .map((key, corpseItemId) => {
                const item = activeLoot.items[corpseItemId];
                const itemData = itemTemplates[item.itemTemplateId];

                return <div className={styles.ItemContainer}>
                    <ItemPreview
                        itemData={itemData as any}
                        handleItemClick={() => handleItemClick(corpseItemId)}
                        showMoney={false}
                        highlight={ItemPreviewHighlight.full}
                    />
                </div>
            }).value();

        items = [coins(), ...items];

        if (itemsAmount > 3) {
            return Object.entries(items).slice(paginationRange.start, paginationRange.end).map(entry => entry[1]);
        } else {
            return items;
        }
    };

    return (
        activeLoot ?
            <div>
                <div className={styles.LootModal} style={{ top: `${mousePosition.y}px`, left: `${mousePosition.x}px` }}>
                    <div className={styles.LootModalButton}>
                        <RectangleButton className={styles.closeButton} onClick={() => {
                            callEngineAction({ type: PlayerClientActions.CloseLoot });
                        }}>
                            X
                        </RectangleButton>
                    </div>
                    {activeItems() && <div className={styles.ItemsContainer}>{activeItems()}</div>}
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
                </div>
            </div> : null
    )
}