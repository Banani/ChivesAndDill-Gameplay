
import _ from "lodash";
import React, { FunctionComponent, useCallback, useEffect, useState } from "react";

export enum SchemaFieldType {
    Record = "record",
    Text = "text",
    Number = "number",
    Array = "array",
    Object = "object",
    Select = "select"
}

export type Schema = Record<string, PropertyDefinition>

export enum FormFieldConditions {
    Required = 'required',
    Number = 'number',
    Range = 'range',
    PositiveNumber = "positiveNumber"
}

interface RequiredCondition {
    type: FormFieldConditions.Required
}

interface NumberCondition {
    type: FormFieldConditions.Number
}

interface PositiveNumberCondition {
    type: FormFieldConditions.PositiveNumber,
}

interface RangeCondition {
    type: FormFieldConditions.Range,
    min: number,
    max: number
}

type FormFieldCondition = RequiredCondition | NumberCondition | RangeCondition | PositiveNumberCondition;

interface FormContextProps {
    schema: Schema;
}

export interface SelectOption {
    label: string;
    value: string;
}

export interface PropertyDefinition {
    // TODO: ZMIENIC NA NOT OPTIONAL
    label?: string;
    type: SchemaFieldType;
    conditions?: FormFieldCondition[];
    defaultValue?: any;
    schema?: Schema;
    displayFormat?: (value: any) => any;
    saveFormat?: (value: any) => any;
    newElement?: any;
    options?: SelectOption[];
    prerequisite?: (values: Record<string, any>) => boolean;
    formFieldProps?: Record<string, number | string | boolean>
    hidden?: boolean;

    // typeChanger allows to change other fields of object when it is changed
    typeChanger?: Record<string, any>;
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
    appendElement: (fieldName: string, key?: string) => void;
    removeElement: (fieldName: string) => void;
    findPropertyDefinition: (fieldName: string) => PropertyDefinition;
    getValues: () => Record<string, string>;

