import React, { useContext, useState } from 'react';
import styles from './classesModal.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { updatePlayerClass, selectActiveCharacterId } from '../../../stores';
import mage from '../../../assets/spritesheets/classes/classIcons/mageIcon.png';
import warrior from '../../../assets/spritesheets/classes/classIcons/warriorIcon.png';
import hunter from '../../../assets/spritesheets/classes/classIcons/hunterIcon.png';
import paladin from '../../../assets/spritesheets/classes/classIcons/paladinIcon.png';
import { SocketContext } from '../../gameController/socketContext';
import { ClientMessages } from '@bananos/types';

export const ClassesModal = () => {
   const dispatch = useDispatch();
   const activePlayerId = useSelector(selectActiveCharacterId);
   const [selectedClass, setSelectedClass] = useState('Tank');
   const [nick, setNick] = useState('Kamil');
   const context = useContext(SocketContext);
   const { socket } = context;

   const classes = {
      Mage: {
         image: mage,
      },
      Tank: {
         image: warrior,
      },
      Healer: {
         image: paladin,
      },
      Hunter: {
         image: hunter,
      },
   };

   const getBorderColor = (className) => {
      if (selectedClass === className) {
         return 'silver';
      }
      return 'black';
   };

   const classesToRender = _.map(classes, (classIcon, i) => (
      <div
         key={i}
         onClick={() => setSelectedClass(i)}
         className={styles.classImage}
         style={{
            backgroundImage: `url(${classIcon.image})`,
            borderColor: getBorderColor(i),
         }}
      ></div>
   ));

   const onSubmit = (e) => {
      e.preventDefault();
      socket?.emit(ClientMessages.CreateCharacter, {
         nick,
         class: selectedClass,
      });
   };

   return (
      <div className={styles.modalContainer}>
         <form className={styles.modalForm} onSubmit={(e) => onSubmit(e)}>
            <div className={styles.formHeader}>Create your character</div>
            <div className={styles.inputContainer}>
               <div className={styles.formHeader}>Your nick: </div>
               <input type="text" name="nick" className={styles.inputName} value={nick} onChange={(e) => setNick(e.target.value)} />
            </div>
            <div className={styles.classImages}>{classesToRender}</div>
            <input type="submit" value="Create" disabled={!selectedClass || !nick} className={styles.submitButton} />
         </form>
      </div>
   );
};
