import { CharacterClientEvents, GlobalStore, HealthPointsSource } from "@bananos/types";
import { forEach, now } from "lodash";
import * as PIXI from 'pixi.js';
import { Renderer } from "./Renderer";

export class FloatingNumbersRenderer implements Renderer {
    private numbers: Record<string, PIXI.Text> = {};
    private numberTimestamps: Record<string, number> = {};
    private container: PIXI.Container;
    private textStyles: Record<string, PIXI.TextStyle>;

    constructor(container: PIXI.Container) {
        this.container = container;
        const fontSize = 20;

        this.textStyles = {
            [CharacterClientEvents.ExperienceGain]: new PIXI.TextStyle({
                fontSize,
                fill: 'purple'
            }),
            [CharacterClientEvents.DamageAbsorbed]: new PIXI.TextStyle({
                fontSize,
                fill: 'silver'
            }),
            [CharacterClientEvents.CharacterLostHp]: new PIXI.TextStyle({
                fontSize,
                fill: 'red'
            }),
            [CharacterClientEvents.CharacterGotHp]: new PIXI.TextStyle({
                fontSize,
                fill: 'green'
            }),
        }
    }

    updateScene(store: GlobalStore) {
        forEach(store.characterPowerPoints.events, event => {
            const eventId = (event as any).id;
            if (this.numberTimestamps[eventId]) {
                return;
            }

            if (event.type === CharacterClientEvents.CharacterLostHp) {
                this.createFloatingNumber({
                    eventId,
                    eventType: event.type,
                    location: event.location,
                    text: event.amount
                })
            }

            if (event.type === CharacterClientEvents.CharacterGotHp) {
                if (event.source === HealthPointsSource.Regeneration) {
                    return;
                }

                this.createFloatingNumber({
                    eventId,
                    eventType: event.type,
                    location: event.location,
                    text: event.amount
                })
            }
        })

        forEach(store.experience.events, event => {
            const eventId = (event as any).id;
            if (this.numberTimestamps[eventId]) {
                return;
            }

            if (event.type === CharacterClientEvents.ExperienceGain) {
                this.createFloatingNumber({
                    eventId,
                    eventType: event.type,
                    location: store.characterMovements.data[event.characterId].location,
                    text: "XP: " + event.amount
                })
            }
        });

        forEach(store.absorbShields.events, event => {
            const eventId = (event as any).id;
            if (this.numberTimestamps[eventId]) {
                return;
            }

            if (event.type === CharacterClientEvents.DamageAbsorbed) {
                this.createFloatingNumber({
                    eventId,
                    eventType: event.type,
                    location: store.characterMovements.data[event.characterId].location,
                    text: "absorb"
                })
            }
        });

        const currentTimestamp = now();
        forEach(this.numbers, (number, eventId) => {
            if (this.numberTimestamps[eventId] + 1000 < currentTimestamp) {
                this.container.removeChild(this.numbers[eventId]);
                delete this.numbers[eventId];
            }
        })
    }

    createFloatingNumber({ eventId, text, location, eventType }) {
        const currentTimestamp = now();
        this.numbers[eventId] = new PIXI.Text(text, this.textStyles[eventType])
        this.numbers[eventId].x = location.x + ((Math.random() - 0.5) * 25);
        this.numbers[eventId].y = location.y;
        this.numberTimestamps[eventId] = currentTimestamp;
        this.container.addChild(this.numbers[eventId]);
    }

    render(store: GlobalStore) {
        forEach(this.numbers, number => {
            number.y -= 1;
        })
    }
}