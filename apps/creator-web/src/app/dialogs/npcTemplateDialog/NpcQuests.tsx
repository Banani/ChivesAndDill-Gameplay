import { QuestSchema } from '@bananos/types';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import _ from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { AssignmentPanel } from '../../components/assignmentPanel';
import { ItemPreview } from '../../components/itemPreview';
import { PackageContext } from '../../contexts';
import { NpcContext, NpcTemplate } from '../../views';


export const NpcQuests = () => {
    const packageContext = useContext(PackageContext);
    const questSchemas = packageContext?.backendStore?.questSchemas?.data ?? {};
    const itemTemplates = packageContext?.backendStore?.itemTemplates?.data ?? {};
    const npcTemplates = packageContext?.backendStore?.npcTemplates?.data ?? {};
    const [localQuestSchemas, setLocalQuestsSchemas] = useState<Record<string, QuestSchema>>({});
    const { setActiveNpcTemplate } = useContext(NpcContext);

    useEffect(() => {
        setActiveNpcTemplate((prev: NpcTemplate) => ({
            ...prev,
            quests: _.mapValues(localQuestSchemas, () => true),
        }));
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
                    {_.map(params.row.questReward.items, item =>
                        <ItemPreview itemTemplate={itemTemplates[item.itemTemplateId]} />
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
        />
    );
};
