import React, {FC, useEffect, useMemo, useState} from "react";
import {
    FormField,
    getDefaultFormFieldValue,
    GroupField,
    MapField,
    MsgField,
    RepeatedField,
    walkDescriptor
} from "@/form/walk";
import "./styles.css";
import {
    Control,
    FieldValues,
    useFieldArray,
    useForm,
    UseFormRegister,
    UseFormResetField,
    useWatch
} from "react-hook-form";
import {FieldDescriptorProto_Type} from "@bufbuild/protobuf";
import {atom, createStore, Provider, useAtom} from "jotai";
import {Content, TypesResponse} from "@/rpc/content/content_pb";
import {contentService} from "@/service";
import {cleanObject} from "@/util/form";

export type FormControl = {
    control: Control;
    register: UseFormRegister<any>;
    resetField: UseFormResetField<any>;
    setValue: (name: any, value: any) => void;
    getValues: (name?: string | string[]) => FieldValues;
};

type FormControlProps = {
    fc: FormControl
}

export const formControlAtom = atom<FormControl|undefined>(undefined);
formControlAtom.debugLabel = "formControlAtom";

export const formTypesAtom = atom<TypesResponse|undefined>(undefined);
formTypesAtom.debugLabel = "formTypesAtom";

export const useProtoForm = () => {
    const [formTypes, setFormTypes] = useAtom(formTypesAtom);

    const loadFormTypes = async () => {
        const t = await contentService.types({});
        setFormTypes(t);
    }

    const fields = useMemo(() => {
        if (!formTypes || !formTypes.content?.msg) {
            return undefined;
        }
        return walkDescriptor(formTypes.content, formTypes.content.msg)
    }, [formTypes]);
    return {
        fields,
        loadFormTypes,
    }
}

