import { EngineAction, PlayerClientActions } from '@bananos/types';
import { omit } from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { environment } from '../environments/environment';
import { PackageContext } from './PackageContext';

interface EngineContextProps {
    callEngineAction: (action: EngineAction) => void;
}

export const EngineContext = React.createContext<EngineContextProps | null>(null);

export const EngineApi = ({ children }) => {
    const [socket, setSocket] = useState<any>(null);
    const packageContext = useContext(PackageContext);

    useEffect(() => {
        const URL = environment.engineUrl;
        setSocket(io(URL, { autoConnect: true }));
    }, []);

    useEffect(() => {
        if (socket) {
            socket.off(PlayerClientActions.Package);
            socket.on(PlayerClientActions.Package, (enginePackage) => {
                packageContext.updatePackage(enginePackage);
            });
        }
    }, [socket, packageContext.updatePackage]);

    const callEngineAction = useCallback((action: EngineAction) => {
        socket?.emit(action.type, omit(action, 'type'))
    }, [socket]);

    return <EngineContext.Provider value={{ callEngineAction }}>{children}</EngineContext.Provider>;
};
