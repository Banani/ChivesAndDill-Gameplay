import { GlobalStore } from "@bananos/types";
import { GameApi } from "../game";
import { GameSize } from '../hooks';

export interface GameSettings {
   gameSize: GameSize;
}

export interface Renderer {
   updateScene(store: GlobalStore, gameApi: GameApi, settings: GameSettings);
   render(store: GlobalStore);
}