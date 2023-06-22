import { Autocomplete, TextField, TextFieldProps } from "@mui/material";
import { chain } from "lodash";
import { FunctionComponent, useContext, useEffect, useState } from "react";
import { KeyBoardContext } from "../../contexts";
import { FormContext } from "../../contexts/FormContext";

import styles from "./FormSelectField.module.scss";

interface FormTextFieldProps {
    propName: string;
}

export const FormSelectField: FunctionComponent<FormTextFieldProps & TextFieldProps> = ({ propName, ...props }) => {
    const { getFieldValue, changeValue, errors, dirty, setFieldDirty, doesFieldExist, findPropertyDefinition } = useContext(FormContext);
    const keyBoardContext = useContext(KeyBoardContext);
    const [optionsMap, setOptionsMap] = useState<Record<string, string>>({});

    if (!doesFieldExist(propName)) {
        console.warn(`Field: ${propName} does not exist in the schema`);
    }

    const propertyDefintion = findPropertyDefinition(propName);

    useEffect(() => {
        setOptionsMap(chain(propertyDefintion.options).keyBy("value").mapValues("label").value());
    }, [propertyDefintion.options])

    if (!propertyDefintion.options) {
        console.warn(`Field: ${propName} does not have required options`);
    }

    return <div className={styles['select-holder']}>
        <Autocomplete
            disableClearable
            blurOnSelect
            value={getFieldValue(propName)}
            onChange={(_, newValue) => changeValue(propName, newValue)}
            getOptionLabel={option => optionsMap[option] ?? ""}
            options={propertyDefintion.options?.map(option => option.value) ?? []}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={propertyDefintion.label}
                    error={dirty[propName] && !!errors[propName]}
                    helperText={errors[propName]}
                />
            )}
            onFocus={() => keyBoardContext.addKeyHandler({ id: 'ChatBlockAll', matchRegex: '.*' })}
            onBlur={() => keyBoardContext.removeKeyHandler('ChatBlockAll')}


        />
    </div>
}