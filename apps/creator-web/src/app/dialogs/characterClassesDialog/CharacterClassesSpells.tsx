import { CharacterClassSpellAssignment, QuestRewardItem, Spell } from "@bananos/types";
import { GridRenderCellParams, GridSelectionModel } from "@mui/x-data-grid";
import { useContext, useEffect, useState } from "react";
import { ImagePreview } from "../../components";
import { AssignmentPanel } from "../../components/assignmentPanel";
import { PackageContext } from "../../contexts";
import { FormContext } from "../../contexts/FormContext";
import { DialogContext, Dialogs } from "../../contexts/dialogContext";

export const CharacterClassSpells = () => {
    const { activeDialog } = useContext(DialogContext);
    const { changeValue, getFieldValue, errors, isFormReady } = useContext(FormContext);
    const packageContext = useContext(PackageContext);
    const spells = packageContext?.backendStore?.spells?.data ?? {};
    const [initSelectionModel, setInitSelectionModel] = useState<GridSelectionModel>([]);

    useEffect(() => {
        if (activeDialog === Dialogs.CharacterClassDialog && isFormReady) {
            const spells = getFieldValue('spells');
            setInitSelectionModel(Object.keys(spells))
        }
    }, [activeDialog === Dialogs.CharacterClassDialog, getFieldValue, isFormReady])

    const columns = [
        {
            field: 'image',
            headerName: 'Icon image',
            renderCell: (params: GridRenderCellParams<Spell>) =>
                <ImagePreview src={params.row.image} />,
        },
        {
            field: 'name',
            headerName: 'Item Name',
            flex: 1,
            renderCell: (params: GridRenderCellParams<QuestRewardItem>) => {
                return spells[params.id].name;
            },
        },
    ]

    const selectedColumns = [...columns,
    {
        field: 'minLevel',
        headerName: 'Required level',
        type: 'number',
        flex: 1,
        editable: true,
    }]


    if (!isFormReady) {
        return null;
    }
    const selectedSpells = getFieldValue('spells');

    return (<>
        <AssignmentPanel
            allItems={spells}
            allItemsColumnDefinition={columns}
            selectedItems={selectedSpells}
            selectedItemsColumnDefinition={selectedColumns}
            mapItemForPreview={(item: CharacterClassSpellAssignment) => ({
                id: item.spellId,
                name: spells[item.spellId].name,
                image: spells[item.spellId].image,
                minLevel: item.minLevel,
            })}
            mapItemForSave={(item, newRow) => ({
                ...item,
                minLevel: newRow.minLevel
            }
            )}
            idField={'spellId'}
            updateSelectedItems={(callback) => changeValue('spells', callback(selectedSpells))}
            getInitialRow={(id) => ({ spellId: id, minLevel: 1 })}
            initSelectionModel={initSelectionModel}
            errors={errors}
            errorPath="spells."
        />
    </>)
}