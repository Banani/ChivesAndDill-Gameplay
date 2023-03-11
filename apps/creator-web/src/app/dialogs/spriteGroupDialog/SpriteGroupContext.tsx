import React, { useCallback, useContext, useState } from 'react';
import { ACTIONS } from '../../actions';
import { SocketContext } from '../../contexts';


interface SpriteGroupsContextReturns {
    createSpriteGroup: (param: any) => void;
    deleteSpriteGroup: (id: string) => void;
    setActiveSpriteGroup: (spriteGroup: any) => void;
    updateSpriteGroup: (spriteGroup: any) => void;
    activeSpriteGroup: any;
}

export const SpriteGroupContext = React.createContext<SpriteGroupsContextReturns>({} as SpriteGroupsContextReturns);

export const SpriteGroupContextProvider = ({ children }: any) => {
    const { socket } = useContext(SocketContext);
    const [activeSpriteGroup, setActiveSpriteGroup] = useState();

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

    const updateSpriteGroup = useCallback(
        (spriteGroup) => {
            socket.send(JSON.stringify({ actionType: ACTIONS.UPDATE_SPRITE_GROUP, spriteGroup }));
        },
        [socket]
    );

    return <SpriteGroupContext.Provider value={{ createSpriteGroup, deleteSpriteGroup, setActiveSpriteGroup, activeSpriteGroup, updateSpriteGroup }}>{children}</SpriteGroupContext.Provider>;
};
