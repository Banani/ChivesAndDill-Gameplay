import { GlobalStore, SpellClientEvent, SpellLandedEvent } from '@bananos/types';
import { forEach, now } from 'lodash';
import * as PIXI from 'pixi.js';
import { BlinkSpellDefinitions } from '../mapContent/BlinkSpellDefinitions';
import { GameSettings, Renderer } from './Renderer';

interface NumberTimestamps {
    currentTimestamp: number;
    event: SpellLandedEvent;
}

export class BlinkSpellEffectRenderer implements Renderer {
    private blinkSpellEffects: PIXI.Graphics;
    private numberTimestamps: Record<string, NumberTimestamps> = {};
    private container: PIXI.Container;
    private typeDrawer = {};
    private spellsHistory: Record<string, SpellLandedEvent> = {};

    constructor(container: PIXI.Container) {
        this.container = container;

        const angleBlastDrawer = (g, spellLandedEvent) => {
            const spellDefintion = BlinkSpellDefinitions[spellLandedEvent.spell.type];
            const revertedAngle = spellLandedEvent.angle + Math.PI;
            const angle = (2 * Math.PI - revertedAngle + Math.PI) % (Math.PI * 2);

            g.beginFill(spellDefintion.color, spellDefintion.alpha);
            g.arc(
                spellLandedEvent.castLocation.x,
                spellLandedEvent.castLocation.y,
                spellLandedEvent.spell.range,
                angle - spellLandedEvent.spell.angle / 2,
                angle + spellLandedEvent.spell.angle / 2
            );
            g.lineTo(spellLandedEvent.castLocation.x, spellLandedEvent.castLocation.y);
            g.endFill();
        };

        const areaBlastDrawer = (g, spellLandedEvent) => {
            const spellDefintion = BlinkSpellDefinitions[spellLandedEvent.spell.type];

            g.beginFill(spellDefintion.color, spellDefintion.alpha);
            g.drawCircle(spellLandedEvent.directionLocation.x, spellLandedEvent.directionLocation.y, spellLandedEvent.spell.radius);
            g.endFill();
        }


        this.typeDrawer = {
            AngleBlast: angleBlastDrawer,
            Area: areaBlastDrawer,
        };
    }

    updateScene(store: GlobalStore, _, settings: GameSettings) {
        if (!this.blinkSpellEffects) {
            this.blinkSpellEffects = new PIXI.Graphics();
            this.container.addChild(this.blinkSpellEffects);
        }

        forEach(store.spells.events, (event) => {
            const eventId = (event as any).id;
            if (event.type === SpellClientEvent.SpellLanded && !this.spellsHistory[eventId]) {
                if (this.numberTimestamps[eventId]) {
                    return;
                }

                this.spellsHistory = {
                    [eventId]: event,
                };

                this.numberTimestamps[eventId] = {
                    currentTimestamp: now(),
                    event: event,
                };
            }
        });

        const currentTimestamp = now();
        forEach(this.numberTimestamps, (number, eventId) => {
            if (this.numberTimestamps[eventId].currentTimestamp + 100 < currentTimestamp) {
                delete this.numberTimestamps[eventId];
                this.blinkSpellEffects.clear();
            }
        });
    }

    render(store: GlobalStore) {
        this.blinkSpellEffects.clear();
        forEach(this.numberTimestamps, (event) => {
            const definition = BlinkSpellDefinitions[event.event.spell.type];
            if (definition && this.typeDrawer[definition.type]) {
                this.typeDrawer[definition.type](this.blinkSpellEffects, event.event);
            }
        });
    }
}
