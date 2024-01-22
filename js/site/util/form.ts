import {string} from "slate";

export function transformObject(obj: any): any {
    // Check if the object is actually an object or an array
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    // Process arrays
    if (Array.isArray(obj)) {
        if (obj.every(item => item.hasOwnProperty('key') && item.hasOwnProperty('value'))) {
            const newObj: { [key: string]: any } = {};
            obj.forEach((item: { key: string; value: any }) => {
                const transformedValue = transformObject(item.value); // Recursive call for nested objects
                if (transformedValue === '' || typeof transformedValue === 'object' && !Array.isArray(transformedValue) && Object.keys(transformedValue).length === 0) {
                    // Skip if the transformed value is an empty object
                } else {
                    newObj[item.key] = transformedValue;
                }
            });
            return newObj;
        } else {
            return obj.map(item => transformObject(item)).filter(item => !(typeof item === 'object' && !Array.isArray(item) && Object.keys(item).length === 0));
        }
    }

    // Process objects
    const result: { [key: string]: any } = {};
    for (const [key, value] of Object.entries(obj)) {
        const transformedValue = transformObject(value); // Recursive call for nested objects
        if (transformedValue === '' || typeof transformedValue === 'object' && !Array.isArray(transformedValue) && Object.keys(transformedValue).length === 0) {
            // Skip if the transformed value is an empty object
        } else {
            result[key] = transformedValue;
        }
    }

    return result;
}
