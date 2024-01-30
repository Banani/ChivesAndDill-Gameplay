import { GlobalStoreModule } from '@bananos/types';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import CloseIcon from '@mui/icons-material/Close';
import { ItemPreviewHighlight } from 'apps/chives-and-dill/src/components/itemPreview/ItemPreview';
import { ItemIconPreview } from 'apps/chives-and-dill/src/components/itemPreview/itemIconPreview/ItemIconPreview';
import { KeyBoardContext } from 'apps/chives-and-dill/src/contexts/KeyBoardContext';
import _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { useEngineModuleReader, useItemTemplateProvider } from '../../../hooks';
import { SquareButton } from '../components/squareButton/SquareButton';
import styles from './Backpacks.module.scss';

export const Backpacks = () => {

  const dupa1 = {
    1: { amount: 1, itemId: 'ItemInstance_0' },
    2: { amount: 4, itemId: 'ItemInstance_1' },
    3: { amount: 1, itemId: 'ItemInstance_5' },
    4: { amount: 1, itemId: 'ItemInstance_10' },
    5: { amount: 2, itemId: 'ItemInstance_14' },
    6: { amount: 1, itemId: 'ItemInstance_16' },
    7: { amount: 7, itemId: 'ItemInstance_13' },
    8: { amount: 10, itemId: 'ItemInstance_16' },
  }
  const dupa2 = {
    1: { amount: 1, itemId: 'ItemInstance_47' },
    2: { amount: 2, itemId: 'ItemInstance_48' },
    3: { amount: 1, itemId: 'ItemInstance_49' },
    4: { amount: 1, itemId: 'ItemInstance_50' },
    5: { amount: 3, itemId: 'ItemInstance_51' },
    6: { amount: 4, itemId: 'ItemInstance_52' },
    7: { amount: 7, itemId: 'ItemInstance_53' },
  }

  const hik = {
    1: dupa1,
    2: dupa2,
  }

  const { data: backpackSchema } = useEngineModuleReader(GlobalStoreModule.BACKPACK_SCHEMA);
  const { data: backpackItems } = useEngineModuleReader(GlobalStoreModule.BACKPACK_ITEMS);
  const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;

  const [backpacksVisibility, changeBackpacksVisibility] = useState(true);
  const keyBoardContext = useContext(KeyBoardContext);

  const { itemTemplates } = useItemTemplateProvider({ itemTemplateIds: _.map(dupa1, (item) => item.itemId) ?? [] });
  // const backpackSlots = (
  //   <div className={styles.itemSlotsContainer}>
  //     {_.flatMap(hik, backpack => (
  //       _.map(backpack, (slot, key) => (
  //         <div key={slot.itemId} className={styles.slot}>

  //           {/* <ItemIconPreview itemData={itemTemplates[]} highlight={ItemPreviewHighlight.icon} showMoney={true} /> */}
  //         </div>
  //       ))
  //     ))}
  //   </div>
  // );

  const backpackSlots = (
    <div className={styles.itemSlotsContainer}>
      {_.map(itemTemplates, (item, key) => {
        return <div key={key} className={styles.slot}>
          <ItemIconPreview itemData={item} highlight={ItemPreviewHighlight.icon} showMoney={true} />
        </div>
      })}
    </div>
  );

  const backpackIcons = _.map(backpackSchema[activeCharacterId], (backpack, key) => (
    <div key={key} className={styles.backpackIcon}></div>
  ));

  const backpacksSlotsBackground = _.map(backpackSchema[activeCharacterId], (backpack, key) => {
    return Array.from({ length: backpack }, (_, index) => (
      <div key={key + "_" + index} className={styles.slotBackground}></div>
    ))
  });

  useEffect(() => {
    keyBoardContext.addKeyHandler({
      id: 'backpacks',
      matchRegex: 'b',
      keydown: () => changeBackpacksVisibility(prevState => !prevState),
    });

    return () => keyBoardContext.removeKeyHandler('backpacks');
  }, []);

  return (
    <div>
      <div className={styles.backpacksContainer}>
        {backpackIcons}
      </div>
      <p className={styles.availableSlots}>(100)</p>
      <button className={styles.expandBackpacksIcon} onClick={() => changeBackpacksVisibility(!backpacksVisibility) as any}>
        {backpacksVisibility === true ? <ArrowRightIcon /> : <ArrowLeftIcon />}
      </button>
      <div className={styles.backpackContainer}>
        <div className={styles.backpackHeader}>
          <div className={styles.headerImage}></div>
          <SquareButton onClick={() => { }}><CloseIcon /></SquareButton>
        </div>
        <div className={styles.slotsBackgroundContainer}>
          {backpackSlots}
          {backpacksSlotsBackground}
        </div>
      </div>

    </div>

  )
}