export const Form: FC<{
    fields: FormField[],
}> = ({fields}) => {
    const [formControl] = useAtom(formControlAtom);

    if (formControl === undefined) {
        return null;
    }

    // TODO breadchris react hook form requires useValue to have a name, so we default to 'data' https://react-hook-form.com/docs/useform/setvalue
    const path: string[] = ['data'];

    return (
        <div className={"grpc-request-form"}>
            <table>
                <tbody>
                {fields.map((f) => (
                    <tr key={f.name} className={"message_field"}>
                        <td className={"name"}>
                            <strong>{f.name}</strong><br/>{f.fieldType}
                        </td>
                        <td>
                            <div className="input_container two-of-2 three-of-3 two-of-4 one-of-5">
                                <div className="field-content">
                                    <FieldDisplay fc={formControl} field={f} path={[...path, f.name]} />
                                </div>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

const FieldDisplay: FC<{field: FormField, path: string[]} & FormControlProps> = ({fc, path, field}) => {
    switch (field.type) {
        case 'repeated':
            return <RepeatedMsgFieldDisplay fc={fc} field={field} path={path} />;
        case 'msg':
            return (<FieldInput fc={fc} field={field} path={path} />);
        case 'map':
            return <MapField fc={fc} field={field} path={path} />;
        case 'group':
            return <GroupField fc={fc} field={field} path={path} />;
    }
}

const RepeatedMsgFieldDisplay: FC<{field: RepeatedField, path: string[]} & FormControlProps> = ({fc, path, field}) => {
    const {control} = fc;
    const repeatedField = field.repeatedField;
    const { fields, append, remove } = useFieldArray({
        control, name: path.join('.'),
    });
    return (
        <table>
            <tbody>
            {fields.map((f, idx) => {
                const arrayPath = path.concat(idx.toString());
                return (
                    <tr className={"array_element"} key={arrayPath.join('.')}>
                        <td>
                            <FieldDisplay fc={fc} field={repeatedField} path={arrayPath} />
                            <button className="btn btn-error" onClick={() => remove(idx)}>Remove</button>
                        </td>
                    </tr>
                )
            })}
            <tr>
                <td>
                    <button onClick={() => append(getDefaultFormFieldValue(repeatedField))}>New</button>
                </td>
            </tr>
            </tbody>
        </table>
    )
}

const FieldInput: FC<{field: MsgField, path: string[]} & FormControlProps> = ({field, path, fc}) => {
    const {control, register} = fc;
    const fieldPath = path.join('.');
    const fieldValue = useWatch({
        control,
        name: fieldPath,
        defaultValue: '',
    });
    const value = fieldValue || '';
    switch (field.field.type) {
        case FieldDescriptorProto_Type.STRING:
            return <input type={"text"} className={"input input-bordered"} value={value} {...register(fieldPath)} />;
        case FieldDescriptorProto_Type.BOOL:
            return <input type={"checkbox"} checked={value} {...register(fieldPath)} />;
        case FieldDescriptorProto_Type.INT32:
            return <input type={"number"} className={"input input-bordered"} value={value} {...register(fieldPath)} />;
        default:
            console.warn("Unhandled field type", field.field.type);
            return <input type={"text"} className={"input input-bordered"} value={value} {...register(fieldPath)} />;
    }
}

const MapField: FC<{field: MapField, path: string[]} & FormControlProps> = ({fc, path, field}) => {
    const {resetField, setValue} = fc;
    // TODO breadchris can maps have keys that aren't strings?
    const fieldPath = path.join('.');
    const fieldValue = useWatch({
        control: fc.control,
        name: fieldPath,
    }) || {};
    return (
        <table>
            <tbody>
            {Object.keys(fieldValue).filter((k) => fieldValue[k] !== undefined).map((key, idx) => {
                const valuePath = path.concat(key);
                return (
                    <tr className={"array_element"} key={path.concat(key.toString()).join('.')}>
                        <td>
                            <button className="btn btn-error" onClick={() => {
                                setValue(valuePath.join('.'), undefined);
                            }}>Remove</button>
                            <div className={"map_key"}>
                                <input type={"text"} className={"input input-bordered"} value={key} onChange={(e) => {
                                    resetField(valuePath.join('.'));

                                    const newKey = e.target.value;
                                    setValue(path.concat(newKey).join('.'), fieldValue);
                                }} />
                            </div>
                            {key !== '' && (
                                <div className={"map_value"}>
                                    <FieldDisplay fc={fc} field={field.value} path={valuePath} />
                                </div>
                            )}
                        </td>
                    </tr>
                )
            })}
            <tr>
                <td>
                    <button onClick={() => {
                        setValue(path.concat('key').join('.'), {});
                    }}>New</button>
                </td>
            </tr>
            </tbody>
        </table>
    );
}

const GroupField: FC<{field: GroupField, path: string[]} & FormControlProps> = ({field, path, fc}) => {
    const {resetField} = fc;
    const [visibleFields, setVisibleFields] = useState<string[]>([]);
    const resetFields = (except: string|undefined) => {
        field.children.forEach((f) => {
            resetField([...path, f.name].join('.'));
        })
    }
    const onSelect = (name: string) => {
        if (field.isOneOf) {
            setVisibleFields([name]);
            resetFields(name);
        } else {
            if (visibleFields.some((v) => v === name)) {
                setVisibleFields(vf => vf.filter((v) => v !== name));
            } else {
                setVisibleFields(vf => [...vf, name]);
            }
        }
    }
    const getChecked = (name: string) => {
        return visibleFields.some((v) => v === name);
    }
    return (
        <div className={"oneof"}>
            <table>
                <tbody>
                {field.children.map((f) => {
                    const childPath = field.isOneOf ? [...path.slice(0, -1), f.name] : [...path, f.name];
                    return <GroupChildField
                        key={childPath.join('.')}
                        onSelect={onSelect}
                        isOneOf={field.isOneOf}
                        checked={getChecked(f.name)}
                        path={childPath}
                        field={f}
                        fc={fc}
                    />
                })}
                </tbody>
            </table>
        </div>
    )
}

const GroupChildField: FC<{
    field: FormField,
    checked: boolean,
    path: string[],
    isOneOf: boolean,
    onSelect: (name: string) => void}
    & FormControlProps
> = ({field, path, isOneOf, checked, onSelect, fc}) => {
    const fieldPath = path.join('.');
    const fieldValue = useWatch({
        control: fc.control,
        name: fieldPath,
    });
    useEffect(() => {
        if (!checked && fieldValue !== undefined) {
            onSelect(field.name);
        }
    }, [fieldValue]);
    return (
        <tr>
            <td className={"name"}>
                <strong>{field.name}</strong><br/>{field.fieldType}
            </td>
            <td>
                <input
                    type={isOneOf ? "radio" : "checkbox"}
                    checked={checked}
                    onChange={() => onSelect(field.name)}
                />
            </td>
            <td>
                {checked ? (
                    <FieldDisplay field={field} fc={fc} path={path} />
                ) : "unset"}
            </td>
        </tr>
    )
}
