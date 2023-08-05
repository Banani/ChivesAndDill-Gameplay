import { GlobalStore } from "@bananos/types";
import { GameApi } from "../game";

export interface Renderer {
    updateScene(store: GlobalStore, gameApi: GameApi);
    render(store: GlobalStore)
}