import { GlobalStoreModule, ItemClientActions } from '@bananos/types';
import { KeyBoardContext } from 'apps/chives-and-dill/src/contexts/KeyBoardContext';
import { useEngineModuleReader, useItemTemplateProvider } from 'apps/chives-and-dill/src/hooks';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import styles from './CharacterEq.module.scss'
import { SquareButton } from '../components/squareButton/SquareButton';
import CloseIcon from '@mui/icons-material/Close';
import _ from 'lodash';
import { ItemIconPreview } from 'apps/chives-and-dill/src/components/itemPreview/itemIconPreview/ItemIconPreview';
import { EngineContext } from 'apps/chives-and-dill/src/contexts/EngineApiContext';
import { ItemPreviewHighlight } from 'apps/chives-and-dill/src/components/itemPreview/ItemPreview';

interface EquipmentItem {
    id: string;
    type: string;
    name: string;
    description: string;
    image: string;
    stack: number;
    value: number;
    slot: string;
    armor?: number;
    stamina?: number;
    strength?: number;
  }
  
  interface EquipmentBySlot {
    [slot: string]: EquipmentItem;
  }

export const CharacterEq = () => {
    const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;
    const { data: equipment } = useEngineModuleReader(GlobalStoreModule.EQUIPMENT);
    const { data: experience } = useEngineModuleReader(GlobalStoreModule.EXPERIENCE);
    const { data: characters } = useEngineModuleReader(GlobalStoreModule.CHARACTER);
    const { data: characterClasses } = useEngineModuleReader(GlobalStoreModule.CHARACTER_CLASS);
    const { data: attributes } = useEngineModuleReader(GlobalStoreModule.ATTRIBUTES);
    const [modalStatus, setModalStatus] = useState(false);
    const activePlayer = characters[activeCharacterId];
    const level = experience[activeCharacterId].level;
    const characterClass = characterClasses[activePlayer.characterClassId];
    const activePlayerAttributes = attributes[activeCharacterId];

    const keyBoardContext = useContext(KeyBoardContext);
    const { callEngineAction } = useContext(EngineContext);

    const { itemTemplates } = useItemTemplateProvider({ itemTemplateIds: _.map(equipment, (item) => item.itemTemplateId) ?? [] });

    useEffect(() => {
        keyBoardContext.addKeyHandler({
           id: 'CharacterEq',
           matchRegex: 'c',
           keydown: () => setModalStatus(prevState => !prevState),
        });

        return () => keyBoardContext.removeKeyHandler('CharacterEq');
     }, []);

    const stats = _.map(activePlayerAttributes, (value, key) => {
        return <p key={key}><span className={styles.ChangeColor}>{`${key}: `}</span>{value}</p>
    });

    const restructureItemsBySlot = (items) => {
        const itemsBySlot = {};
      
        for (const itemId in items) {
          const item = items[itemId];
          const slot = item.slot;
          itemsBySlot[slot] = item;
        };
        return itemsBySlot;
    };

    const getEqItemId = (itemInstanceId) => {
        callEngineAction({
            type: ItemClientActions.StripItem,
            itemInstanceId
        });
    }

    const renderItem = (itemSlot) => {
        if(Object.keys(itemSlot).length) {
            return (
                <div className={styles.EqColumnsItem} onContextMenu={(e) => {
                        e.preventDefault();
                        getEqItemId(itemSlot.id);
                    }}
                >
                    <ItemIconPreview itemData={itemSlot} highlight={ItemPreviewHighlight.icon} showMoney={true} />
                </div>
            );
        } else {
            return (
                <div className={styles.EqColumnsItem}></div> 
            );
        };   
    };

    const itemsBySlot: EquipmentBySlot = restructureItemsBySlot(itemTemplates);
    
    return (
        modalStatus ? <div className={styles.CharacterEqContainer}>
            <img className={styles.CharacterEqIcon} src={characterClass.iconImage}/>
            <div className={styles.CharacterEqName}>{activePlayer.name}</div>
            <div className={styles.ButtonContainer}>
                <SquareButton onClick={() => setModalStatus(false)}><CloseIcon /></SquareButton>
            </div>
            <div className={styles.CharacterEqExpierence}>Level: {level}<span style={{'color': characterClass.color}}>{characterClass.name}</span></div>
            { !_.isEmpty(itemsBySlot) ? <div className={styles.CharacterEqMain}>
                <div className={styles.EquipmentContainer}>
                    <div className={styles.EqColumns}>
                        {renderItem(itemsBySlot.head)}
                        {renderItem(itemsBySlot.neck)}
                        {renderItem(itemsBySlot.shoulder)}
                        {renderItem(itemsBySlot.chest)}
                        {renderItem({})}
                        {renderItem({})}
                        {renderItem({})}
                        {renderItem(itemsBySlot.wrist)}
                    </div>
                    <div className={styles.EqColumns}>
                        {renderItem(itemsBySlot.hands)}
                        {renderItem(itemsBySlot.waist)}
                        {renderItem(itemsBySlot.legs)}
                        {renderItem(itemsBySlot.feet)}
                        {renderItem(itemsBySlot.finger)}
                        {renderItem({})}
                        {renderItem(itemsBySlot.trinket)}
                        {renderItem({})}
                    </div>
                    <div className={styles.EqColumns + ' ' + styles.BottomColumn}>
                        {renderItem({})}
                        {renderItem({})}
                    </div>
                </div>
                <div className={styles.AttributesContainer}>
                    <div className={styles.EqLevelContainer}>
                        <div className={styles.HeaderLevel + ' ' + styles.EqHeader}>Item Level</div>
                        <div className={styles.NumberLevel}>0</div>
                    </div>
                    <div className={styles.EqAttributesContainer}>
                        <div className={styles.HeaderAtt + ' ' + styles.EqHeader}>Attributes</div>
                        <div className={styles.AttributesItems}>
                            {stats}
                        </div>
                    </div>
                    <div className={styles.EqEnhancementsContainer}>
                        <div className={styles.HeaderEnh + ' ' + styles.EqHeader}>Enhancements</div>
                        <div className={styles.EnhancementsItems}></div>
                    </div>
                </div>
            </div>
            : null }
       </div> : null
    )
}
