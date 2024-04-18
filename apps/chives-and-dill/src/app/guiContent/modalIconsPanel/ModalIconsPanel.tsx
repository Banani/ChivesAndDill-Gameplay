import React, { useContext } from 'react';
import styles from './ModalIconsPanel.module.scss';
import { GlobalModal, ModalsManagerContext } from 'apps/chives-and-dill/src/contexts/ModalsManagerContext';

import iconEq from '../../../assets/spritesheets/modalIconsPanel/iconEq.webp';

export const ModalIconsPanel = () => {
   const { activeGlobalModal, setActiveGlobalModal } = useContext(ModalsManagerContext);

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
            <img src={iconEq} alt="Equipment Modal Icon" />
         </div>
         <div className={styles.modalIcon} onClick={() => toggleModals(GlobalModal.ChatChannelModal)}>
            <img src={iconEq} alt="Chat Channel Modal Icon" />
         </div>
         <div className={styles.modalIcon} onClick={() => toggleModals(GlobalModal.QuestLog)}>
            <img src={iconEq} alt="Quest log Modal Icon" />
         </div>
      </div>
   );
};
