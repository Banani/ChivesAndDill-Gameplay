import { GlobalStore } from "@bananos/types";
import { forEach } from "lodash";
import * as PIXI from 'pixi.js';
import { Renderer } from "./Renderer";

export class ProjectileRenderer implements Renderer {
    private projectiles: Record<string, PIXI.Sprite> = {};
    private container: PIXI.Container;

    constructor(container: PIXI.Container) {
        this.container = container;
    }

    updateScene(store: GlobalStore) {
        forEach(store.projectileMovements.data, (projectile, projectileId) => {
            if (this.projectiles[projectileId]) {
                return;
            }

            this.projectiles[projectileId] = PIXI.Sprite.from("../assets/spritesheets/spells/mage/spellsView/fireball.png");
            this.projectiles[projectileId].x = projectile.location.x;
            this.projectiles[projectileId].y = projectile.location.y;
            this.projectiles[projectileId].rotation = projectile.angle + 1.5
            this.projectiles[projectileId].scale = { x: 1, y: 1 };
            this.container.addChild(this.projectiles[projectileId])
        });

        forEach(this.projectiles, (_, projectileId) => {
            if (!store.projectileMovements.data[projectileId]) {
                this.container.removeChild(this.projectiles[projectileId])
                delete this.projectiles[projectileId];
            }
        })
    }

    render(store: GlobalStore) {
        forEach(store.projectileMovements.data, (projectile, projectileId) => {
            this.projectiles[projectileId].x = projectile.location.x;
            this.projectiles[projectileId].y = projectile.location.y;
            this.projectiles[projectileId].rotation = projectile.angle + 1.5
        });
    }
}