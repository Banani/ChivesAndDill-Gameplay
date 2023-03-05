import { QuotesEvents } from '@bananos/types';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import _ from 'lodash';
import React, { FunctionComponent, useContext } from 'react';
import { FormTextField, Label } from "../../../components";
import { FormContext } from '../../../contexts/FormContext';

import styles from "./CharacterQuotes.module.scss";

const labelMapper: Record<keyof QuotesEvents, string> = {
    'standard': "Standard quotes used outside of combat",
    'onDying': 'When the character dies',
    "onKilling": "When the character kills something",
    'onPulling': 'When the character starts a fight'
}


export const CharacterQuotes: FunctionComponent = () => {
    const { getFieldValue, changeValue, appendElement, removeElement } = useContext(FormContext);

    return < div className={styles['panel-wrapper']}>
        {_.map(getFieldValue("quotesEvents"), (quoteEvent, key) => (
            <React.Fragment key={key}>
                <div className={styles['element-header']}>
                    <Label>{labelMapper[key as keyof QuotesEvents]}:</Label>
                    <IconButton
                        onClick={() => {
                            appendElement(`quotesEvents.${key}.quotes`)
                        }}
                    >
                        <AddIcon />
                    </IconButton >
                </div>

                <FormTextField propName={`quotesEvents.${key}.chance`} label="Chance to show (0 - 100)" />

                <div className={styles['data-grid-wrapper']}>
                    <DataGrid
                        experimentalFeatures={{ newEditingApi: true }}
                        rows={
                            _.chain(quoteEvent?.quotes)
                                .map((text, key) => ({
                                    id: key,
                                    text
                                }))
                                .value()
                        }
                        columns={[{
                            field: 'text',
                            flex: 1,
                            headerName: 'Text',
                            editable: true,
                        }, {
                            field: 'actions',
                            headerName: 'Actions',
                            type: 'actions',
                            width: 80,
                            getActions: ({ id }) => {
                                return [
                                    <GridActionsCellItem
                                        label="Delete"
                                        icon={<DeleteIcon />}
                                        onClick={() => {
                                            removeElement(`quotesEvents.${key}.quotes.${id}`)
                                        }}
                                    />,
                                ];
                            },
                        }]}
                        processRowUpdate={(newRow) => {
                            changeValue(`quotesEvents.${key}.quotes.${newRow.id}`, newRow.text);
                            return newRow
                        }}
                        density="compact"
                        autoPageSize
                    />
                </div>
            </React.Fragment>
        ))}
    </div>
}