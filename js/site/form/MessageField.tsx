import {DescriptorProto, FieldDescriptorProto, FieldDescriptorProto_Label, FieldDescriptorProto_Type} from "@bufbuild/protobuf";
import React, {FC, useEffect, useState} from "react";
import {useFieldArray, useWatch} from "react-hook-form";
import {InputFormContents, InputFormContentsProps} from "@/form/InputFormContents";
import {GRPCInputFormProps} from "@/form/ProtobufMessageForm";
import { typeLookup } from "@/util/proto";

type GrpcFormField = {
    type: 'field'
    name: string
    field: FieldDescriptorProto
    fieldType: FieldDescriptorProto_Type | undefined
}

type GrpcFormOneof = {
    type: 'oneof'
    name: string
    fields: FieldDescriptorProto[]
    fieldType: FieldDescriptorProto_Type | undefined
}

export type ProtobufFormFieldType = GrpcFormField | GrpcFormOneof

interface GRPCInputFormContentsProps extends GRPCInputFormProps {
    field: ProtobufFormFieldType
    desc: DescriptorProto
}

export const MessageField: FC<GRPCInputFormContentsProps> = (props) => {
    const { field} = props;

    return (
        <div className="input_container two-of-2 three-of-3 two-of-4 one-of-5">
            <div className="field-content">
                {field.type === 'field' ? (
                    <FormattedMessageField grpcProps={props} baseFieldName={props.baseFieldName} field={field.field} />
                ) : (
                    <OneOfField grpcProps={props} field={field} />
                )}
            </div>
        </div>
    );
}

interface FormattedMessageFieldProps {
    grpcProps: GRPCInputFormProps
    baseFieldName: string|undefined
    field: FieldDescriptorProto
}

interface RepeatedFieldProps {
    fieldProps: FormattedMessageFieldProps
    inputFormProps: InputFormContentsProps
}

const RepeatedField: FC<RepeatedFieldProps> = (props) => {
    const { inputFormProps, fieldProps } = props;
    const { field, baseFieldName, grpcProps } = fieldProps;
    const { control, fieldPath } = grpcProps;

    const { fields: formFields, append, remove } = useFieldArray({
        control, name: baseFieldName || 'input',
    });

    return (
        <table>
            <tbody>
            {formFields.map((f, index) => (
                <tr className={"array_element"} key={f.id}>
                    <td>
                        <InputFormContents {...inputFormProps} index={index} />
                        <button className="btn btn-error" onClick={() => remove(index)}>Remove</button>
                    </td>
                </tr>
            ))}
            <tr>
                <td>
                    <button onClick={() => append({})}>New</button>
                </td>
            </tr>
            </tbody>
        </table>
    );
}

const FormattedMessageField: FC<FormattedMessageFieldProps> = (props) => {
    const { field, baseFieldName, grpcProps } = props;
    const { fieldPath } = grpcProps;

    const inputProps: InputFormContentsProps = {
        inputFormProps: {
            ...grpcProps,
            fieldPath: `${fieldPath}.${field.name}`,
            baseFieldName,
        },
        field,
    };

    if (field.label === FieldDescriptorProto_Label.REPEATED) {
        return <RepeatedField fieldProps={props} inputFormProps={inputProps} />;
    }
    return (<InputFormContents {...inputProps} />);
}

interface OneOfFieldProps {
    grpcProps: GRPCInputFormProps
    field: GrpcFormOneof
}

interface FormattedOneOfFieldProps {
    grpcProps: GRPCInputFormProps
    f: FieldDescriptorProto
    currentField: string|undefined
    fieldLookup: Record<string, FieldDescriptorProto>
    onChecked: () => void
    setCurrentField: (field: string|undefined) => void
}

const getFieldPath = (grpcProps: GRPCInputFormProps, f: FieldDescriptorProto) => {
    return `${grpcProps.parentFieldName}.${f.name}`;
}

const FormattedOneOfField: FC<FormattedOneOfFieldProps> = (props) => {
    const {
        f,
        onChecked,
        fieldLookup,
        grpcProps ,
        currentField,
        setCurrentField,
    } = props;
    const { control } = grpcProps;

    const fieldPath = getFieldPath(grpcProps, f);
    const fieldValue = useWatch({
        control,
        name: fieldPath,
    });

    useEffect(() => {
        // console.log(fieldValue, currentField)
        if (fieldValue !== undefined) {
            setCurrentField(f.name);
        }
    }, [fieldValue]);

    // console.log(fieldPath, fieldValue);

    return (
        <tr key={f.name}>
            <td className={"name"}>
                <strong>{f.name}</strong><br/>{f.type && typeLookup[f.type]}
            </td>
            <td>
                <input
                    type="radio"
                    value={f.name}
                    checked={currentField === f.name || fieldValue !== undefined}
                    onChange={onChecked}
                />
            </td>
            <td>
                {(currentField && currentField == f.name) ? (
                    <FormattedMessageField
                        grpcProps={grpcProps}
                        baseFieldName={`${grpcProps.parentFieldName}.${f.name}`}
                        field={fieldLookup[currentField]}
                    />
                ) : "unset"}
            </td>
        </tr>
    )
}

const OneOfField: FC<OneOfFieldProps> = (props) => {
    const [currentField, setCurrentField] = useState<string|undefined>('');
    const { field, grpcProps } = props;
    const { resetField, control } = grpcProps;

    if (!field.fields) {
        return null;
    }
    const fieldLookup = field.fields.reduce((acc, fd) => ({
        ...acc,
        [fd.name || '']: fd,
    }), {} as Record<string, FieldDescriptorProto>);
    const resetFields = (except: string|undefined) => {
        field.fields.forEach((f) => {
            resetField(getFieldPath(grpcProps, f));
        })
    }
    return (
        <div className="oneof">
            <table>
                <tbody>
                {field.fields.map((f) => (
                    <FormattedOneOfField
                        key={getFieldPath(grpcProps, f)}
                        onChecked={() => {
                            resetFields(f.name);
                            setCurrentField(f.name)
                        }}
                        grpcProps={grpcProps}
                        f={f}
                        currentField={currentField}
                        setCurrentField={setCurrentField}
                        fieldLookup={fieldLookup}
                    />
                ))}
                </tbody>
            </table>
        </div>
    );
}
