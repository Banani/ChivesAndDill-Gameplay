import { QuestSchema } from '@bananos/types';
import { GridColDef, GridRenderCellParams, GridSelectionModel } from '@mui/x-data-grid';
import _ from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { AssignmentPanel } from '../../../components/assignmentPanel';
import { ItemPreview } from '../../../components/itemPreview';
import { PackageContext } from '../../../contexts';
import { DialogContext, Dialogs } from '../../../contexts/dialogContext';
import { FormContext } from '../../../contexts/FormContext';


export const NpcQuests = () => {
    const packageContext = useContext(PackageContext);
    const questSchemas = packageContext?.backendStore?.questSchemas?.data ?? {};
    const itemTemplates = packageContext?.backendStore?.itemTemplates?.data ?? {};
    const npcTemplates = packageContext?.backendStore?.npcTemplates?.data ?? {};
    const [localQuestSchemas, setLocalQuestsSchemas] = useState<Record<string, QuestSchema>>({});
    const { activeDialog } = useContext(DialogContext);
    const [initSelectionModel, setInitSelectionModel] = useState<GridSelectionModel>([]);
    const { changeValue, getFieldValue } = useContext(FormContext);

    useEffect(() => {
        if (activeDialog === Dialogs.NpcTemplateDialogs) {
            const quests = getFieldValue('quests')
            setInitSelectionModel(_.map(quests, (_, questId) => questId))
            setLocalQuestsSchemas(_.mapValues(quests, (_, stockItemId) => questSchemas[stockItemId]))
        }
    }, [activeDialog === Dialogs.NpcTemplateDialogs, questSchemas])

    useEffect(() => {
        changeValue('quests', _.mapValues(localQuestSchemas, () => true))
    }, [localQuestSchemas]);

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', flex: 1 },
        {
            field: 'questReward.experience',
            headerName: 'Experience',
            flex: 1,
            renderCell: (params: GridRenderCellParams<QuestSchema>) => {
                return params.row.questReward.experience;
            }
        },
        {
            field: 'questReward.currency',
            headerName: 'Money reward (in coppers)',
            flex: 1,
            renderCell: (params: GridRenderCellParams<QuestSchema>) => {
                return params.row.questReward.currency;
            },
        },

        {
            field: 'npcs_amount',
            headerName: 'Assigned to NPCs',
            flex: 1,
            renderCell: (params: GridRenderCellParams<QuestSchema>) => {
                return <>
                    {_.filter(npcTemplates, npcTemplate => npcTemplate.quests[params.row.id]).length}
                </>
            },
        },
        {
            field: 'questReward.items',
            headerName: 'Items reward',
            flex: 1,
            renderCell: (params: GridRenderCellParams<QuestSchema>) => {
                return <>
                    {_.map(params.row.questReward.items, (item, key) =>
                        <ItemPreview key={key} itemTemplate={itemTemplates[item.itemTemplateId]} />
                    )}
                </>
            },
        }
    ];

    return (
        <AssignmentPanel
            allItems={questSchemas}
            allItemsColumnDefinition={columns}
            selectedItems={localQuestSchemas}
            selectedItemsColumnDefinition={columns}
            updateSelectedItems={setLocalQuestsSchemas}
            initSelectionModel={initSelectionModel}
        />
    );
};
