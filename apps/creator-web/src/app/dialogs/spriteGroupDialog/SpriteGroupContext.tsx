import React, { useCallback, useContext } from 'react';
import { ACTIONS } from '../../actions';
import { SocketContext } from '../../contexts';


interface SpriteGroupsContextReturns {
    createSpriteGroup: (param: { name: string }) => void;
}

export const SpriteGroupContext = React.createContext<SpriteGroupsContextReturns>({} as SpriteGroupsContextReturns);

export const SpriteGroupContextProvider = ({ children }: any) => {
    const { socket } = useContext(SocketContext);

    const createSpriteGroup = useCallback(
        (spriteGroup) => {
            console.log('wyslano')
            socket.send(JSON.stringify({ actionType: ACTIONS.CREATE_SPRITE_GROUP, spriteGroup }));
        },
        [socket]
    );

    return <SpriteGroupContext.Provider value={{ createSpriteGroup }}>{children}</SpriteGroupContext.Provider>;
};
