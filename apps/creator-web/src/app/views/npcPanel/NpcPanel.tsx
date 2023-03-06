import { Text } from '@inlet/react-pixi';
import { Paper } from '@mui/material';
import { TextStyle } from 'pixi.js';
import { useContext, useMemo } from 'react';
import { MapContext, MapSprite, Rectangle } from '../components';

import { Map } from '../components';

import { QuoteHandler } from '@bananos/types';
import _ from 'lodash';
import { Circle, CircleType } from '../../components';
import { AnimatedSelection } from '../../components/animatedSelection/AnimatedSelection';
import { PackageContext } from '../../contexts';
import { Dialogs } from '../../contexts/dialogContext';
import { CharacterActionsList, CharacterContext } from '../monsterPanel/CharacterContextProvider';
import { CharacterActions, SelectedCharacterPanel } from '../shared';
import { CharacterTemplatesPanel } from '../shared/characterTemplatesPanel';
import styles from './NpcPanel.module.scss';

export const NpcPanel = () => {
    const packageContext = useContext(PackageContext);
    const { isMouseDown, mousePosition, lastMouseDownPosition, previousTranslation, texturesMap, translation, setTranslation } = useContext(MapContext);
    const { currentCharacterAction, activeCharacterTemplate, addCharacter, deleteCharacter, highlightedCharacterId } = useContext(CharacterContext);
    const npcs = packageContext.backendStore.npcs?.data ?? {};
    const npcTemplates = packageContext.backendStore.npcTemplates?.data ?? {};

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
        }),
        [isMouseDown, activeCharacterTemplate, addCharacter, translation, deleteCharacter]
    );

    const mouseCenterSpritePosition = {
        x: Math.floor(((mousePosition?.x ?? 0) - translation.x) / 32),
        y: Math.floor(((mousePosition?.y ?? 0) - translation.y) / 32),
    };

    return (
        <>
            <div className={styles['app-view']}>
                <CharacterTemplatesPanel characters={_.map(npcTemplates, (npcTemplate: any) => {
                    const stockSize = Object.keys(npcTemplate.stock).length;
                    const questsAmount = Object.keys(npcTemplate.quests).length;
                    const respawnsAmount = _.filter(npcs, npc => npc.npcTemplateId === npcTemplate.id).length;
                    const quotesAmount = _.chain(npcTemplate.quotesEvents ?? {}).map((event: QuoteHandler) => (event.quotes ?? []).length).sum().value();

                    return {
                        id: npcTemplate.id,
                        name: npcTemplate.name,
                        path: 'assets/citizen.png',
                        circles: <>
                            {respawnsAmount > 0 ? <Circle type={CircleType.npc} number={respawnsAmount} /> : null}
                            {questsAmount > 0 ? <Circle type={CircleType.quest} number={questsAmount} /> : null}
                            {stockSize > 0 ? <Circle type={CircleType.item} number={stockSize} /> : null}
                            {quotesAmount > 0 ? <Circle type={CircleType.quote} number={quotesAmount} /> : null}
                        </>,

                    }
                })} createDialog={Dialogs.NpcTemplateDialogs} />
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
                                    texture={texturesMap['citizen']}
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

                        {highlightedCharacterId != null && npcs[highlightedCharacterId] ? (
                            <AnimatedSelection location={{
                                x: npcs[highlightedCharacterId].location.x * 32 - 3,
                                y: npcs[highlightedCharacterId].location.y * 32 - 3,
                            }} />
                        ) : null}
                    </Map>
                </Paper>
                <SelectedCharacterPanel characters={npcs} templateIdFieldName="npcTemplateId" />
            </div>
        </>
    );
};
