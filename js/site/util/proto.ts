import {FieldDescriptorProto_Type} from "@bufbuild/protobuf";

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
