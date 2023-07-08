import { CommonClientMessages, GlobalStoreModule } from '@bananos/types';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import _ from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { SocketContext } from '../../gameController/socketContext';
import styles from './classesModal.module.scss';

export const ClassesModal = () => {
    const { data: characterClasses } = useEngineModuleReader(GlobalStoreModule.CHARACTER_CLASS);
    const [selectedCharacterClass, setSelectedCharacterClass] = useState(null);
    const [nick, setNick] = useState('Kamil');
    const context = useContext(SocketContext);
    const { socket } = context;

    const getBorderColor = (characterClassId) => {
        if (selectedCharacterClass === characterClassId) {
            return 'silver';
        }
        return 'black';
    };

    const classesToRender = _.map(characterClasses, (characterClass, i) => (
        <div
            key={i}
            onClick={() => setSelectedCharacterClass(i)}
            className={styles.classImage}
            style={{
                backgroundImage: `url(${characterClass.iconImage})`,
                borderColor: getBorderColor(i),
            }}
        ></div>
    ));

    const onSubmit = useCallback(
        (e) => {
            e.preventDefault();
            socket?.emit(CommonClientMessages.CreateCharacter, {
                name: nick,
                characterClassId: selectedCharacterClass,
            });
        },
        [nick, selectedCharacterClass, socket]
    );

    const submitOnEnter = useCallback(
        (e) => {
            if (e.key === 'Enter') {
                onSubmit(e);
            }
        },
        [onSubmit]
    );

    useEffect(() => {
        window.addEventListener('keydown', submitOnEnter);

        return () => {
            window.removeEventListener('keydown', submitOnEnter);
        };
    }, [submitOnEnter]);

    return (
        <div className={styles.modalContainer}>
            <form className={styles.modalForm} onSubmit={(e) => onSubmit(e)}>
                <div className={styles.formHeader}>Create your character</div>
                <div className={styles.inputContainer}>
                    <div className={styles.formHeader}>Your nick: </div>
                    <input type="text" name="nick" className={styles.inputName} value={nick} onChange={(e) => setNick(e.target.value)} />
                </div>
                <div className={styles.classImages}>{classesToRender}</div>
                <button disabled={!selectedCharacterClass || !nick} className={styles.submitButton}>
                    Create
                </button>
            </form>
        </div>
    );
};
