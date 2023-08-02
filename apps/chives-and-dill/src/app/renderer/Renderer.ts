import { GlobalStore } from "@bananos/types";

export interface Renderer {
    updateScene(store: GlobalStore);
    render(store: GlobalStore)
}