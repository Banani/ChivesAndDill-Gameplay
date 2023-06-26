import { Spell } from "@bananos/types";
import { Tooltip } from "@mui/material";
import { FunctionComponent, useMemo } from "react";
import { ImagePreview } from "../imagePreview";

interface SpellPreviewProps {
    spell: Spell
}

export const SpellPreview: FunctionComponent<SpellPreviewProps> = ({ spell }) => {
    const tooltipContent = useMemo(() => {
        return <>
            name: {spell.name} <br />
        </>
    }, [spell])

    return (<Tooltip title={tooltipContent} placement="bottom" >
        <div>
            <ImagePreview src={spell.image} />
        </div>
    </Tooltip >)
}