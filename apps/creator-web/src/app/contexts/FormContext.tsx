
import _ from "lodash";
import React, { FunctionComponent, useCallback, useEffect, useState } from "react";

export enum SchemaFieldType {
    Record = "record",
    Text = "text",
    Number = "number",
    Array = "array",
    Object = "object"
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
        if (value === "") {
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

    const recursiveUpdate = (path: string, obj: any, errors: Record<string, string>) => {
        let toSave: any = {};

        if (typeof obj === "object") {
            for (let prop in obj) {
                const currentPropPath = path.length > 0 ? path + "." + prop : prop;
                toSave[prop] = recursiveUpdate(currentPropPath, obj[prop], errors);
            }
        } else {
            const propertyDefintion = findPropertyDefinition(path);
            let value = obj;

            if (errors[path] !== "") {
                return value;
            }

            value = ValueParsers[propertyDefintion.type]?.(obj) ?? obj

            if (propertyDefintion.saveFormat) {
                value = propertyDefintion.saveFormat(value);
            }
            return value;
        }

        return toSave;
    }

    const recursiveValidation = (path: string, obj: any) => {
        let errors: Record<string, string> = {};
        if (typeof obj === "object") {
            for (let prop in obj) {
                const currentPropPath = path.length > 0 ? path + "." + prop : prop;
                errors = { ...errors, ...recursiveValidation(currentPropPath, obj[prop]) }
            }
        } else {
            const propertyDefintion = findPropertyDefinition(path);
            return { [path]: validateField(propertyDefintion, obj) }
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

            if (!current) {
                throw new Error("Cannot find property: " + path[i] + " in path: " + field)
            }

            if ((current.type == SchemaFieldType.Record || current.type === SchemaFieldType.Array) && !current.schema) {
                return current as PropertyDefinition;
            }

            if ((current.type == SchemaFieldType.Record || current.type === SchemaFieldType.Array) && current.schema) {
                i++;
                current = current.schema;
            }

            if (current.type == SchemaFieldType.Object && current.schema) {
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

        if (propertyDefintion.type == SchemaFieldType.Array && propertyDefintion.newElement !== undefined) {
            current[prop] = [...current[prop], _.cloneDeep(propertyDefintion.newElement)];
            setValues(toSave);
        }
    }, [values, findPropertyDefinition])


    const removeElement = useCallback((field: string) => {
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

        const errors = recursiveValidation(field, value);

        setErrors(prev => ({
            ...prev,
            ...errors
        }))

        const values = recursiveUpdate(field, value, errors);
        saveFieldValue(field, values);

        setDirty(prev => ({
            ...prev,
            ..._.mapValues(errors, () => true)
        }))
    }, [saveFieldValue, doesFieldExist]);


    const setFormDirty = useCallback(() => {
        setDirty(_.mapValues(errors, () => true));
    }, [schema, errors]);

    const resetForm = useCallback(() => {
        const values = _.mapValues(schema, (item, key) => item.defaultValue ?? "");

        //TODO: wartosci powinny pojsc przez parsery
        setValues(values);
        setErrors(recursiveValidation("", values));
        setDirty({});
    }, [schema]);

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

    useEffect(() => {
        resetForm();
    }, [resetForm]);

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
