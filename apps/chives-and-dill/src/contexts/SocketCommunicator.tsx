import { PlayerClientActions } from '@bananos/types';
import React, { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { environment } from '../environments/environment';
import { PackageContext } from './PackageContext';

export const SocketContext = React.createContext(null);

export const SocketCommunicator = ({ children }) => {
    const [context, setContext] = useState<any>({});
    const packageContext = useContext(PackageContext);

    useEffect(() => {
        const URL = environment.engineUrl;
        setContext({
            ...context,
            socket: io(URL, { autoConnect: true }),
        });
    }, []);

    useEffect(() => {
        if (context.socket) {
            context.socket.off(PlayerClientActions.Package);
            context.socket.on(PlayerClientActions.Package, (enginePackage) => {
                packageContext.updatePackage(enginePackage);
            });
        }
    }, [context, packageContext.updatePackage]);

    return <SocketContext.Provider value={context}>{children}</SocketContext.Provider>;
};
