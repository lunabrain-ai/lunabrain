import {
    FieldDescriptorProto,
} from "@bufbuild/protobuf";
import React, {FC} from "react";
import {Control, UseFormRegister} from "react-hook-form";
import {GRPCTypeInfo} from "@/rpc/content/content_pb";
import {MessageField, ProtobufFormFieldType} from "@/form/MessageField";
import "./styles.css";
import {UseFormResetField} from "react-hook-form/dist/types/form";
import {typeLookup} from "@/util/proto";

export interface GRPCInputFormProps {
    grpcInfo: GRPCTypeInfo
    register: UseFormRegister<any>
    control: Control
    fieldPath: string
    baseFieldName?: string
    parentFieldName?: string
    setValue: (name: any, value: any) => void
    resetField: UseFormResetField<any>
}

export const ProtobufMessageForm: FC<GRPCInputFormProps> = (props) => {
    const {
        grpcInfo,
    } = props;

    const { msg: desc } = grpcInfo;
    if (!desc) {
        return null;
    }

    const formattedFields: ProtobufFormFieldType[] = [];
    desc.field.forEach((field: FieldDescriptorProto) => {
        if (field.oneofIndex !== undefined) {
            const oneofType = desc.oneofDecl[field.oneofIndex]
            const existingOneof = formattedFields.find((f) => f.type === 'oneof' && f.name === oneofType.name);
            if (!existingOneof) {
                formattedFields.push({
                    type: 'oneof',
                    name: oneofType.name || 'unknown',
                    fields: [field],
                    fieldType: field.type,
                })
            } else {
                if (existingOneof.type === 'oneof') {
                    existingOneof.fields.push(field);
                }
            }
        } else {
            formattedFields.push({
                type: 'field',
                name: field.name || 'unknown',
                field,
                fieldType: field.type,
            });
        }
    });
    return (
        <div className={"grpc-request-form"}>
            <table>
                <tbody>
                    {/*<tr>*/}
                    {/*    <th>{desc.name}</th>*/}
                    {/*</tr>*/}
                    {formattedFields.map((f) => {
                        // TODO breadchris hidden fields should be controlled by props
                        if (f.name === 'content') {
                            return null;
                        }
                        return (
                            <tr key={f.name} className={"message_field"}>
                                <td className={"name"}>
                                    <strong>{f.name}</strong><br/>{f.fieldType && typeLookup[f.fieldType]}
                                </td>
                                {/*<td className={"toggle_prescence"}>*/}
                                {/*    <input type={"checkbox"} />*/}
                                {/*</td>*/}
                                <td>
                                    <MessageField {...props} parentFieldName={props.baseFieldName} baseFieldName={`${props.baseFieldName}.${f.name}`} field={f} desc={desc} />
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
