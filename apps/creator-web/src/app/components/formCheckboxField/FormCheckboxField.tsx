import { Checkbox, FormControlLabel } from "@mui/material";
import { FunctionComponent, useContext, useMemo } from "react";
import { FormContext } from "../../contexts/FormContext";

interface FormCheckboxFieldProps {
    propName: string;
}

export const FormCheckboxField: FunctionComponent<FormCheckboxFieldProps> = ({ propName }) => {
    const { getFieldValue, changeValue, doesFieldExist, findPropertyDefinition } = useContext(FormContext);

    if (!doesFieldExist(propName)) {
        console.warn(`Field: ${propName} does not exist in the schema`);
    }

    const propertyDefinition = useMemo(() => findPropertyDefinition(propName), [propName]);
    const value = getFieldValue(propName);

    return <FormControlLabel
        control={<Checkbox
            checked={value}
            onChange={() => changeValue(propName, !value)}
        />}
        label={propertyDefinition.label}
    />

}