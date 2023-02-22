
import _ from "lodash";
import React, { FunctionComponent, useCallback, useEffect, useState } from "react";

export enum SchemaFieldType {
    Record = "record",
    Text = "text",
    Number = "number",
    Array = "array"
}

export type Schema = Record<string, PropertyDefinition>

export enum FormFieldConditions {
    Required = 'required',
    Number = 'number',
    Range = 'range'
}

interface RequiredCondition {
    type: FormFieldConditions.Required
}

interface NumberCondition {
    type: FormFieldConditions.Number
}

interface RangeCondition {
    type: FormFieldConditions.Range,
    min: number,
    max: number
}

type FormFieldCondition = RequiredCondition | NumberCondition | RangeCondition;

interface FormContextProps {
    schema: Schema;
}

interface PropertyDefinition {
    type: SchemaFieldType;
    conditions?: FormFieldCondition[];
    defaultValue?: any;
    schema?: Schema;
    displayFormat?: (value: any) => any;
    saveFormat?: (value: any) => any;
    newElement?: any;
}
interface FormContextApi {
    values: Record<string, any>;
    changeValue: (field: string, value: any) => void;
    errors: Record<string, string>;
    dirty: Record<string, boolean>;
    setFormDirty: () => void;
    resetForm: () => void;
    setFieldDirty: (fieldName: string) => void;
    schema: Schema;
    doesFieldExist: (fieldName: string) => boolean;
    getFieldValue: (fieldName: string) => any;
    appendElement: (fieldName: string) => void;
    removeElement: (fieldName: string) => void;
}

export const FormContext = React.createContext<FormContextApi>({} as FormContextApi);


const Validators: Record<FormFieldConditions, (value: string, conditionParameters: any) => string> = {
    [FormFieldConditions.Required]: (value: string) => {
        if (value == "") {
            return "This field is required";
        }
        return "";
    },
    [FormFieldConditions.Number]: (value: string) => {
        if (parseInt(value).toString() != value) {
            return "This value has to be a number"
        }
        return "";
    },
    [FormFieldConditions.Range]: (value: string, conditionParameters: RangeCondition) => {
        if (parseInt(value) < conditionParameters.min) {
            return "Provided value is to small.";
        }
        if (parseInt(value) > conditionParameters.max) {
            return "Provided value is to big";
        }

        return "";
    }
}

const ValueParsers: Partial<Record<SchemaFieldType, (value: string) => any>> = {
    [SchemaFieldType.Number]: (value: string) => {
        return parseInt(value);
    }
}

