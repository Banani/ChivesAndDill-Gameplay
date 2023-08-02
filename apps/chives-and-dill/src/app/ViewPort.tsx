import _, { forEach } from 'lodash';
import * as PIXI from 'pixi.js';
import { Application } from 'pixi.js';
import React, { useCallback, useEffect, useRef, useState } from "react";


export const ViewPort = React.memo(() => {
    const canvasRef = useRef(null);
    // const { data: activeCharacterIdData, lastUpdateTime: activeCharacterLastUpdateTime, } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER);
    // const { data: characterMovements, lastUpdateTime: characterMovementsLastUpdateTime } = useEngineModuleReader(GlobalStoreModule.CHARACTER_MOVEMENTS);
    // const activeCharacterId = activeCharacterIdData['activeCharacterId'];
    const [gameSize, setGameSize] = useState({ width: 0, height: 0 });

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

            const names: Record<string, PIXI.Text> = {};

            // Co jak pojawia sie nowi gracze, albo stare sie usuna
            forEach(engineState.character.data, character => {
                names[character.id] = new PIXI.Text(character.name, new PIXI.TextStyle({
                    fontSize: 15,
                    fill: 'green',
                    fontWeight: 'bold',
                    lineJoin: 'round',
                    strokeThickness: 4,
                    fontFamily: 'Septimus',
                }));

                const location = engineState.characterMovements.data[character.id].location;
                names[character.id].x = location.x;
                // 48 is a sprite height
                names[character.id].y = location.y - 48 / 1.5;
                names[character.id].anchor.set(0.5, 1.3)
                container.addChild(names[character.id]);
            })

            const projectiles: Record<string, PIXI.Sprite> = {};

            application.ticker.add(() => {
                forEach(engineState.projectileMovements.data, (projectile, projectileId) => {
                    if (projectiles[projectileId]) {
                        return;
                    }

                    projectiles[projectileId] = PIXI.Sprite.from("../assets/spritesheets/spells/mage/spellsView/fireball.png");
                    projectiles[projectileId].x = projectile.location.x;
                    projectiles[projectileId].y = projectile.location.y;
                    projectiles[projectileId].rotation = projectile.angle + 1.5
                    projectiles[projectileId].scale = { x: 1, y: 1 };
                    container.addChild(projectiles[projectileId])
                });

                forEach(projectiles, (projectile, projectileId) => {
                    if (!engineState.projectileMovements.data[projectileId]) {
                        container.removeChild(projectiles[projectileId])
                        delete projectile[projectileId];
                    }
                })
            });

            application.ticker.add(() => {
                const { activeCharacterId } = engineState.activeCharacter.data;
                const location = engineState.characterMovements.data[activeCharacterId].location;
                container.x = -location.x + gameSize.width / 2;
                container.y = -location.y + gameSize.height / 2;

                forEach(engineState.characterMovements.data, (movement, characterId) => {
                    names[characterId].x = movement.location.x;
                    // 48 is a sprite height
                    names[characterId].y = movement.location.y - 48 / 1.5;
                });

                forEach(engineState.projectileMovements.data, (projectile, projectileId) => {
                    projectiles[projectileId].x = projectile.location.x;
                    projectiles[projectileId].y = projectile.location.y;
                    projectiles[projectileId].rotation = projectile.angle + 1.5
                });
            });
        }

    }, [gameSize]);

    const resizeGame = useCallback(() => {
        let gameWidth = window.innerWidth;
        let gameHeight = window.innerHeight;
        const ratio = 16 / 9;

        if (gameHeight < gameWidth / ratio) {
            gameWidth = gameHeight * ratio;
        } else {
            gameHeight = gameWidth / ratio;
        }

        setGameSize({ width: gameWidth, height: gameHeight });
    }, []);

    useEffect(() => {
        resizeGame();
        window.addEventListener('resize', resizeGame);

        return () => {
            window.removeEventListener('resize', resizeGame);
        };
    }, []);

    return <>
        <canvas
            width={gameSize.width}
            height={gameSize.height}
            ref={canvasRef}
        />
    </>
    {/*     <AreasSpellsEffectsManager />*/ }

    {/* <RenderPlayersManager /> */ }
    {/* {renderSpells()}
            <FloatingNumbersManager />
            <BlinkSpellEffect />
            <BloodPoolManager />
            <DialogsManager />
            <CastBarsManager location={characterMovements[activeCharacterId]?.location} spellChannels={spellChannels} /> */}


    {/* <NextLevelManager experienceEvents={experienceEvents} />
    <ErrorMessages /> */}
}, () => true);