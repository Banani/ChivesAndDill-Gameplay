import { useApp } from '@inlet/react-pixi';
import { useEffect, useState } from 'react';

export const useMessageCenter = () => {
    const [messageLocation, setMessageLocation] = useState({ x: 300, y: 300 });
    const app = useApp();

    useEffect(() => {
        setMessageLocation({ x: app.view.width / 2, y: app.view.height / 4 });
    }, [app.stage.width, app.stage.height]);

    return { messageLocation };
};
