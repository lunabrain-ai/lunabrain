import React, {FC, useState} from "react";
import {FormField, getDefaultFormFieldValue, GroupField, MapField, MsgField, RepeatedField} from "@/form/walk";
import "./styles.css";
import {useFieldArray, useWatch} from "react-hook-form";
import {getDefaultValue} from "@/util/proto";
import {FieldDescriptorProto_Type} from "@bufbuild/protobuf";
import { Control, useForm, UseFormRegister, UseFormResetField } from 'react-hook-form';
import {transformObject} from "@/util/form";

export type FormControl = {
    control: Control;
    register: UseFormRegister<any>;
    resetField: UseFormResetField<any>;
    setValue: (name: any, value: any) => void;
};

type FormControlProps = {
    fc: FormControl
}

export const Form: FC<{
    fields: FormField[],
    onSubmit: (data: any) => void,
}> = ({fields, onSubmit}) => {
    const fc = useForm({
        values: {} as any,
    });
    const path: string[] = [];

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
                                    <FieldDisplay fc={fc} field={f} path={[...path, f.name]} />
                                </div>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button className={"btn btn-primary"} onClick={(e) => {
                onSubmit(transformObject(fc.getValues()));
            }}>Submit</button>
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
        default:
            console.warn("Unhandled field type", field.field.type);
            return <input type={"text"} className={"input input-bordered"} value={value} {...register(fieldPath)} />;
    }
}

const MapField: FC<{field: MapField, path: string[]} & FormControlProps> = ({fc, path, field}) => {
    const {resetField} = fc;
    // TODO breadchris can maps have keys that aren't strings?
    const [entries, setEntries] = useState<[string, any][]>([]);
    return (
        <table>
            <tbody>
            {entries.map((e, idx) => {
                const valuePath = path.concat(e[0]);
                const key = e[0];
                return (
                    <tr className={"array_element"} key={path.concat(idx.toString()).join('.')}>
                        <td>
                            <button className="btn btn-error" onClick={() => {
                                resetField(valuePath.join('.'));
                                setEntries((entries) => {
                                    const newEntries = entries.slice();
                                    newEntries.splice(idx, 1);
                                    return newEntries;
                                });
                            }}>Remove</button>
                            <div className={"map_key"}>
                                <input type={"text"} className={"input input-bordered"} value={key} onChange={(e) => {
                                    resetField(valuePath.join('.'));
                                    setEntries((entries) => {
                                        const newEntries = entries.slice();
                                        newEntries[idx][0] = e.target.value;
                                        return newEntries;
                                    });
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
                        setEntries((entries) => [...entries, ['', {}]]);
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
