import { EngineMessages } from '@bananos/types';
import { newPackage } from 'libs/socket-store/src';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';

export const SocketContext = React.createContext(null);

const SocketCommunicator = ({ children }: any) => {
   const [context, setContext] = useState<any>({});
   const dispatch = useDispatch();
   useEffect(() => {
      const URL = 'http://localhost:8080';
      setContext({
         ...context,
         socket: io(URL, { autoConnect: true }),
      });
   }, []);

   useEffect(() => {
      if (context.socket) {
         context.socket.on(EngineMessages.Package, (event: any) => {
            dispatch(newPackage(event));
         });
      }
   }, [context]);

   return <SocketContext.Provider value={context}>{children}</SocketContext.Provider>;
};

export default SocketCommunicator;
