import { Graphics, Text } from '@inlet/react-pixi';
import { Paper } from '@mui/material';
import { TextStyle } from 'pixi.js';
import { useCallback, useContext, useMemo } from 'react';
import { Loader, MapContext, MapSprite, Rectangle } from '../components';

import { Map } from '../components';

import { QuoteHandler } from '@bananos/types';
import _ from 'lodash';
import { Circle, CircleType } from '../../components';
import { AnimatedSelection } from '../../components/animatedSelection/AnimatedSelection';
import { PackageContext } from '../../contexts';
import { Dialogs } from '../../contexts/dialogContext';
import { CharacterActions, SelectedCharacterPanel } from '../shared';
import { CharacterTemplatesPanel } from '../shared/characterTemplatesPanel';
import { CharacterActionsList, CharacterContext } from './CharacterContextProvider';
import styles from './MonsterPanel.module.scss';

export const MonsterPanel = () => {
    const packageContext = useContext(PackageContext);
    const { isMouseDown, mousePosition, lastMouseDownPosition, previousTranslation, texturesMap, translation, setTranslation } = useContext(MapContext);
    const {
        currentCharacterAction,
        activeCharacterTemplate,
        addCharacter,
        deleteCharacter,
        highlightedCharacterId,
        setActiveCharacter,
        activeCharacter
    } = useContext(CharacterContext);

    const { data: monsterTemplates, lastUpdateTime: lastUpdateTimeMonsterTemplates } = (packageContext?.backendStore?.monsterTemplates ?? {});
    const { data: monsters, lastUpdateTime: lastUpdateTimeMonsters } = (packageContext?.backendStore?.monsters ?? {});

    const actionModes: Partial<Record<string, any>> = useMemo(
        () => ({
            [CharacterActionsList.Adding]: {
                onClick: (e: any) => {
                    if (activeCharacterTemplate) {
                        addCharacter({
                            x: Math.floor((e.nativeEvent.offsetX - translation.x) / 32),
                            y: Math.floor((e.nativeEvent.offsetY - translation.y) / 32),
                            characterTemplateId: activeCharacterTemplate.id,
                        });
                    } else {
                        console.log('Nie wybrano sprite');
                    }
                },
            },
            [CharacterActionsList.Translate]: {
                onMouseMove: (e: any) => {
                    if (isMouseDown) {
                        setTranslation({
                            x: previousTranslation.x + e.clientX - lastMouseDownPosition.x,
                            y: previousTranslation.y + e.clientY - lastMouseDownPosition.y,
                        });
                    }
                },
            },
            [CharacterActionsList.Delete]: {
                onClick: (e: any) => {
                    deleteCharacter(Math.floor((e.nativeEvent.offsetX - translation.x) / 32) + ':' + Math.floor((e.nativeEvent.offsetY - translation.y) / 32));
                },
            },
            [CharacterActionsList.Route]: {
                onClick: (e: any) => {
                    setActiveCharacter((prev: any) => ({
                        ...prev,
                        patrolPath: [...(prev.patrolPath ?? []), { x: e.nativeEvent.offsetX - translation.x, y: e.nativeEvent.offsetY - translation.y }]
                    }))
                },
            },
        }),
        [isMouseDown, activeCharacterTemplate, addCharacter, translation, deleteCharacter]
    );

    const draw = useCallback((g) => {
        g.clear();

        if (!activeCharacter.patrolPath) {
            return
        }

        g.lineStyle(2, 0xff0000, 1);
        const startPos = activeCharacter.patrolPath[0]
        g.moveTo(startPos.x, startPos.y);
        for (let i in activeCharacter.patrolPath) {
            const pos = activeCharacter.patrolPath[i];
            g.lineTo(pos.x, pos.y);
        }
        g.lineTo(startPos.x, startPos.y);
    }, [activeCharacter]);

    if (!lastUpdateTimeMonsterTemplates || !lastUpdateTimeMonsters) {
        return <Loader />;
    }

    const mouseCenterSpritePosition = {
        x: Math.floor(((mousePosition?.x ?? 0) - translation.x) / 32),
        y: Math.floor(((mousePosition?.y ?? 0) - translation.y) / 32),
    };

    return (
        <>
            <div className={styles['app-view']}>
                <CharacterTemplatesPanel characters={_.map(monsterTemplates, (character: any) => {
                    const lootSize = Object.keys(character.dropSchema.items).length;
                    const respawnsAmount = _.filter(monsters, monster => monster.monsterTemplateId === character.id).length;
                    const quotesAmount = _.chain(character.quotesEvents ?? {}).map((event: QuoteHandler) => (event.quotes ?? []).length).sum().value();
                    const spellsAmount = Object.keys(character.spells ?? {}).length;

                    return {
                        id: character.id,
                        name: character.name,
                        path: 'assets/orc.png',
                        circles: <>
                            {respawnsAmount > 0 ? <Circle type={CircleType.monster} number={respawnsAmount} /> : null}
                            {lootSize > 0 ? <Circle type={CircleType.item} number={lootSize} /> : null}
                            {quotesAmount > 0 ? <Circle type={CircleType.quote} number={quotesAmount} /> : null}
                            {spellsAmount > 0 ? <Circle type={CircleType.spell} number={spellsAmount} /> : null}
                        </>

                    }
                })} createDialog={Dialogs.MonsterTemplateDialog} />
                <CharacterActions />

                <Paper className={styles['map-editor']}>
                    <Map mapActionStates={actionModes} state={currentCharacterAction}>
                        <Text
                            text={mouseCenterSpritePosition.x + ':' + mouseCenterSpritePosition.y}
                            x={mouseCenterSpritePosition.x * 32 + 32 + 6}
                            y={mouseCenterSpritePosition.y * 32 - 18}
                            style={
                                new TextStyle({
                                    align: 'center',
                                    fontSize: 10,
                                    fill: '#ff3030',
                                })
                            }
                        />

                        {mousePosition && !!activeCharacterTemplate && currentCharacterAction === CharacterActionsList.Adding && (
                            <>
                                <Rectangle
                                    color={'33aa33'}
                                    location={{
                                        x: mouseCenterSpritePosition.x * 32 - 3,
                                        y: mouseCenterSpritePosition.y * 32 - 3,
                                    }}
                                    size={{
                                        width: 32 + 6,
                                        height: 32 + 6,
                                    }}
                                />

                                <MapSprite
                                    texture={texturesMap['orc']}
                                    location={{
                                        x: Math.floor((mousePosition?.x - translation.x) / 32),
                                        y: Math.floor((mousePosition?.y - translation.y) / 32),
                                    }}
                                />
                            </>
                        )}

                        {mousePosition && currentCharacterAction === CharacterActionsList.Delete && (
                            <>
                                <Rectangle
                                    color={'aa3333'}
                                    location={{
                                        x: mouseCenterSpritePosition.x * 32 - 3,
                                        y: mouseCenterSpritePosition.y * 32 - 3,
                                    }}
                                    size={{
                                        width: 32 + 6,
                                        height: 32 + 6,
                                    }}
                                />
                            </>
                        )}

                        {currentCharacterAction === CharacterActionsList.Route && activeCharacter ? (
                            <Graphics draw={draw} />
                        ) : null}

                        {highlightedCharacterId != null && monsters[highlightedCharacterId] ? (
                            <AnimatedSelection location={{
                                x: monsters[highlightedCharacterId].location.x * 32 - 3,
                                y: monsters[highlightedCharacterId].location.y * 32 - 3,
                            }} />
                        ) : null}
                    </Map>
                </Paper>
                <SelectedCharacterPanel characters={monsters} templateIdFieldName="monsterTemplateId" />
            </div>
        </>
    );
};
