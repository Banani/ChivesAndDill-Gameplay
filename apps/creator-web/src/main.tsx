import React from 'react';
import ReactDOM from 'react-dom';

import App from './app/app';

// issue in mui
// https://github.com/mui/mui-x/issues/5239
declare global {
   namespace React {
      interface DOMAttributes<T> {
         onResize?: ReactEventHandler<T> | undefined;
         onResizeCapture?: ReactEventHandler<T> | undefined;
         nonce?: string | undefined;
      }
   }
}

ReactDOM.render(
   <React.StrictMode>
      <App />
   </React.StrictMode>,
   document.getElementById('root')
);
