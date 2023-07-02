import _ from "lodash";
import { useContext, useEffect, useState } from "react";
import { PackageContext } from "../contexts";
import { SpriteGroup } from "../views/mapEditor/spritePanel";

export enum SpriteGroupFilterModes {
    All = "All",
    Unassigned = "Unassigned",
}

export const useSpriteGroupFilter = () => {
    const packageContext = useContext(PackageContext);

    const sprites = packageContext?.backendStore?.sprites?.data ?? {};
    const spriteGroups = (packageContext?.backendStore?.spriteGroups?.data ?? {}) as Record<string, SpriteGroup>;

    const spritesLastUpdate = packageContext?.backendStore?.sprites?.lastUpdateTime ?? 0;
    const spriteGroupsUpdate = packageContext?.backendStore?.spriteGroups?.lastUpdateTime ?? 0;

    const [filteredSprites, setFilteredSprites] = useState<Record<string, SpriteGroup>>({});
    const [spriteGroupFilter, setSpriteGroupFilter] = useState<SpriteGroupFilterModes | string>(SpriteGroupFilterModes.All);

    const spriteGroupSelectOptions = [
        { id: SpriteGroupFilterModes.All, name: SpriteGroupFilterModes.All },
        ..._.map(spriteGroups, ((spriteGroup, key) => ({
            id: key,
            name: spriteGroup.name
        }))),
        { id: SpriteGroupFilterModes.Unassigned, name: SpriteGroupFilterModes.Unassigned },
    ]

    useEffect(() => {
        const spriteGroup = spriteGroups[spriteGroupFilter];

        if (spriteGroupFilter == SpriteGroupFilterModes.Unassigned) {
            const assigned: Record<string, boolean> = {};

            // Might be worth to track it all the time instead of rebuilding it everytime the "Unassinged" is selected
            _.forEach(spriteGroups, group => {
                _.forEach(group.spriteAssignment, (_, id) => {
                    assigned[id] = true;
                })
            })

            setFilteredSprites(_.pickBy(sprites, (sprite: any) => !assigned[sprite.id]))
            return;
        }

        if (spriteGroupFilter == SpriteGroupFilterModes.All || !spriteGroup) {
            setFilteredSprites(sprites)
            return;
        }

        setFilteredSprites(_.pickBy(sprites, (sprite: any) => spriteGroup.spriteAssignment[sprite.id]))
    }, [spriteGroupFilter, spritesLastUpdate, spriteGroupsUpdate]);

    return {
        filteredSprites,
        spriteGroupFilter,
        setSpriteGroupFilter,
        spriteGroupSelectOptions
    }

}