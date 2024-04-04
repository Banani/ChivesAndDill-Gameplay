import { CharacterClientEvents, GlobalStore } from '@bananos/types';
import { forEach, now } from 'lodash';
import * as PIXI from 'pixi.js';
import boodPoolImage from '../../assets/spritesheets/player/bloodPool.png';
import { GameSettings, Renderer } from './Renderer';

export class BloodPoolsRenderer implements Renderer {
    private bloodPools: Record<string, PIXI.Sprite> = {};
    private numberTimestamps: Record<string, number> = {};
    private container: PIXI.Container;

    constructor(container: PIXI.Container) {
        this.container = container;
    }

    updateScene(store: GlobalStore, _, settings: GameSettings) {
        forEach(store.characterPowerPoints.events, (event, i) => {
            if (event.type === CharacterClientEvents.CharacterLostHp) {
                const eventId = (event as any).id;
                if (this.numberTimestamps[eventId]) {
                    return;
                }

                const currentTimestamp = now();

                this.bloodPools[eventId] = new PIXI.Sprite();
                this.bloodPools[eventId].anchor.set(-0.3, -0.3);
                this.bloodPools[eventId].texture = PIXI.Texture.from(boodPoolImage);
                this.bloodPools[eventId].x = event.location.x;
                this.bloodPools[eventId].y = event.location.y;

                this.numberTimestamps[eventId] = currentTimestamp;
                this.container.addChild(this.bloodPools[eventId]);
            }
        });

        const currentTimestamp = now();
        forEach(this.bloodPools, (number, eventId) => {
            if (this.numberTimestamps[eventId] + 500 < currentTimestamp) {
                this.container.removeChild(this.bloodPools[eventId]);
                delete this.bloodPools[eventId];
            }
        });
    }

    render(store: GlobalStore) { }
}
