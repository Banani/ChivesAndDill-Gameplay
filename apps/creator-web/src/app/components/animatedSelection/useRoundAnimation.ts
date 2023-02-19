import { useEffect, useState } from "react";

export const useRoundAnimation = () => {
    
    const [step, setStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStep(prev => (prev + 0.1) % 2)
        }, 1000 / 60)

        return () => clearInterval(interval);
    }, [])

    const animation = step - (Math.floor(step) * 2 * (step % 1))

    return {
        animation
    }
}