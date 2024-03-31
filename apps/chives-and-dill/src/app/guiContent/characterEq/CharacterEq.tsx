import { GlobalStoreModule, ItemClientActions } from '@bananos/types';
import CloseIcon from '@mui/icons-material/Close';
import { ItemPreviewHighlight } from 'apps/chives-and-dill/src/components/itemPreview/ItemPreview';
import { ItemIconPreview } from 'apps/chives-and-dill/src/components/itemPreview/itemIconPreview/ItemIconPreview';
import { EngineContext } from 'apps/chives-and-dill/src/contexts/EngineApiContext';
import { ItemTemplateContext } from 'apps/chives-and-dill/src/contexts/ItemTemplateContext';
import { KeyBoardContext } from 'apps/chives-and-dill/src/contexts/KeyBoardContext';
import { GlobalModal, ModalsManagerContext } from 'apps/chives-and-dill/src/contexts/ModalsManagerContext';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import _, { forEach } from 'lodash';
import React, { useContext, useEffect } from 'react';
import { SquareButton } from '../components/squareButton/SquareButton';
import styles from './CharacterEq.module.scss';

export interface Stats {
    armor?: number;
    stamina?: number;
    strength?: number;
    agility?: number;
    intelect?: number;
    spirit?: number;
}
export interface EquipmentItem extends Stats {
    id: string;
    type: string;
    name: string;
    description: string;
    image: string;
    stack: number;
    value: number;
    slot: string;
}

export const CharacterEq = () => {
    const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;
    const { data: equipment, lastUpdateTime: equipmentLastUpdateTime } = useEngineModuleReader(GlobalStoreModule.EQUIPMENT);
    const { data: experience } = useEngineModuleReader(GlobalStoreModule.EXPERIENCE);
    const { data: characters } = useEngineModuleReader(GlobalStoreModule.CHARACTER);
    const { data: characterClasses } = useEngineModuleReader(GlobalStoreModule.CHARACTER_CLASS);
    const { data: attributes } = useEngineModuleReader(GlobalStoreModule.ATTRIBUTES);
    const activePlayer = characters[activeCharacterId];
    const level = experience[activeCharacterId].level;
    const characterClass = characterClasses[activePlayer.characterClassId];
    const activePlayerAttributes = attributes[activeCharacterId];

    const keyBoardContext = useContext(KeyBoardContext);
    const { callEngineAction } = useContext(EngineContext);
    const { activeGlobalModal, setActiveGlobalModal } = useContext(ModalsManagerContext);

    const { itemTemplates, requestItemTemplate } = useContext(ItemTemplateContext);

    useEffect(() => {

        if (activeGlobalModal !== GlobalModal.Equipment) {
            return;
        }

        forEach(equipment[activeCharacterId], (itemReference) => {
            if (!itemReference) {
                return;
            }

            if (!itemTemplates[itemReference.itemTemplateId]) {
                requestItemTemplate(itemReference.itemTemplateId);
            }
        });
    }, [itemTemplates, equipmentLastUpdateTime, requestItemTemplate, activeGlobalModal]);

    const stats = _.chain(activePlayerAttributes)
        .pickBy((value, key) => value > 0)
        .map((value, key) => (
            <p key={key}>
                <span className={styles.ChangeColor}>{`${key}: `}</span>
                {value}
            </p>
        ))
        .value();

    const renderItem = (itemSlot) => {
        if (itemSlot && itemTemplates[itemSlot.itemTemplateId]) {
            return (
                <div
                    className={styles.EqColumnsItem}
                    onContextMenu={(e) => {
                        e.preventDefault();
                        callEngineAction({
                            type: ItemClientActions.StripItem,
                            itemInstanceId: itemSlot.itemInstanceId,
                        });
                    }}
                >
                    <ItemIconPreview
                        itemData={itemTemplates[itemSlot.itemTemplateId] as any}
                        highlight={ItemPreviewHighlight.icon}
                        showMoney={true}
                        showStackSize={false}
                    />
                </div>
            );
        } else {
            return <div className={styles.EqColumnsItem}></div>;
        }
    };

    return activeGlobalModal === GlobalModal.Equipment ? (
        <div className={styles.CharacterEqContainer}>
            <img className={styles.CharacterEqIcon} src={characterClass.iconImage} />
            <div className={styles.CharacterEqName}>{activePlayer.name}</div>
            <div className={styles.ButtonContainer}>
                <SquareButton onClick={() => setActiveGlobalModal(null)}>
                    <CloseIcon />
                </SquareButton>
            </div>
            <div className={styles.CharacterEqExpierence}>
                Level: {level}
                <span style={{ color: characterClass.color }}>{characterClass.name}</span>
            </div>
            <div className={styles.CharacterEqMain}>
                <div className={styles.EquipmentContainer}>
                    <div className={styles.EqColumns}>
                        {renderItem(equipment[activeCharacterId].head)}
                        {renderItem(equipment[activeCharacterId].neck)}
                        {renderItem(equipment[activeCharacterId].shoulder)}
                        {renderItem(equipment[activeCharacterId].chest)}
                        {renderItem(null)}
                        {renderItem(null)}
                        {renderItem(null)}
                        {renderItem(equipment[activeCharacterId].wrist)}
                    </div>
                    <div className={styles.EqColumns}>
                        {renderItem(equipment[activeCharacterId].hands)}
                        {renderItem(equipment[activeCharacterId].waist)}
                        {renderItem(equipment[activeCharacterId].legs)}
                        {renderItem(equipment[activeCharacterId].feet)}
                        {renderItem(equipment[activeCharacterId].finger1)}
                        {renderItem(equipment[activeCharacterId].finger2)}
                        {renderItem(equipment[activeCharacterId].trinket1)}
                        {renderItem(equipment[activeCharacterId].trinket2)}
                    </div>
                    <div className={styles.EqColumns + ' ' + styles.BottomColumn}>
                        {renderItem(null)}
                        {renderItem(null)}
                    </div>
                </div>
                <div className={styles.AttributesContainer}>
                    <div className={styles.EqLevelContainer}>
                        <div className={styles.HeaderLevel + ' ' + styles.EqHeader}>Item Level</div>
                        <div className={styles.NumberLevel}>0</div>
                    </div>
                    <div className={styles.EqAttributesContainer}>
                        <div className={styles.HeaderAtt + ' ' + styles.EqHeader}>Attributes</div>
                        <div className={styles.AttributesItems}>{stats}</div>
                    </div>
                    <div className={styles.EqEnhancementsContainer}>
                        <div className={styles.HeaderEnh + ' ' + styles.EqHeader}>Enhancements</div>
                        <div className={styles.EnhancementsItems}></div>
                    </div>
                </div>
            </div>
        </div>
    ) : null;
};
