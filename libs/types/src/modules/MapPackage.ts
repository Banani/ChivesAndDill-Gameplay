import { Location } from "../shared";

export type MapSchema = Record<
    string,
    {
        path: string;
        location: Location;
        collision: boolean;
    }
>;

export interface MapDefinition {
    [key: string]: {
        upperSpriteId?: string;
        bottomSpriteId?: string;
    };
}