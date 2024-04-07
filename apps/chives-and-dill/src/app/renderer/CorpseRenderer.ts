import { GlobalStore } from "@bananos/types";
import _, { forEach, now } from "lodash";
import * as PIXI from 'pixi.js';
import cursorLoot from '../../assets/spritesheets/cursors/lootCursor.png';
import { BLOCK_SIZE } from "../../consts/consts";
import { GameApi } from "../game";
import { Renderer } from "./Renderer";

const defaultViewSettings = (spriteHeight, spriteWidth, image) => ({
    image,
    spriteHeight,
    spriteWidth,
    movementDown: {
        yOffSet: spriteHeight,
        xOffSet: spriteWidth,
        spriteAmount: 8,
    },
    movementRight: {
        yOffSet: spriteHeight * 2,
        xOffSet: spriteWidth,
        spriteAmount: 8,
    },
    movementUp: {
        yOffSet: 0,
        xOffSet: spriteWidth,
        spriteAmount: 8,
    },
    movementLeft: {
        yOffSet: spriteHeight * 3,
        xOffSet: spriteWidth,
        spriteAmount: 8,
    },
    standingDown: {
        yOffSet: spriteHeight,
        xOffSet: 0,
        spriteAmount: 1,
    },
    standingRight: {
        yOffSet: spriteHeight * 2,
        xOffSet: 0,
        spriteAmount: 1,
    },
    standingUp: {
        yOffSet: 0,
        xOffSet: 0,
        spriteAmount: 1,
    },
    standingLeft: {
        yOffSet: spriteHeight * 3,
        xOffSet: 0,
        spriteAmount: 1,
    },
    dead: {
        yOffSet: spriteHeight * 4,
        xOffSet: 0,
        spriteAmount: 1,
    },
})

interface CharacterSpriteStates {
    width: number;
    height: number;
    spriteAssignment: {
        movementDown: PIXI.Texture[],
        movementUp: PIXI.Texture[],
        movementRight: PIXI.Texture[],
        movementLeft: PIXI.Texture[],
        standingUp: PIXI.Texture[],
        standingDown: PIXI.Texture[],
        standingRight: PIXI.Texture[],
        standingLeft: PIXI.Texture[],
        dead: PIXI.Texture[],
    }
}

export class CorpseRenderer implements Renderer {
    private sprites: Record<string, CharacterSpriteStates> = {};
    private corpses: Record<string, PIXI.Sprite> = {};
    private container: PIXI.Container;
    private creationTime: number;

    constructor(container: PIXI.Container) {
        this.container = container;
        this.creationTime = now() - 1;

        const viewSettings = {
            'citizen': defaultViewSettings(60, 60, '/spritesheets/monsters/citizen.png'),
            'orc': defaultViewSettings(48, 48, '/spritesheets/monsters/orc.png'),
        }

        forEach(viewSettings, (view, viewId) => {
            this.sprites[viewId] = {
                width: view.spriteWidth,
                height: view.spriteHeight,
                spriteAssignment: {
                    movementDown: [],
                    movementUp: [],
                    movementRight: [],
                    movementLeft: [],
                    standingUp: [],
                    standingDown: [],
                    standingRight: [],
                    standingLeft: [],
                    dead: [],
                }
            };

            const sheet = PIXI.BaseTexture.from(`../assets` + view.image);
            _.forOwn(this.sprites[viewId].spriteAssignment, (value, key) => {
                for (let i = 0; i < view[key].spriteAmount; i++) {
                    this.sprites[viewId].spriteAssignment[key].push(
                        new PIXI.Texture(
                            sheet,
                            new PIXI.Rectangle(
                                i * view.spriteWidth + view[key].xOffSet,
                                view[key].yOffSet,
                                view.spriteWidth,
                                view.spriteHeight
                            )
                        )
                    );
                }
            });
        })
    }

    updateScene(store: GlobalStore, gameApi: GameApi) {
        forEach(store.corpseDrop.data, (corpseDrop, characterId) => {
            if (this.corpses[characterId]) {
                return;
            }

            const spritesId = store.character.data[characterId].sprites;
            this.corpses[characterId] = PIXI.Sprite.from(this.sprites[spritesId].spriteAssignment.dead[0]);
            this.corpses[characterId].x = corpseDrop.location.x - this.sprites[spritesId].width / 2;
            this.corpses[characterId].y = corpseDrop.location.y - this.sprites[spritesId].height / 2;
            this.corpses[characterId].height = BLOCK_SIZE;
            this.corpses[characterId].width = BLOCK_SIZE;
            this.corpses[characterId].interactive = true;

            this.corpses[characterId].cursor = `url(${cursorLoot}), auto`;

            this.corpses[characterId].on('pointerdown', () => {
                gameApi.openLootModal(characterId);
            });
            this.container.addChild(this.corpses[characterId])
        });

        forEach(this.corpses, (_, characterId) => {
            if (store.corpseDrop.data[characterId]) {
                return;
            }

            this.container.removeChild(this.corpses[characterId])
            delete this.corpses[characterId];
        })
    }

    render(store: GlobalStore) { }
}