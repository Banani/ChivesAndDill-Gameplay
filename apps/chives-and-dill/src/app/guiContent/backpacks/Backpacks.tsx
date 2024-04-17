import { GlobalStoreModule, ItemClientActions, ItemTemplateType } from '@bananos/types';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import CloseIcon from '@mui/icons-material/Close';
import { ItemPreviewHighlight } from 'apps/chives-and-dill/src/components/itemPreview/ItemPreview';
import { ItemIconPreview } from 'apps/chives-and-dill/src/components/itemPreview/itemIconPreview/ItemIconPreview';
import { EngineContext } from 'apps/chives-and-dill/src/contexts/EngineApiContext';
import { ItemTemplateContext } from 'apps/chives-and-dill/src/contexts/ItemTemplateContext';
import { GlobalModal, ModalsManagerContext } from 'apps/chives-and-dill/src/contexts/ModalsManagerContext';
import _, { forEach } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { useEngineModuleReader } from '../../../hooks';
import { SquareButton } from '../components/squareButton/SquareButton';
import styles from './Backpacks.module.scss';

export const Backpacks = () => {
    const { data: backpackSchema } = useEngineModuleReader(GlobalStoreModule.BACKPACK_SCHEMA);
    const { data: backpackItems, lastUpdateTime: lastBackpackItemsUpdateTime } = useEngineModuleReader(GlobalStoreModule.BACKPACK_ITEMS);
    const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;

    const [backpacksVisibility, setBackpacksVisibility] = useState(false);
    const { callEngineAction } = useContext(EngineContext);
    const { activeGlobalModal, setActiveGlobalModal } = useContext(ModalsManagerContext);

    const { itemTemplates, requestItemTemplate } = useContext(ItemTemplateContext);

    const [availableSlotsAmount, setAvailableSlotsAmount] = useState(0);

    useEffect(() => {
        if (activeGlobalModal !== GlobalModal.Backpack) {
            return;
        }

        forEach(backpackItems[activeCharacterId], (backpack) => {
            forEach(backpack, backpackSlot => {
                if (!itemTemplates[backpackSlot.itemTemplateId]) {
                    requestItemTemplate(backpackSlot.itemTemplateId);
                }
            })
        });
    }, [itemTemplates, lastBackpackItemsUpdateTime, requestItemTemplate, activeGlobalModal]);

    useEffect(() => {
        let availableSlots = 0;
        forEach(backpackSchema[activeCharacterId], (slots) => {
            availableSlots += slots;
        });
        forEach(backpackItems[activeCharacterId], (backpack) => {

            availableSlots -= Object.keys(backpack).length;
        });
        setAvailableSlotsAmount(availableSlots);
    }, [lastBackpackItemsUpdateTime]);

    const renderBackpackContent = (backpack, bagSize) => {
        return _.range(bagSize).map(index => {
            if (backpack[index] && itemTemplates[backpack[index].itemTemplateId]) {
                return <div className={styles.slotBackground}>
                    <ItemIconPreview
                    handleItemRightClick={() => {
                        if (itemTemplates[backpack[index].itemTemplateId].type === ItemTemplateType.Equipment) {
                            callEngineAction({
                                type: ItemClientActions.EquipItem,
                                itemInstanceId: backpack[index].itemId
                            })
                        }

                    }}
                    itemTemplate={itemTemplates[backpack[index].itemTemplateId]}
                    highlight={ItemPreviewHighlight.icon}
                    showMoney={true}
                    amount={backpack[index].amount}
                />;
                </div>
            }

            return <div key={index} className={`${styles.slotBackground} ${styles.emptySlot}`}></div>
        });
    }

    const backpackIcons = _.map(backpackSchema[activeCharacterId], (backpack, key) => {
        return <div
            key={key}
            className={styles.backpackIcon}
            onClick={() => setActiveGlobalModal(activeGlobalModal === GlobalModal.Backpack ? null : GlobalModal.Backpack)}
        >
        </div>;
    });

    return (
        <div>
            <div className={styles.backpacksContainer}>
                {backpackIcons}
            </div>
            <p className={styles.availableSlots}>({availableSlotsAmount})</p>
            <button className={styles.expandBackpacksIcon} onClick={() => setBackpacksVisibility(!backpacksVisibility) as any}>
                {backpacksVisibility === true ? <ArrowRightIcon /> : <ArrowLeftIcon />}
            </button>
            {activeGlobalModal === GlobalModal.Backpack ? <div className={styles.backpackContainer}>
                <div className={styles.backpackHeader}>
                    <div className={styles.headerImage}></div>
                    <SquareButton onClick={() => setActiveGlobalModal(null)}><CloseIcon /></SquareButton>
                </div>
                <div className={styles.slotsBackgroundContainer}>
                    {_.map(backpackItems[activeCharacterId], (backpack, bagSlot) => {
                        if (!backpack) {
                            return null;
                        }
                        return renderBackpackContent(backpack, backpackSchema[activeCharacterId][bagSlot]);
                    })}
                </div>
            </div> : null}
        </div>
    )
}