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

  const { data: backpackSchema } = useEngineModuleReader(GlobalStoreModule.BACKPACK_SCHEMA);
  const { data: backpackItems } = useEngineModuleReader(GlobalStoreModule.BACKPACK_ITEMS);
  const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;

  const [backpacksVisibility, changeBackpacksVisibility] = useState(true);
  const keyBoardContext = useContext(KeyBoardContext);

  const arrayOfValues = _.flatMap(backpackItems[activeCharacterId], backpack => {
    return _.map(backpack, item => item);
  });

  const { itemTemplates } = useItemTemplateProvider({ itemTemplateIds: arrayOfValues.map(item => item.itemId) });

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