import _ from 'lodash';
import * as PIXI from 'pixi.js';
import { Application } from 'pixi.js';
import React, { useEffect, useRef } from "react";
import { useGameSize } from './hooks';
import { DialogRenderer, FloatingNumbersRenderer, NpcQuestMarkRenderer, PlayerBarRenderer, PlayerNameRenderer, ProjectileRenderer } from './renderer';
import { Renderer } from './renderer/Renderer';

export const ViewPort = React.memo(() => {
    const canvasRef = useRef(null);
    const { gameSize } = useGameSize();

    useEffect(() => {
        if (gameSize.width !== 0) {
            const application = new Application({
                width: gameSize.width,
                height: gameSize.height,
                view: canvasRef.current,
                backgroundColor: 0x000000
            });
            const container = new PIXI.Container();
            application.stage.addChild(container);

            const engineState = (window as any).engineState;

            const renderers: Renderer[] = [
                new ProjectileRenderer(container),
                new PlayerNameRenderer(container),
                new PlayerBarRenderer(container),
                new FloatingNumbersRenderer(container),
                new NpcQuestMarkRenderer(container),
                new DialogRenderer(container)
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
                renderers.forEach(renderer => {
                    renderer.updateScene(engineState);
                })
            });

            application.ticker.add(() => {
                const { activeCharacterId } = engineState.activeCharacter.data;
                const location = engineState.characterMovements.data[activeCharacterId].location;
                container.x = -location.x + gameSize.width / 2;
                container.y = -location.y + gameSize.height / 2;

                renderers.forEach(renderer => {
                    renderer.render(engineState);
                })
            });
        }
    }, [gameSize]);

    return <>
        <canvas
            width={gameSize.width}
            height={gameSize.height}
            ref={canvasRef}
        />
    </>
}, () => true);