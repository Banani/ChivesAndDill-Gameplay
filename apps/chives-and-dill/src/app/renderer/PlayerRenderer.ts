import { CharacterDirection, CharacterMovement, CharacterType, GlobalStore } from "@bananos/types";
import _, { forEach, now } from "lodash";
import * as PIXI from 'pixi.js';
import cursorSpeak from '../../assets/spritesheets/cursors/speakCursor.png';
import cursorSword from '../../assets/spritesheets/cursors/swordCursor.png';
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

export class PlayerRenderer implements Renderer {
    private sprites: Record<string, CharacterSpriteStates> = {};
    private characters: Record<string, PIXI.Sprite> = {};
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
        forEach(store.character.data, (character, characterId) => {
            if (this.characters[characterId] || !store.characterMovements.data[characterId]) {
                return;
            }

            const location = store.characterMovements.data[characterId].location;
            this.characters[characterId] = PIXI.Sprite.from(this.sprites[character.sprites].spriteAssignment.standingDown[0]);
            this.characters[characterId].x = location.x - this.sprites[character.sprites].width / 2;
            this.characters[characterId].y = location.y - this.sprites[character.sprites].height / 2;
            this.characters[characterId].height = BLOCK_SIZE;
            this.characters[characterId].width = BLOCK_SIZE;
            this.characters[characterId].interactive = true;

            if (character.type === CharacterType.Npc) {
                this.characters[characterId].cursor = `url(${cursorSpeak}), auto`;
            } else if (character.type === CharacterType.Monster) {
                this.characters[characterId].cursor = `url(${cursorSword}), auto`;
            }

            this.characters[characterId].on('pointerdown', () => {
                gameApi.setActiveTarget(characterId);

                if (character.type === CharacterType.Npc) {
                    gameApi.openNpcDialog(characterId);

                }
            });
            this.container.addChild(this.characters[characterId])
        });

        forEach(this.characters, (_, characterId) => {
            if (store.character.data[characterId] && store.characterMovements.data[characterId]) {
                return;
            }

            this.container.removeChild(this.characters[characterId])
            delete this.characters[characterId];
        })
    }

    render(store: GlobalStore) {
        const timeDifference = Math.floor((now() - this.creationTime) / 50);
        forEach(this.characters, (characterSprite, characterId) => {
            const sprite = store.character.data[characterId].sprites;
            const characterMovement = store.characterMovements.data[characterId];

            this.updateCharacterDirection(store.character.data[characterId], characterMovement, timeDifference);
            characterSprite.x = characterMovement.location.x - this.sprites[sprite].width / 2;
            characterSprite.y = characterMovement.location.y - this.sprites[sprite].height / 2;
        });
    }

    updateCharacterDirection(character: any, characterMovement: CharacterMovement, timeDifference: number) {
        const spriteAssignment = this.sprites[character.sprites].spriteAssignment;
        const direction = characterMovement.direction;
        const selectedCharacter = this.characters[character.id];

        if (characterMovement.isInMove) {
            if (direction === CharacterDirection.DOWN) {
                selectedCharacter.texture = spriteAssignment.movementDown[timeDifference % spriteAssignment.movementDown.length];
            } else if (direction === CharacterDirection.RIGHT) {
                selectedCharacter.texture = spriteAssignment.movementRight[timeDifference % spriteAssignment.movementRight.length];
            } else if (direction === CharacterDirection.UP) {
                selectedCharacter.texture = spriteAssignment.movementUp[timeDifference % spriteAssignment.movementUp.length];
            } else if (direction === CharacterDirection.LEFT) {
                selectedCharacter.texture = spriteAssignment.movementLeft[timeDifference % spriteAssignment.movementLeft.length];
            }
        } else {
            if (direction === CharacterDirection.DOWN) {
                selectedCharacter.texture = spriteAssignment.standingDown[0];
            } else if (direction === CharacterDirection.RIGHT) {
                selectedCharacter.texture = spriteAssignment.standingRight[0];
            } else if (direction === CharacterDirection.UP) {
                selectedCharacter.texture = spriteAssignment.standingUp[0];
            } else if (direction === CharacterDirection.LEFT) {
                selectedCharacter.texture = spriteAssignment.standingLeft[0];
            }
        }
    }
}