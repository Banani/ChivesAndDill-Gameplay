import { GlobalStoreModule } from '@bananos/types';
import type { QuestSchema } from '@bananos/types';
import { KeyBoardContext } from 'apps/chives-and-dill/src/contexts/KeyBoardContext';
import type { FunctionComponent } from 'react';
import React, { useContext, useEffect } from 'react';
import styles from './TradeNpcModal.module.scss';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import { MoneyBar } from '../../../../guiContent/moneyBar/MoneyBar';

interface TradeNpcModalProps {
   close: () => void;
}

export const TradeNpcModal: FunctionComponent<TradeNpcModalProps> = ({ close }) => {

   const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;
   const { data: activeConversation } = useEngineModuleReader(GlobalStoreModule.NPC_CONVERSATION);
   const { data: characters } = useEngineModuleReader(GlobalStoreModule.CHARACTER);

   const keyBoardContext = useContext(KeyBoardContext);
   const activeNpc = characters[activeConversation[activeCharacterId]?.npcId];
   const activePlayer = characters[activeCharacterId];

   useEffect(() => {
      keyBoardContext.addKeyHandler({
         id: 'TradeNpcModalEscape',
         matchRegex: 'Escape',
         keydown: close,
      });

      return () => {
         keyBoardContext.removeKeyHandler('TradeNpcModalEscape');
      };
   }, []);

   return (
      <div className={styles.ContentWrapper}>
         <div className={styles.MoneyBarWrapper}>
            <MoneyBar currency={6435422} />
         </div>
      </div>
   );
};
