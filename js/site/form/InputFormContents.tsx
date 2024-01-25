import {FieldDescriptorProto, FieldDescriptorProto_Type} from "@bufbuild/protobuf";
import React, {FC} from "react";
import {useWatch} from "react-hook-form";
import {GRPCInputFormProps, ProtobufMessageForm} from "@/form/ProtobufMessageForm";
import { GRPCTypeInfo } from "@/rpc/content/content_pb";
import {snakeToCamel} from "@/util/text";

const getFieldName = (baseFieldName: string | undefined, field: FieldDescriptorProto, idx?: number): string => {
    if (!baseFieldName) {
        return snakeToCamel(field.name || '');
    }
    if (idx !== undefined) {
        return `${snakeToCamel(baseFieldName)}.${idx}`;
    }
    return `${snakeToCamel(baseFieldName)}`;
}

export interface InputFormContentsProps {
    inputFormProps: GRPCInputFormProps
    field: FieldDescriptorProto
    index?: number
}

export const InputFormContents: FC<InputFormContentsProps> = (props) => {
    const {
        inputFormProps,
        field,
        index,
    } = props;
    const {
        grpcInfo,
        baseFieldName,
        register,
        control,
        fieldPath,
        parentFieldName,
    } = inputFormProps;
    const { enumLookup, descLookup } = grpcInfo;

    const fieldFormName = getFieldName(baseFieldName, field, index);
    const fieldValue = useWatch({
        control,
        name: fieldFormName,
        defaultValue: '',
    });

    if (field.typeName) {
        // field.typeName == .name.othername, remove the leading dot
        const typeName = field.typeName.substring(1);
        const fieldType = descLookup[typeName];
        if (fieldType) {
            return (
                <ProtobufMessageForm
                    {...inputFormProps}
                    grpcInfo={new GRPCTypeInfo({
                        ...grpcInfo,
                        msg: fieldType,
                    })}
                    parentFieldName={parentFieldName}
                    baseFieldName={fieldFormName}
                    fieldPath={`${fieldPath}.${field.name}`}
                />
            )
        }
    }
    if (field.type === FieldDescriptorProto_Type.ENUM) {
        if (!field.typeName) {
            throw new Error("Enum field has no type name");
        }
        const enumTypeName = `${fieldPath}.${field.name}`;
        const enumType = enumLookup[enumTypeName];
        console.log(enumLookup, enumTypeName, enumType)
        if (!enumType) {
            throw new Error(`Enum type ${fieldPath}.${field.name} not found in ${Object.keys(enumLookup)}`);
        }

        return (
            <>
                <label htmlFor={field.name}>{field.name}</label>
                <select id={field.name}>
                    {enumType.value.map((e) => (
                        <option key={e.name} value={e.name}>{e.name}</option>
                    ))}
                </select>
            </>
        )
    }
    if (field.type === FieldDescriptorProto_Type.STRING) {
        return (
            <div key={field.number}>
                <input aria-label={"field-input"} value={fieldValue} {...register(fieldFormName)} />
            </div>
        )
    }
    if (field.type === FieldDescriptorProto_Type.BOOL) {
        return (
            <div key={field.number}>
                <input aria-label={"field-input"} type={"checkbox"} checked={fieldValue} {...register(fieldFormName)} />
            </div>
        )
    }
    return (
        <div key={field.number}>
            <input aria-label={"field-input"} value={fieldValue} {...register(fieldFormName)} />
        </div>
    )
}

