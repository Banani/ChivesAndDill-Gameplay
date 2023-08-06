import { EngineMessages } from '@bananos/types';
import React, { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { PackageContext } from '../../contexts/PackageContext';
import { environment } from '../../environments/environment';

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
            context.socket.off(EngineMessages.Package);
            context.socket.on(EngineMessages.Package, (enginePackage) => {
                packageContext.updatePackage(enginePackage);
            });
        }
    }, [context, packageContext.updatePackage]);

    return <SocketContext.Provider value={context}>{children}</SocketContext.Provider>;
};
