import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridRenderCellParams } from "@mui/x-data-grid";
import _ from 'lodash';
import { FunctionComponent, useContext } from "react";
import { Label } from "../../../components";
import { MapContext } from '../../components';
import { CharacterContext } from '../../monsterPanel/CharacterContextProvider';
import styles from "./SelectedCharacterPanel.module.scss";

// TODO: Przeniesc do bananos
export enum WalkingType {
    None = "None",
    Stroll = "Stroll",
    Patrol = "Patrol",
}

interface SelectedCharacterProps {
    characters: Record<string, any>;
    templateIdFieldName: string;
}

export const SelectedCharacterPanel: FunctionComponent<SelectedCharacterProps> = ({ characters, templateIdFieldName }) => {
    const { activeCharacterTemplate, setHighlightedCharacterId, deleteCharacter, updateCharacter, activeCharacter, setActiveCharacter } = useContext(CharacterContext);
    const { centerAt } = useContext(MapContext);

    const matchedInstances = _
        .chain(characters)
        .pickBy(character => character[templateIdFieldName] === activeCharacterTemplate?.id)
        .map((character, key) => ({ ...character, id: key }))
        .value()

    return <div className={styles['panel']}>
        <Label>Active Template: {activeCharacterTemplate?.id ? <b>{activeCharacterTemplate.name}</b> : "-"}</Label>
        <div className={styles['npc-instances-list']}>
            <DataGrid
                componentsProps={{
                    row: {
                        onMouseEnter: (e: any) => setHighlightedCharacterId(e.currentTarget.dataset.id),
                        onMouseLeave: () => setHighlightedCharacterId(null)
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
                                onClick={() => deleteCharacter(row.id)}
                            />,
                        ];
                    },
                }]}
                density="compact"
                onSelectionModelChange={(a) => setActiveCharacter(a[0] ? characters[a[0]] : null)}
                autoPageSize
            />
        </div>
        <div className={styles['npc-edit-panel']}>
            {activeCharacter ? <>
                <div className={styles['form-holder']}>
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="walkingType">Walking type</InputLabel>
                        <Select labelId="walkingType" value={activeCharacter.walkingType} label="Slot" onChange={(e) => setActiveCharacter({
                            ...activeCharacter,
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
                        value={activeCharacter.time}
                        onChange={(e) => {
                            setActiveCharacter({
                                ...activeCharacter,
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
                        updateCharacter(activeCharacter);
                        setActiveCharacter(null);
                    }}>Update</Button>
                </div>
            </> : null}
        </div>
    </div>
}