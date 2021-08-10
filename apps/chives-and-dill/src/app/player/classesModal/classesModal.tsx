import React, { useState } from "react";
import styles from "./classesModal.module.scss";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { updatePlayerClass, selectActivePlayer } from "../../../stores";
import mage from "../../../assets/spritesheets/classes/classIcons/mageIcon.png";
import warrior from "../../../assets/spritesheets/classes/classIcons/warriorIcon.png";
import hunter from "../../../assets/spritesheets/classes/classIcons/hunterIcon.png";
import paladin from "../../../assets/spritesheets/classes/classIcons/paladinIcon.png";

export const ClassesModal = () => {

  const dispatch = useDispatch();
  const activePlayerId = useSelector(selectActivePlayer);
  const [selectedClass, setSelectedClass] = useState("");
  const [nick, setNick] = useState("");

  const classes = {
    Mage: {
      image: mage,
    },
    Tank: {
      image: warrior
    },
    Healer: {
      image: paladin
    },
    Hunter: {
      image: hunter
    }
  };

  const getBorderColor = (className) => {
    if (selectedClass === className) {
      return "silver";
    }
    return "black"
  }

  const classesToRender = _.map(classes, (classIcon, i) => (
    <div key={i} onClick={() => setSelectedClass(i)} className={styles.classImage}
      style={{
        backgroundImage: `url(${classIcon.image})`,
        borderColor: getBorderColor(i),
      }}></div>
  ));

  const onSubmit = e => {
    e.preventDefault();
  }

  return (
    <div className={styles.modalContainer}>
      <form className={styles.modalForm} onSubmit={e => onSubmit(e)}>
        <div className={styles.formHeader}>Create your character</div>
        <div className={styles.inputContainer}>
          <div className={styles.formHeader}>Your nick: </div>
          <input type="text" name="nick" className={styles.inputName} onChange={(e) => setNick(e.target.value)} />
        </div>
        <div className={styles.classImages} >
          {classesToRender}
        </div>
        <input type="submit" value="Create" className={styles.submitButton} />
      </form>
    </div>
  )
}