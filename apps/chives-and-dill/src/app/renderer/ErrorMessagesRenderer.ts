import { ErrorMessageEvent, GlobalStore } from '@bananos/types';
import _, { forEach, now } from 'lodash';
import * as PIXI from 'pixi.js';
import { GameSettings, Renderer } from './Renderer';

export class ErrorMessageRenderer implements Renderer {
    private errorMessages: Record<string, PIXI.Text> = {};
    private numberTimestamps: Record<string, number> = {};
    private container: PIXI.Container;
    private textStyle: PIXI.TextStyle;

    constructor(container: PIXI.Container) {
        this.container = container;
        this.textStyle = new PIXI.TextStyle({ fontSize: 22, fill: '#8f0303', stroke: '#000000', strokeThickness: 2, fontFamily: 'Septimus' });
    }

    updateScene(store: GlobalStore, _, settings: GameSettings) {
        forEach(store.errorMessages.events, (event: ErrorMessageEvent, i) => {
            const eventId = (event as any).id;
            if (this.numberTimestamps[eventId]) {
                return;
            }

            const currentTimestamp = now();
            const location = store.characterMovements.data[store.activeCharacter.data.activeCharacterId].location;

            this.errorMessages[eventId] = new PIXI.Text(event.message, this.textStyle);
            this.errorMessages[eventId].x = location.x;
            this.errorMessages[eventId].y = location.y + i * 22 - 150;
            this.errorMessages[eventId].anchor.set(0.5, 0);
            this.numberTimestamps[eventId] = currentTimestamp;
            this.container.addChild(this.errorMessages[eventId]);
        });

        const currentTimestamp = now();
        forEach(this.errorMessages, (number, eventId) => {
            if (this.numberTimestamps[eventId] + 2000 < currentTimestamp) {
                this.container.removeChild(this.errorMessages[eventId]);
                delete this.errorMessages[eventId];
            }
        });
    }

    render(store: GlobalStore) {
        _.forEach(this.errorMessages, (event, index) => {
           const location = store.characterMovements.data[store.activeCharacter.data.activeCharacterId].location;
           const eventId = index;
           //TODO change to event.id
           this.errorMessages[eventId].x = location.x;
           this.errorMessages[eventId].y = location.y + 1 * 22 - 150;
        });
    }
}
