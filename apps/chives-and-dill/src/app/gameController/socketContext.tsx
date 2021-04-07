import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import AppContext from "./context";

const socketContext = ({ children }) => {

  const [context, setContext] = useState({});

  useEffect(() => {
    const URL = 'http://localhost:3000';
    setContext({
      ...context,
      socket: io(URL, { autoConnect: true })
    })
  }, [])

  return (
    <AppContext.Provider value={context}>
      {children}
    </AppContext.Provider>
  )
}

export default socketContext;