export const FormContextProvider: FunctionComponent<FormContextProps> = ({ children, schema }) => {
    const [values, setValues] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [dirty, setDirty] = useState({});

    useEffect(() => {
        const values = _.mapValues(schema, (item, key) => item.defaultValue ?? "");
        setValues(values);
        setErrors(recursiveValidation("", values));
    }, [schema]);

    const recursiveValidation = (path: string, obj: any) => {
        let errors: Record<string, string> = {};
        for (let prop in obj) {
            const currentPropPath = path.length > 0 ? path + "." + prop : prop;
            if (typeof obj[prop] === "object") {
                errors = { ...errors, ...recursiveValidation(currentPropPath, obj[prop]) };
            } else {
                const propertyDefintion = findPropertyDefinition(currentPropPath);
                errors[currentPropPath] = validateField(propertyDefintion, obj[prop])
            }
        }

        return errors;
    }

    const doesFieldExist = useCallback((fieldName: string) => {
        const path = fieldName.split('.');
        const lastProp = path.pop() ?? "";
        let current = values;

        path.forEach(pathPart => {
            current = current?.[pathPart] ? current[pathPart] : undefined;
        })

        return current.hasOwnProperty(lastProp);
    }, [schema, values]);

    const findPropertyDefinition = (field: string) => {
        const path = field.split(".");
        let current: any = schema;

        for (let i = 0; i < path.length; i++) {
            current = current[path[i]];
            if ((current.type == SchemaFieldType.Record || current.type === SchemaFieldType.Array) && !current.schema) {
                return current as PropertyDefinition;
            }

            if ((current.type == SchemaFieldType.Record || current.type === SchemaFieldType.Array) && current.schema) {
                i++;
                current = current.schema;
            }
        }

        return current as PropertyDefinition;
    }

    const validateField = useCallback((propertyDefintion: PropertyDefinition, value: string) => {
        return propertyDefintion.conditions?.map(condition => Validators[condition.type](value, condition)).find(text => text !== "") ?? ""
    }, []);

    const appendElement = useCallback((field: string) => {
        const propertyDefintion = findPropertyDefinition(field);
        const path = field.split(".");
        const prop = path.pop() ?? "";
        const toSave = _.cloneDeep(values);
        let current = toSave;

        path.forEach(pathPart => {
            current = current[pathPart];
        })

        if (propertyDefintion.type == SchemaFieldType.Array && propertyDefintion.newElement) {
            current[prop] = [...current[prop], _.cloneDeep(propertyDefintion.newElement)];
            setValues(toSave);
        }
    }, [values, findPropertyDefinition])


    const removeElement = useCallback((field: string) => {
        console.log(values);
        const path = field.split(".");
        const prop = path.pop() ?? "";
        const toSave = _.cloneDeep(values);
        let current = toSave;

        path.forEach(pathPart => {
            current = current[pathPart];
        });

        (current as []).splice(parseInt(prop), 1);
        setValues(toSave);
    }, [values])


    const saveFieldValue = useCallback((field: string, value: any) => {
        const path = field.split(".");
        const prop = path.pop() ?? "";
        const toSave = _.cloneDeep(values);
        let current = toSave;

        path.forEach(pathPart => {
            current = current[pathPart];
        })

        current[prop] = value;
        setValues(toSave);
    }, [values])

    const changeValue = useCallback((field: string, value: string) => {
        if (!doesFieldExist(field)) {
            console.warn(`Field: ${field} does not exist in the schema`);
            return;
        }

        const propertyDefintion = findPropertyDefinition(field);
        const error = validateField(propertyDefintion, value);

        if (error) {
            setErrors(prev => ({
                ...prev,
                [field]: error
            }))
        } else {
            setErrors(prev => _.pickBy(prev, (_, errorField) => errorField !== field))
        }

        let output = value;

        if (!error) {
            output = ValueParsers[propertyDefintion.type]?.(value) ?? value;

            if (propertyDefintion.saveFormat) {
                output = propertyDefintion.saveFormat(output);
            }
        }

        saveFieldValue(field, output);

        setDirty(prev => ({
            ...prev,
            [field]: true
        }))
    }, [schema, saveFieldValue, doesFieldExist]);


    const setFormDirty = useCallback(() => {
        setDirty(_.mapValues(errors, () => true));
    }, [schema, errors]);

    const resetForm = useCallback(() => {
        setValues({});
        setErrors({});
        setDirty({});
    }, []);

    const setFieldDirty = useCallback((fieldName: string) => {
        setDirty(prev => ({
            ...prev,
            [fieldName]: true
        }));
    }, []);

    const getFieldValue = useCallback((fieldName: string) => {
        const propertyDefintion = findPropertyDefinition(fieldName);
        const path = fieldName.split(".");
        let current = values;

        path.forEach(pathElement => {
            current = current[pathElement];
        })

        return propertyDefintion.displayFormat && !errors[fieldName] ? propertyDefintion.displayFormat(current) : current;
    }, [values, errors]);

    console.log(values);
    return <FormContext.Provider value={{
        values,
        changeValue,
        errors,
        dirty,
        setFormDirty,
        resetForm,
        appendElement,
        removeElement,
        setFieldDirty,
        schema,
        doesFieldExist,
        getFieldValue
    }}>
        {children}
    </FormContext.Provider>;
};
