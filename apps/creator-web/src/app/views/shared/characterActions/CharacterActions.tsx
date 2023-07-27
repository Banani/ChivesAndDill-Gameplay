import AddIcon from '@mui/icons-material/Add';
import PanToolIcon from '@mui/icons-material/PanTool';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RouteIcon from '@mui/icons-material/Route';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { useContext, useEffect, useState } from 'react';
import { KeyBoardContext } from '../../../contexts';

import { CharacterActionsList, CharacterContext } from '../../monsterPanel/CharacterContextProvider';
import styles from './characterActions.module.scss';

export const CharacterActions = () => {
    const { currentCharacterAction, setCurrentCharacterAction } = useContext(CharacterContext);
    const keyBoardContext = useContext(KeyBoardContext);

    const [prevState, setPrevState] = useState(CharacterActionsList.Adding);
    const [isTranslationKeyDown, setTranslationKeyDown] = useState(false);

    useEffect(() => {
        keyBoardContext.addKeyHandler({
            id: 'translation',
            matchRegex: 't',
            keydown: () => {
                if (!isTranslationKeyDown) {
                    setTranslationKeyDown(true);
                    setPrevState(currentCharacterAction);
                    setCurrentCharacterAction(CharacterActionsList.Translate);
                }
            },
            keyup: () => {
                setTranslationKeyDown(false);
                setCurrentCharacterAction(prevState);
            },
        });

        keyBoardContext.addKeyHandler({
            id: 'adding',
            matchRegex: 'a',
            keydown: () => {
                setCurrentCharacterAction(CharacterActionsList.Adding);
            },
        });

        keyBoardContext.addKeyHandler({
            id: 'delete',
            matchRegex: 'd',
            keydown: () => {
                setCurrentCharacterAction(CharacterActionsList.Delete);
            },
        });

        keyBoardContext.addKeyHandler({
            id: 'route',
            matchRegex: 'r',
            keydown: () => {
                setCurrentCharacterAction(CharacterActionsList.Route);
            },
        });

        return () => {
            keyBoardContext.removeKeyHandler('translation');
            keyBoardContext.removeKeyHandler('delete');
            keyBoardContext.removeKeyHandler('adding');
            keyBoardContext.removeKeyHandler('patrol');
        };
    }, [currentCharacterAction, prevState, isTranslationKeyDown]);

    return (
        <div className={styles['mapActionList']}>

            <Tooltip title="Adding (A)" placement="right">
                <Button
                    onClick={() => setCurrentCharacterAction(CharacterActionsList.Adding)}
                    variant={currentCharacterAction === CharacterActionsList.Adding ? 'contained' : 'outlined'}
                    className={styles['button']}
                >
                    <AddIcon />
                </Button>
            </Tooltip>

            <Tooltip title="Translation (T)" placement="right">
                <Button
                    onClick={() => setCurrentCharacterAction(CharacterActionsList.Translate)}
                    variant={currentCharacterAction === CharacterActionsList.Translate ? 'contained' : 'outlined'}
                    className={styles['button']}
                >
                    <PanToolIcon />
                </Button>
            </Tooltip>

            <Tooltip title="Delete (D)" placement="right">
                <Button
                    onClick={() => setCurrentCharacterAction(CharacterActionsList.Delete)}
                    variant={currentCharacterAction === CharacterActionsList.Delete ? 'contained' : 'outlined'}
                    className={styles['button']}
                >
                    <DeleteForeverIcon />
                </Button>
            </Tooltip>

            <Tooltip title="Route (R)" placement="right">
                <Button
                    onClick={() => setCurrentCharacterAction(CharacterActionsList.Route)}
                    variant={currentCharacterAction === CharacterActionsList.Route ? 'contained' : 'outlined'}
                    className={styles['button']}
                >
                    <RouteIcon />
                </Button>
            </Tooltip>

        </div>
    );
};
