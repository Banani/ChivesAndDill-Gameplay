import React, { useCallback, useContext, useEffect, useState } from 'react';
import { PackageContext } from './PackageContext';

export const SocketContext = React.createContext<any>(null);

const SocketCommunicator = ({ children }: any) => {
   const [socket, setSocket] = useState<any>({});
   const packageContext = useContext(PackageContext);

   useEffect(() => {
      const URL = 'ws://localhost:8080';
      const socket = new WebSocket(URL);
      setSocket(socket);

      socket.onclose = function (...evt) {
         console.log(evt);
      };

      socket.onmessage = (message: any) => {
         packageContext.updatePackage(JSON.parse(message.data));
      };
   }, []);

   const updateMapField = useCallback(
      ({ x, y }) => {
         socket.send(JSON.stringify({ x, y }));
      },
      [socket]
   );

   return <SocketContext.Provider value={{ socket, updateMapField }}>{children}</SocketContext.Provider>;
};

export default SocketCommunicator;
