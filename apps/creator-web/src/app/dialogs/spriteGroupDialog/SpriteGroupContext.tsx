import React, { useCallback, useContext } from 'react';
import { ACTIONS } from '../../actions';
import { SocketContext } from '../../contexts';


interface SpriteGroupsContextReturns {
    createSpriteGroup: (param: { name: string }) => void;
    deleteSpriteGroup: (id: string) => void;
}

export const SpriteGroupContext = React.createContext<SpriteGroupsContextReturns>({} as SpriteGroupsContextReturns);

export const SpriteGroupContextProvider = ({ children }: any) => {
    const { socket } = useContext(SocketContext);

    const createSpriteGroup = useCallback(
        (spriteGroup) => {
            socket.send(JSON.stringify({ actionType: ACTIONS.CREATE_SPRITE_GROUP, spriteGroup }));
        },
        [socket]
    );

    const deleteSpriteGroup = useCallback(
        (id: string) => {
            socket.send(JSON.stringify({ actionType: ACTIONS.DELETE_SPRITE_GROUP, id }));
        },
        [socket]
    );

    return <SpriteGroupContext.Provider value={{ createSpriteGroup, deleteSpriteGroup }}>{children}</SpriteGroupContext.Provider>;
};
