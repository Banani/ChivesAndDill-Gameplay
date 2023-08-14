import _ from 'lodash';
import * as PIXI from 'pixi.js';
import { Application } from 'pixi.js';
import React, { useEffect, useRef, useState } from "react";
import { GameApi } from './game';
import { useGameSize } from './hooks';
import {
    BloodPoolsRenderer,
    DialogRenderer,
    ErrorMessageRenderer,
    FloatingNumbersRenderer,
    NextLevelRenderer,
    NpcQuestMarkRenderer,
    PlayerBarRenderer,
    PlayerNameRenderer,
    PlayerRenderer,
    ProjectileRenderer
} from './renderer';
import { Renderer } from './renderer/Renderer';

export const ViewPort = React.memo(() => {
    const canvasRef = useRef(null);
    const { gameSize } = useGameSize();
    const [application, setApplication] = useState<Application | null>(null);
    const [container, setContainer] = useState<PIXI.Container | null>(null);

    useEffect(() => {
        if (gameSize.width !== 0 && !application) {
            const application = new Application({
                width: gameSize.width,
                height: gameSize.height,
                view: canvasRef.current,
                backgroundColor: 0x000000
            });

            setApplication(application);

            const container = new PIXI.Container();
            application.stage.addChild(container);

            setContainer(container);

            const engineState = (window as any).engineState;
            const gameApi: GameApi = (window as any).gameApi;

            const renderers: Renderer[] = [
                new PlayerRenderer(container),
                new ProjectileRenderer(container),
                new PlayerNameRenderer(container),
                new PlayerBarRenderer(container),
                new FloatingNumbersRenderer(container),
                new NpcQuestMarkRenderer(container),
                new DialogRenderer(container),
                new ErrorMessageRenderer(container),
                new NextLevelRenderer(container),
                new BloodPoolsRenderer(container)
            ];

            const output = {};
            _.forEach(engineState.mapSchema.data.mapSchema, (mapElement, key) => {
                const baseTexture = PIXI.BaseTexture.from(mapElement.path);
                output[key] = new PIXI.Texture(baseTexture, new PIXI.Rectangle(mapElement.location.x, mapElement.location.y, 32, 32));
            });

            _.range(0, 20).forEach(x => {
                _.range(0, 20).forEach(y => {
                    const mapDefinition = engineState.mapSchema.data.mapDefinition[x + ":" + y];
                    if (mapDefinition && mapDefinition.bottomSpriteId) {
                        const sprite = new PIXI.Sprite(output[mapDefinition.bottomSpriteId]);
                        sprite.x = 96 * x;
                        sprite.height = 96 + 2;
                        sprite.width = 96;
                        sprite.y = 96 * y;
                        container.addChild(sprite);
                    }

                    if (mapDefinition && mapDefinition.upperSpriteId) {
                        const sprite = new PIXI.Sprite(output[mapDefinition.upperSpriteId]);
                        sprite.x = 96 * x;
                        sprite.height = 96 + 2;
                        sprite.width = 96;
                        sprite.y = 96 * y;
                        container.addChild(sprite);
                    }
                })
            })

            // Nie ma chyba potrzeby zeby to bylo 60 razy na sekunde
            application.ticker.add(() => {
                const settings = (window as any).gameSettings;

                renderers.forEach(renderer => {
                    renderer.updateScene(engineState, gameApi, settings);
                })
            });

            application.ticker.add(() => {
                const { activeCharacterId } = engineState.activeCharacter.data;
                const location = engineState.characterMovements.data[activeCharacterId].location;
                container.x = -location.x;
                container.y = -location.y;

                renderers.forEach(renderer => {
                    renderer.render(engineState);
                })
            });
        }
    }, [gameSize, application]);

    useEffect(() => {
        if (application) {
            application.view.width = gameSize.width;
            application.view.height = gameSize.height;
            container.pivot.set(-gameSize.width / 2, -gameSize.height / 2);
            (window as any).gameSettings = { gameSize };
        }
    }, [gameSize, application]);

    return <canvas ref={canvasRef} />
}, () => true);