import React, { useContext } from 'react';
import styles from './ModalIconsPanel.module.scss';
import { GlobalModal, ModalsManagerContext } from 'apps/chives-and-dill/src/contexts/ModalsManagerContext';
import { GlobalStoreModule } from '@bananos/types';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';

import chatIcon from '../../../assets/spritesheets/modalIconsPanel/community.png';
import questLogIcon from '../../../assets/spritesheets/modalIconsPanel/questmark.png';
import questionIcon from '../../../assets/spritesheets/modalIconsPanel/redQuestionMark.png';

export const ModalIconsPanel = () => {
   const { activeGlobalModal, setActiveGlobalModal } = useContext(ModalsManagerContext);

   const activeCharacterId = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER)?.data?.activeCharacterId;
   const { data: characters } = useEngineModuleReader(GlobalStoreModule.CHARACTER);
   const player = characters[activeCharacterId];
   const { avatar } = player;

   const toggleModals = (modal) => {
      if (activeGlobalModal === modal) {
         setActiveGlobalModal(null);
      } else {
         setActiveGlobalModal(modal);
      }
   };

   return (
      <div className={styles.modalIconsPanelContainer}>
         <div className={styles.modalIcon} onClick={() => toggleModals(GlobalModal.Equipment)}>
            <img src={avatar} alt="Equipment Modal Icon" />
            <div className={styles.modalIconsPopup}>
               Character Info <span>(C)</span>
            </div>
         </div>
         <div className={styles.modalIcon + ' ' + styles.filterIcon} onClick={() => toggleModals(GlobalModal.QuestLog)}>
            <img src={questLogIcon} alt="Quest log Modal Icon" />
            <div className={styles.modalIconsPopup}>
               Quest Log <span>(L)</span>
            </div>
         </div>
         <div className={styles.modalIcon + ' ' + styles.filterIcon} onClick={() => toggleModals(GlobalModal.ChatChannelModal)}>
            <img src={chatIcon} alt="Chat Channel Modal Icon" />
            <div className={styles.modalIconsPopup}>
               Guild & Communities <span>(O)</span>
            </div>
         </div>
         <div className={styles.modalIcon + ' ' + styles.filterIcon}>
            <img src={questionIcon} alt="Chat Channel Modal Icon" />
         </div>
      </div>
   );
};
