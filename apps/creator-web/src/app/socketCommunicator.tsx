import React, { useContext, useEffect, useState } from 'react';
import { PackageContext } from './PackageContext';

export const SocketContext = React.createContext(null);

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
         packageContext.updatePackage(JSON.parse(JSON.parse(message.data)));
      };
   }, []);

   return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export default SocketCommunicator;
