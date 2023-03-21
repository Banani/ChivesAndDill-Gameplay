import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Button, IconButton } from "@mui/material";
import _, { map } from "lodash";
import React, { FunctionComponent, useCallback, useContext } from "react";
import { FormContext, PropertyDefinition, Schema, SchemaFieldType } from "../../contexts/FormContext";
import { FormSelectField } from '../formSelectField';
import { FormTextField } from "../formTextField";
import { Label } from "../label";

import styles from "./FormBuilder.module.scss";

interface FormBuilderProps {
    schema: Schema;
}

export const FormBuilder: FunctionComponent<FormBuilderProps> = ({ schema }) => {
    const { getFieldValue, removeElement, appendElement, values } = useContext(FormContext);

    const generateId = useCallback((key: string) => {
        const highestId = Math.max(0, ...(Object.keys(getFieldValue(key)).map((n: string) => parseInt(n))));
        return (highestId + 1).toString();
    }, [getFieldValue]);

    const fieldBuilders: Record<SchemaFieldType, (field: PropertyDefinition, fieldName: string, value: any) => any> = {
        [SchemaFieldType.Text]: (_, fieldName) => <FormTextField key={fieldName} propName={fieldName} />,
        [SchemaFieldType.Number]: (_, fieldName) => <FormTextField key={fieldName} propName={fieldName} />,
        [SchemaFieldType.Select]: (_, fieldName) => <FormSelectField key={fieldName} propName={fieldName} />,
        [SchemaFieldType.Array]: () => <>TO BE IMPLEMENTED</>,
        [SchemaFieldType.Object]: (propertyDefinition, fieldName, object) => <React.Fragment key={fieldName}>{_.chain(propertyDefinition.schema)
            .pickBy((field) => field.hidden !== true && field.prerequisite?.(object) !== false)
            .map((childPropertyDefinition, childFieldName) =>
                fieldBuilders[childPropertyDefinition.type](
                    childPropertyDefinition,
                    fieldName + "." + childFieldName,
                    object[childFieldName]
                )
            ).value()}</React.Fragment>,
        [SchemaFieldType.Record]: (propertyDefinition, fieldName, record) => (<React.Fragment key={fieldName}>
            {map(record, (child, key) => {
                return (<React.Fragment key={fieldName + "." + key}>
                    <div className={styles['element-header']}>
                        <Label>{propertyDefinition.label}: {key}</Label>
                        <IconButton
                            onClick={() => removeElement(fieldName + "." + key)}
                        >
                            <DeleteForeverIcon />
                        </IconButton >
                    </div>
                    <hr className={styles['line']} />
                    <div className={styles['child-wrapper']}>
                        {_.chain(propertyDefinition.schema)
                            .pickBy((field) => field.hidden !== true && field.prerequisite?.(record[key]) !== false)
                            .map((childPropertyDefinition, childFieldName) =>
                                fieldBuilders[childPropertyDefinition.type](
                                    childPropertyDefinition,
                                    fieldName + "." + key + "." + childFieldName,
                                    record[key][childFieldName]
                                )
                            ).value()}
                    </div>
                </React.Fragment>)
            })}
            <div className={styles['creation-button-holder']}>
                <Button variant="outlined" onClick={() => appendElement(fieldName, generateId(fieldName))}>Add {propertyDefinition.label}</Button>
            </div>
        </React.Fragment>),
    }

    if (!Object.keys(values).length) {
        return <></>;
    }

    return <>
        {_.chain(schema)
            .pickBy((field, fieldName) => field.hidden !== true && field.prerequisite?.(getFieldValue(fieldName)) !== false)
            .map((field, fieldName) => fieldBuilders[field.type](field, fieldName, getFieldValue(fieldName)))
            .value()}
    </>
}