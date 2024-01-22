import {FieldDescriptorProto_Type} from "@bufbuild/protobuf";
import {FieldDescriptorProto} from "@bufbuild/protobuf/dist/proxy";

function createLookup(enumObject: typeof FieldDescriptorProto_Type): { [key: number]: string } {
    const lookup: { [key: number]: string } = {};
    for (const name of Object.keys(enumObject)) {
        const value = enumObject[name as keyof typeof FieldDescriptorProto_Type];
        if (typeof value === 'number') {
            lookup[value] = name.toLowerCase();
        }
    }
    return lookup;
}
export const typeLookup = createLookup(FieldDescriptorProto_Type);

export const getDefaultValue = (f: FieldDescriptorProto): any => {
    if (f.defaultValue === undefined) {
        return '';
    }
    switch (f.type) {
        case FieldDescriptorProto_Type.STRING:
            return f.defaultValue;
        case FieldDescriptorProto_Type.BOOL:
            return f.defaultValue === 'true';
        case FieldDescriptorProto_Type.INT32:
        case FieldDescriptorProto_Type.SINT32:
        case FieldDescriptorProto_Type.SFIXED32:
        case FieldDescriptorProto_Type.UINT32:
        case FieldDescriptorProto_Type.FIXED32:
            return parseInt(f.defaultValue);
        case FieldDescriptorProto_Type.INT64:
        case FieldDescriptorProto_Type.SINT64:
        case FieldDescriptorProto_Type.SFIXED64:
        case FieldDescriptorProto_Type.UINT64:
        case FieldDescriptorProto_Type.FIXED64:
            return BigInt(f.defaultValue);
        case FieldDescriptorProto_Type.DOUBLE:
        case FieldDescriptorProto_Type.FLOAT:
            return parseFloat(f.defaultValue);
        default:
            return '';
    }
}
