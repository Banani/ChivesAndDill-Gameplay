import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridRenderCellParams } from "@mui/x-data-grid";
import _ from 'lodash';
import { useContext, useState } from "react";
import { Label } from "../../../components";
import { PackageContext } from "../../../contexts";
import { MapContext } from '../../components';
import { NpcContext } from "../NpcContextProvider";
import styles from "./SelectedItemPanel.module.scss";

// TODO: Przeniesc do bananos
export enum WalkingType {
    None = "None",
    Stroll = "Stroll",
    Patrol = "Patrol",
}

export const SelectedItemPanel = () => {
    const packageContext = useContext(PackageContext);
    const { activeNpcTemplate, setHighlightedNpcId, deleteNpc, updateNpc } = useContext(NpcContext);
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
                    flex: 1,
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
                <div className={styles['form-holder']}>
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="walkingType">Walking type</InputLabel>
                        <Select labelId="walkingType" value={activeNpc.walkingType} label="Slot" onChange={(e) => setActiveNpc({
                            ...activeNpc,
                            walkingType: e.target.value
                        })}>
                            {Object.values(WalkingType).map((key) => (
                                <MenuItem key={key} value={key}>
                                    {key}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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
                </div>
                <div className={styles['button-holder']}>
                    <Button variant="contained" onClick={() => {
                        updateNpc(activeNpc);
                        setActiveNpc(null);
                    }}>Update</Button>
                </div>
            </> : null}
        </div>
    </div>
}