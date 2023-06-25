import { Spell } from '@bananos/types';
import { GridColDef, GridRenderCellParams, GridSelectionModel } from '@mui/x-data-grid';
import _ from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { ImagePreview } from '../../../components';
import { AssignmentPanel } from '../../../components/assignmentPanel';
import { PackageContext } from '../../../contexts';
import { FormContext } from '../../../contexts/FormContext';
import { DialogContext, Dialogs } from '../../../contexts/dialogContext';


export const MonsterSpells = () => {
    const { activeDialog } = useContext(DialogContext);
    const { changeValue, getFieldValue } = useContext(FormContext);
    const packageContext = useContext(PackageContext);
    const spells = packageContext?.backendStore?.spells?.data ?? {};
    const [localSpells, setLocalSpells] = useState<Record<string, Spell>>({});
    const [initSelectionModel, setInitSelectionModel] = useState<GridSelectionModel>([]);

    useEffect(() => {
        if (activeDialog === Dialogs.MonsterTemplateDialog) {
            const selectedSpells = getFieldValue('spells');
            setInitSelectionModel(_.map(selectedSpells, (_, spellId) => spellId))
            setLocalSpells(_.mapValues(selectedSpells, (_, spellId) => spells[spellId]));
        }
    }, [activeDialog === Dialogs.MonsterTemplateDialog, spells])

    useEffect(() => {
        changeValue('spells', _.mapValues(localSpells, () => true))
    }, [localSpells]);

    const columns: GridColDef[] = [
        {
            field: 'image',
            headerName: 'Image',
            renderCell: (params: GridRenderCellParams<Spell>) => {
                return <ImagePreview src={params.row.image} />
            },
        }, { field: 'name', headerName: 'Item Name', flex: 1 }
    ];

    return (
        <AssignmentPanel
            allItems={spells}
            allItemsColumnDefinition={columns}
            selectedItems={localSpells}
            selectedItemsColumnDefinition={columns}
            initSelectionModel={initSelectionModel}
            updateSelectedItems={setLocalSpells}
        />
    );
};