    // Form is not ready, when it does not have its values set to initial state
    isFormReady: boolean;
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
    [FormFieldConditions.PositiveNumber]: (value: string) => {
        if (parseInt(value) < 0) {
            return "This values cannot be a negative number"
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
        return value != "" ? parseInt(value) : value;
    }
}

export const FormContextProvider: FunctionComponent<FormContextProps> = ({ children, schema }) => {
    const [values, setValues] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [dirty, setDirty] = useState({});
    const [isFormReady, setIsFormReady] = useState(false);

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

            if (!matchedPrerequisites(propertyDefintion, path)) {
                return value;
            }

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
            return { [path]: validateField(propertyDefintion, obj, path) }
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

        return current?.hasOwnProperty(lastProp);
    }, [schema, values]);

    const findPropertyDefinition = (field: string) => {
        const path = field.split(".");
        let current: any = schema;

        for (let i = 0; i < path.length; i++) {
            current = current[path[i]];

            if (!current) {
                throw new Error("Cannot find property: " + path[i] + " in path: " + field)
            }

            if ((current.type == SchemaFieldType.Record || current.type === SchemaFieldType.Array || current.type === SchemaFieldType.Object) &&
                (!current.schema || i === path.length - 1)) {
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

    const getFieldValue = useCallback((fieldName: string) => {
        const propertyDefintion = findPropertyDefinition(fieldName);
        const path = fieldName.split(".");
        let current = values;

        path.forEach(pathElement => {
            current = current[pathElement];
        })

        return (propertyDefintion.displayFormat && !errors[fieldName]) ? propertyDefintion.displayFormat(current) : current;
    }, [values, errors]);

    const matchedPrerequisites = useCallback((propertyDefintion: PropertyDefinition, path: string) => {
        if (!propertyDefintion.prerequisite) {
            return true
        }

        const dividedPath = path.split(".");
        dividedPath.pop();
        const parentPath = dividedPath.join(".");

        if (!parentPath) {
            return true;
        }

        const parentValue = getFieldValue(parentPath);
        return propertyDefintion.prerequisite(parentValue);
    }, [getFieldValue]);

    const validateField = useCallback((propertyDefintion: PropertyDefinition, value: string, path: string) => {
        if (!matchedPrerequisites(propertyDefintion, path)) {
            return "";
        }
        return propertyDefintion.conditions?.map(condition => Validators[condition.type](value, condition)).find(text => text !== "") ?? ""
    }, [values, matchedPrerequisites]);

    const appendElement = useCallback((field: string, key?: string) => {
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

        if (propertyDefintion.type == SchemaFieldType.Record && propertyDefintion.newElement !== undefined && key != undefined) {
            current[prop][key] = propertyDefintion.newElement;
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

        if (Array.isArray(current)) {
            current.splice(parseInt(prop), 1);
        } else {
            delete current[prop];
        }

        setValues(toSave);
    }, [values])


    const saveFieldValue = useCallback((field: string, value: any) => {
        const propertyDefintion = findPropertyDefinition(field);
        const path = field.split(".");
        let prop = path.pop() ?? "";
        const toSave = _.cloneDeep(values);
        let current = toSave;
        let valueToSet = value;

        // During type changing, parent should be modified, not the field
        if (propertyDefintion.typeChanger) {
            if (!propertyDefintion.typeChanger[value]) {
                console.error("Type: " + value + " does not contain its definition in the typeChanger");
            }

            const pathToElement = path.join('.');
            setDirty(prev => _.mapValues(prev, (val, key: string) => key.indexOf(pathToElement) === -1 ? val : ""));

            prop = path.pop() ?? "";
            valueToSet = propertyDefintion.typeChanger[value]

            path.forEach(pathPart => {
                current = current[pathPart];
            })

            if (prop !== "") {
                current = current[prop];
            }

            for (let i in valueToSet) {
                if (current[i] === undefined) {
                    current[i] = valueToSet[i]
                }
                current['type'] = valueToSet.type;
            }

            for (let i in current) {
                if (valueToSet[i] === undefined) {
                    delete current[i];
                }
            }
        } else {
            path.forEach(pathPart => {
                current = current[pathPart];
            })

            current[prop] = valueToSet;
        }

        setValues(toSave);
    }, [values, setDirty])

    const changeValue = useCallback((field: string, value: string) => {
        if (!doesFieldExist(field)) {
            console.warn(`Field: ${field} does not exist in the schema`);
            return;
        }

        const values = recursiveUpdate(field, value, errors);
        saveFieldValue(field, values);

        setDirty(prev => ({
            ...prev,
            [field]: true
        }))
    }, [saveFieldValue, doesFieldExist, errors]);


    const setFormDirty = useCallback(() => {
        setDirty(_.mapValues(errors, () => true));
    }, [schema, errors]);

    const resetForm = useCallback(() => {
        let values = _.mapValues(schema, item => item.defaultValue ?? "");
        values = _.pickBy(values, (_, key) => schema[key].prerequisite === undefined || schema[key]?.prerequisite?.(values));

        //TODO: wartosci powinny pojsc przez parsery
        setValues(values);
        setDirty({});
    }, [schema]);

    const setFieldDirty = useCallback((fieldName: string) => {
        setDirty(prev => ({
            ...prev,
            [fieldName]: true
        }));
    }, []);

    useEffect(() => {
        setIsFormReady(true);
        resetForm();
    }, [resetForm]);

    // this is called because dependend field might not have error anymore, and it should be cleared
    useEffect(() => {
        const err = recursiveValidation("", values)
        setErrors(err);
    }, [values]);


    const getRecursiveValues = useCallback((values, path) => {
        const output: Record<string, any> = {};

        _.forEach(values, (value, key) => {
            const currentPath = path.length > 0 ? path + "." + key : key;
            const propertyDefintion = findPropertyDefinition(currentPath);
            if (!matchedPrerequisites(propertyDefintion, currentPath)) {
                return;
            }

            if (typeof value === "object") {
                output[key] = getRecursiveValues(value, currentPath);
            } else {
                output[key] = value;
            }
        })

        return output;
    }, [findPropertyDefinition, matchedPrerequisites]);

    const getValues = useCallback(() => {
        return getRecursiveValues(values, "");
    }, [values, getRecursiveValues]);

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
        getFieldValue,
        findPropertyDefinition,
        getValues,
        isFormReady
    }}>
        {children}
    </FormContext.Provider>;
};
