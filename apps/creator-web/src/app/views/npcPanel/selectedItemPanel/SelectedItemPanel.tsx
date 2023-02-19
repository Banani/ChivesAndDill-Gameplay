import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { TextField } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridRenderCellParams } from "@mui/x-data-grid";
import _ from 'lodash';
import { useContext, useState } from "react";
import { Label } from "../../../components";
import { PackageContext } from "../../../contexts";
import { MapContext } from '../../components';
import { NpcContext } from "../NpcContextProvider";
import styles from "./SelectedItemPanel.module.scss";

export const SelectedItemPanel = () => {
    const packageContext = useContext(PackageContext);
    const { activeNpcTemplate, setHighlightedNpcId, deleteNpc } = useContext(NpcContext);
    const { centerAt } = useContext(MapContext);
    // NPC type
    const [activeNpc, setActiveNpc] = useState<null | any>(null);
    const npcs = packageContext.backendStore.npcs?.data ?? {};

    const matchedInstances = _.chain(npcs).pickBy(npc => npc.npcTemplateId === activeNpcTemplate?.id).map((npc, key) => ({ ...npc, id: key })).value()

    return <div className={styles['panel']}>
        <Label>Active Npc Template: {activeNpcTemplate?.id ? <b>{activeNpcTemplate.name}</b> : "-"}</Label>
        <div className={styles['npc-instances-list']}>
            <DataGrid
                componentsProps={{
                    row: {
                        onMouseEnter: (e: any) => setHighlightedNpcId(e.currentTarget.dataset.id),
                        onMouseLeave: () => setHighlightedNpcId(null)
                    }
                }}
                rows={matchedInstances}
                columns={[{
                    field: 'location.x',
                    headerName: 'X',
                    width: 24,
                    // NPC type
                    renderCell: (params: GridRenderCellParams<any>) => {
                        return params.row.location.x;
                    },
                }, {
                    field: 'y',
                    headerName: 'Y',
                    width: 24,
                    // NPC type
                    renderCell: (params: GridRenderCellParams<any>) => {
                        return params.row.location.y;
                    },
                }, {
                    field: 'walkingType',
                    headerName: 'Walking type',
                    flex: 1
                }, {
                    field: 'time',
                    headerName: 'Respawn time (in miliseconds)',
                    flex: 1
                }, {
                    field: 'actions',
                    headerName: 'Actions',
                    type: 'actions',
                    width: 80,
                    getActions: ({ row }) => {
                        return [
                            <GridActionsCellItem
                                label="Search"
                                icon={<SearchIcon />}
                                onClick={() => centerAt({ x: -row.location.x * 32, y: -row.location.y * 32 })}
                            />,
                            <GridActionsCellItem
                                label="Delete"
                                icon={<DeleteIcon />}
                                onClick={() => deleteNpc(row.id)}
                            />,
                        ];
                    },
                }]}
                density="compact"
                onSelectionModelChange={(a) => setActiveNpc(a[0] ? npcs[a[0]] : null)}
                autoPageSize
            />
        </div>
        <div className={styles['npc-edit-panel']}>
            {activeNpc ? <>
                <TextField
                    value={activeNpc.time}
                    onChange={(e) => {
                        setActiveNpc({
                            ...activeNpc,
                            time: parseInt(e.target.value)
                        })
                    }}
                    margin="dense"
                    label="Respawn time"
                    fullWidth
                    variant="standard"
                    type="number"
                />
            </> : null}
        </div>
    </div>
}