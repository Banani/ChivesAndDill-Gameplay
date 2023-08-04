import { ChannelType, CharacterType, GlobalStore } from "@bananos/types";
import { forEach, now } from "lodash";
import * as PIXI from 'pixi.js';
import { Renderer } from "./Renderer";

export class DialogRenderer implements Renderer {
    private dialogs: Record<string, PIXI.Text> = {};
    private dialogTimestamps: Record<string, number> = {};
    private container: PIXI.Container;
    private textStyles: Record<string, PIXI.TextStyle>;

    constructor(container: PIXI.Container) {
        this.container = container;
        const defaultFontSettings: Partial<PIXI.ITextStyle> = {
            fontSize: 18,
            stroke: '#000000',
            fontWeight: 'bold',
            lineJoin: 'round',
            strokeThickness: 4,
            wordWrap: true,
            wordWrapWidth: 200,
            align: 'center',
        }

        this.textStyles = {
            [CharacterType.Monster]: new PIXI.TextStyle({
                ...defaultFontSettings,
                fill: "#ea5c19",
            }),
            [CharacterType.Npc]: new PIXI.TextStyle({
                ...defaultFontSettings,
                fill: "#e5e4e0",
            }),
            [CharacterType.Player]: new PIXI.TextStyle({
                ...defaultFontSettings,
                fill: "#e5e4e0",
            }),
        }
    }

    updateScene(store: GlobalStore) {
        const currentTimestamp = now();
        forEach(store.chatMessages.data, message => {
            if (this.dialogTimestamps[message.id]) {
                return;
            }

            if (message.channelType === ChannelType.System) {
                return;
            }

            const character = store.character.data[message.authorId];
            const location = store.characterMovements.data[message.authorId].location
            this.dialogTimestamps[message.id] = currentTimestamp;
            this.dialogs[message.id] = new PIXI.Text(character.name + ": \n" + message.message, this.textStyles[character.type])
            this.dialogs[message.id].x = location.x + ((Math.random() - 0.5) * 25);
            this.dialogs[message.id].y = location.y - 48 - 40;
            this.dialogs[message.id].anchor.set(0.5, 0);
            this.container.addChild(this.dialogs[message.id]);

        })

        forEach(this.dialogs, (_, dialogId) => {
            if (this.dialogTimestamps[dialogId] + 3000 < currentTimestamp) {
                this.container.removeChild(this.dialogs[dialogId]);
                delete this.dialogs[dialogId];
            }
        })
    }

    render(store: GlobalStore) { }
}