import { FormControl, InputLabel, MenuItem, Select, TextFieldProps } from "@mui/material";
import { FunctionComponent, useContext } from "react";
import { FormContext } from "../../contexts/FormContext";

interface FormTextFieldProps {
    propName: string;
}

export const FormSelectField: FunctionComponent<FormTextFieldProps & TextFieldProps> = ({ propName, ...props }) => {
    const { getFieldValue, changeValue, errors, dirty, setFieldDirty, doesFieldExist, findPropertyDefinition } = useContext(FormContext);

    if (!doesFieldExist(propName)) {
        console.warn(`Field: ${propName} does not exist in the schema`);
    }

    const propertyDefintion = findPropertyDefinition(propName);

    if (!propertyDefintion.options) {
        console.warn(`Field: ${propName} does not have required options`);
    }

    return <FormControl fullWidth margin="dense">
        <InputLabel id={propName}>{propertyDefintion.label}</InputLabel>
        <Select
            onBlur={() => setFieldDirty(propName)}
            labelId={propName}
            value={getFieldValue(propName)}
            label={propertyDefintion.label}
            onChange={(e) => changeValue(propName, e.target.value)}
            error={dirty[propName] && !!errors[propName]}
        >
            {propertyDefintion.options?.map(option => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
        </Select>
    </FormControl>
}