import { FunctionComponent } from "react";
import { Rectangle } from "../../views/components";
import { useRoundAnimation } from "./useRoundAnimation";

interface AnimatedSelectionProps {
    location: { x: number, y: number }
}

export const AnimatedSelection: FunctionComponent<AnimatedSelectionProps> = ({ location }) => {
    const { animation } = useRoundAnimation();

    return <Rectangle
        color={'1976d2'}
        opacity={0.6 + (animation) / 6}
        location={location}
        size={{
            width: 32 + 6,
            height: 32 + 6,
        }}
    />
}