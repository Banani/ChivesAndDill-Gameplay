import { TextField, TextFieldProps } from "@mui/material";
import { FunctionComponent, useContext } from "react";
import { FormContext } from "../../contexts/FormContext";

interface FormTextFieldProps {
    propName: string;
}

export const FormTextField: FunctionComponent<FormTextFieldProps & TextFieldProps> = ({ propName, ...props }) => {
    const { getFieldValue, changeValue, errors, dirty, setFieldDirty, doesFieldExist } = useContext(FormContext);

    if (!doesFieldExist(propName)) {
        console.warn(`Field: ${propName} does not exist in the schema`);
    }

    return <TextField
        value={getFieldValue(propName)}
        onChange={(e) => changeValue(propName, e.target.value)}
        margin="dense"
        fullWidth
        variant="standard"
        onBlur={() => setFieldDirty(propName)}
        error={dirty[propName] && !!errors[propName]}
        helperText={errors[propName]}
        {...props}
    />
}