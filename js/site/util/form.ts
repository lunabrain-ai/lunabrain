export function cleanObject(obj: any): any {
    // Check if the object is actually an object or an array
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    // Process arrays
    if (Array.isArray(obj)) {
        return obj.map(item => cleanObject(item)).filter(item => !(typeof item === 'object' && !Array.isArray(item) && Object.keys(item).length === 0));
    }

    // Process objects
    const result: { [key: string]: any } = {};
    for (const [key, value] of Object.entries(obj)) {
        const transformedValue = cleanObject(value); // Recursive call for nested objects
        if (transformedValue === '' || transformedValue === undefined || typeof transformedValue === 'object' && !Array.isArray(transformedValue) && Object.keys(transformedValue).length === 0) {
            // Skip if the transformed value is an empty object
        } else {
            result[key] = transformedValue;
        }
    }

    return result;
}
