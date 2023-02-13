
import { EquipmentItemTemplate, ItemTemplate, ItemTemplateType, RecursivePartial } from "@bananos/types";
import { Tooltip } from "@mui/material";
import { FunctionComponent, useMemo } from "react";
import styles from "./ItemPreview.module.scss";

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
        <img src={itemTemplate.image} className={styles['item-image-preview']} />
    </Tooltip>)
}