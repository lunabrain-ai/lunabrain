import { DescriptorProto, FieldDescriptorProto, OneofDescriptorProto, EnumDescriptorProto } from "@bufbuild/protobuf";

type Callbacks = {
    onField: (field: FieldDescriptorProto, path: string[]) => void;
    onOneof: (oneof: OneofDescriptorProto, fields: FieldDescriptorProto[], path: string[]) => void;
    onNestedType: (nestedType: DescriptorProto, path: string[]) => void;
    onEnumType: (enumType: EnumDescriptorProto, path: string[]) => void;
};

export function walkDescriptor(
    desc: DescriptorProto,
    path: string[] = [],
    callbacks: Callbacks
) {
    // Handle fields
    desc.field.forEach(field => {
        if (field.oneofIndex !== undefined) {
            // Handle oneof fields later
            return;
        }
        callbacks.onField(field, path);
    });

    // Handle oneof
    desc.oneofDecl.forEach((oneof, index) => {
        const oneofFields = desc.field.filter(f => f.oneofIndex === index);
        callbacks.onOneof(oneof, oneofFields, path);
    });

    // Handle nested types
    desc.nestedType.forEach(nestedType => {
        const nestedPath = [...path, nestedType.name || 'unknown'];
        callbacks.onNestedType(nestedType, nestedPath);
        walkDescriptor(nestedType, nestedPath, callbacks); // Recursive call for nested types
    });

    // Handle enum types
    desc.enumType.forEach(enumType => {
        callbacks.onEnumType(enumType, path);
    });
}

// Usage example
export const callbacks: Callbacks = {
    onField: (field, path) => {
        console.log('Field:', path.join('.'), field);
        // Build HTML form field
    },
    onOneof: (oneof, fields, path) => {
        console.log('Oneof:', path.join('.'), oneof, fields);
        // Build HTML form for oneof
    },
    onNestedType: (nestedType, path) => {
        console.log('Nested Type:', path.join('.'), nestedType);
        // Handle nested type
    },
    onEnumType: (enumType, path) => {
        console.log('Enum Type:', path.join('.'), enumType);
        // Handle enum type
    }
};
