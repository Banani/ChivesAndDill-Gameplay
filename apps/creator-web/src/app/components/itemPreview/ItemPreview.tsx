
import { EquipmentItemTemplate, ItemTemplate, ItemTemplateType, RecursivePartial } from "@bananos/types";
import { Tooltip } from "@mui/material";
import { FunctionComponent, useMemo } from "react";
import { ImagePreview } from "../imagePreview";

interface ItemPreviewProps {
    itemTemplate: ItemTemplate
}

const templateMap: RecursivePartial<Record<ItemTemplateType, any>> = {
    [ItemTemplateType.Equipment]: (itemTemplate: EquipmentItemTemplate) => {
        return (<>
            {itemTemplate.armor ? <>Armor: {itemTemplate.armor}<br /></> : null}
            {itemTemplate.stamina ? <>Stamina: {itemTemplate.stamina}<br /></> : null}
            {itemTemplate.strength ? <>Strength: {itemTemplate.strength}<br /></> : null}
            {itemTemplate.agility ? <>Agility: {itemTemplate.agility}<br /></> : null}
            {itemTemplate.intelect ? <>Intelect: {itemTemplate.intelect}<br /></> : null}
            {itemTemplate.spirit ? <>Spirit: {itemTemplate.spirit}<br /></> : null}
            {itemTemplate.haste ? <>Haste: {itemTemplate.haste}<br /></> : null}
            {itemTemplate.criticalStrike ? <>Critical Strike: {itemTemplate.criticalStrike}<br /></> : null}
            {itemTemplate.dodge ? <>Dodge: {itemTemplate.dodge}<br /></> : null}
            {itemTemplate.block ? <>Block: {itemTemplate.block}<br /></> : null}
        </>)
    }
}

export const ItemPreview: FunctionComponent<ItemPreviewProps> = ({ itemTemplate }) => {

    const tooltipContent = useMemo(() => {
        return <>
            name: {itemTemplate.name} <br />
            value: {itemTemplate.value} <br />
            type: {itemTemplate.type} <br />
            {templateMap[itemTemplate.type] ? templateMap[itemTemplate.type](itemTemplate) : null}
        </>
    }, [itemTemplate])

    return (<Tooltip title={tooltipContent} placement="right">
        <ImagePreview src={itemTemplate.image} />
    </Tooltip>)
}