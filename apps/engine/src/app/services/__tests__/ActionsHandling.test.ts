import { GlobalStoreModule } from "@bananos/types";
import { ItemEngineEvents } from "../../modules/ItemModule/Events";
import { EngineManager, checkIfPackageIsValid } from "../../testUtilities";

const setupEngine = () => {
    const engineManager = new EngineManager();

    const players = {
        '1': engineManager.preparePlayerWithCharacter({ name: 'character_1' }),
    };

    return { engineManager, players };
};

describe('Actions Handling', () => {
    it('Player should not be able to trigger internal action', () => {
        const { players, engineManager } = setupEngine();

        const dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: ItemEngineEvents.GenerateItemForCharacter,
            characterId: players['1'].characterId,
            itemTemplateId: '7',
            amount: 1,
        } as any);

        checkIfPackageIsValid(GlobalStoreModule.BACKPACK_ITEMS, dataPackage, undefined);
    });
})