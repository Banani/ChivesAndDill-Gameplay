import { GlobalStoreModule } from '@bananos/types';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import CloseIcon from '@mui/icons-material/Close';
import { ItemPreviewHighlight } from 'apps/chives-and-dill/src/components/itemPreview/ItemPreview';
import { ItemIconPreview } from 'apps/chives-and-dill/src/components/itemPreview/itemIconPreview/ItemIconPreview';
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

    const [backpacksVisibility, changeBackpacksVisibility] = useState(true);
    const { activeGlobalModal, setActiveGlobalModal } = useContext(ModalsManagerContext);

    const { itemTemplates, requestItemTemplate } = useContext(ItemTemplateContext);

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

    const renderBackpackContent = (backpack, bagSize) => {
        return _.range(bagSize).map(index => {
            if (backpack[index] && itemTemplates[backpack[index].itemTemplateId]) {
                return <ItemIconPreview
                    itemData={itemTemplates[backpack[index].itemTemplateId] as any}
                    highlight={ItemPreviewHighlight.icon}
                    showMoney={true}
                />;
            }

            return <div key={index} className={styles.slotBackground}></div>
        });
    }

    const backpackIcons = _.map(backpackSchema[activeCharacterId], (backpack, key) => (
        <div key={key} className={styles.backpackIcon}></div>
    ));

    return (
        <div>
            <div className={styles.backpacksContainer}>
                {backpackIcons}
            </div>
            <p className={styles.availableSlots}>(100)</p>
            <button className={styles.expandBackpacksIcon} onClick={() => changeBackpacksVisibility(!backpacksVisibility) as any}>
                {backpacksVisibility === true ? <ArrowRightIcon /> : <ArrowLeftIcon />}
            </button>
            {activeGlobalModal === GlobalModal.Backpack ? <div className={styles.backpackContainer}>
                <div className={styles.backpackHeader}>
                    <div className={styles.headerImage}></div>
                    <SquareButton onClick={() => { }}><CloseIcon /></SquareButton>
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