import {
    DescriptorProto,
    FieldDescriptorProto,
    OneofDescriptorProto,
    FieldList, FieldDescriptorProto_Label, FieldDescriptorProto_Type
} from "@bufbuild/protobuf";
import {GRPCTypeInfo} from "@/rpc/content/content_pb";
import {notEmpty} from "@/util/predicates";
import {getDefaultValue, typeLookup} from "@/util/proto";
import {snakeToCamel} from "@/util/text";

export type BaseField = {
    type: string;
    name: string;
    fieldType: string|undefined;
}

export type RepeatedField = {
    type: 'repeated';
    field: FieldDescriptorProto;
    repeatedField: FormField;
} & BaseField;

export type MsgField = {
    type: 'msg';
    field: FieldDescriptorProto;
} & BaseField;

export type MapField = {
    type: 'map';
    field: FieldDescriptorProto;
    key: FormField;
    value: FormField;
} & BaseField;

export type GroupField = {
    type: 'group';
    field: OneofDescriptorProto;
    children: FormField[];
    isOneOf: boolean;
} & BaseField;

export type FormField = MsgField | GroupField | MapField | RepeatedField;

export const getDefaultFormFieldValue = (field: FormField): any => {
    switch (field.type) {
        case 'msg':
            return getDefaultValue(field.field);
        case 'group':
            return {};
        case 'map':
            return {};
        case 'repeated':
            return [];
    }
}

export function walkDescriptor<T>(
    typeInfo: GRPCTypeInfo,
    desc: DescriptorProto,
): FormField[] {
    const handleField = (f: FieldDescriptorProto): FormField => {
        const name = snakeToCamel(f.name || 'unknown');
        const type = f.type && typeLookup[f.type];
        const isRepeated = f.label === FieldDescriptorProto_Label.REPEATED;

        const wrapRepeated = (field: FormField): FormField => {
            if (isRepeated) {
                return {
                    type: 'repeated',
                    name: name,
                    fieldType: type,
                    field: f,
                    repeatedField: field,
                };
            }
            return field;
        }

        // TODO breadchris handle enum
        // TODO breadchris handle recursive types

        if (f.typeName === undefined) {
            return wrapRepeated({
                type: 'msg',
                field: f,
                name: name,
                fieldType: type,
            });
        }
        const tn = f.typeName.substring(1);
        const fieldType = typeInfo.descLookup[tn];
        if (fieldType === undefined) {
            throw new Error(`Unknown type ${tn}`);
        }

        if (fieldType.options?.mapEntry) {
            const children = walkDescriptor(typeInfo, fieldType);
            if (children.length !== 2) {
                throw new Error(`Map entry ${tn} has ${children.length} children`);
            }
            return {
                type: 'map',
                field: f,
                name: name,
                key: children[0],
                value: children[1],
                fieldType: type,
            };
        }

        return wrapRepeated({
            type: 'group',
            field: f,
            name: name,
            children: walkDescriptor(typeInfo, fieldType),
            fieldType: type,
            isOneOf: false,
        });
    }

    const fields: FormField[] = desc.field
        .filter(f => f.oneofIndex === undefined)
        .map(handleField);

    const oneOfs: FormField[] = desc.oneofDecl.map((oneof, index) => {
        const groupFields = desc.field
            .filter(f => f.oneofIndex === index)
            .flatMap(handleField)
            .filter(notEmpty);
        const name = snakeToCamel(oneof.name || 'unknown');
        return {
            type: 'group',
            name: name,
            field: oneof,
            children: groupFields,
            fieldType: undefined,
            isOneOf: true,
        };
    });
    return [...fields, ...oneOfs];
}
