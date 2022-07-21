import { EngineMessages } from '@bananos/types';
import { newPackage } from 'libs/socket-store/src';
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { PackageContext } from './PackageContext';

export const SocketContext = React.createContext(null);

const SocketCommunicator = ({ children }: any) => {
   const [context, setContext] = useState<any>({});
   const packageContext = useContext(PackageContext);

   const dispatch = useDispatch();
   useEffect(() => {
      const URL = 'ws://localhost:8080';
      const socket = new WebSocket(URL);
      setContext({
         ...context,
         socket,
      });
      socket.onclose = function (...evt) {
         console.log(evt);
      };

      socket.onmessage = (...message) => {
         packageContext.updatePackage(JSON.parse(JSON.parse(message[0].data)));
      };
   }, []);

   useEffect(() => {
      console.log(packageContext.backendStore);
   }, [packageContext.backendStore]);

   return <SocketContext.Provider value={context}>{children}</SocketContext.Provider>;
};

export default SocketCommunicator;
