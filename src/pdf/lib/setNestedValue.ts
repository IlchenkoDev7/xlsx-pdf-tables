export const setNestedValue = <T extends object>(
    obj: T,
    path: string,
    value: any
): T => {
    const keys = path.split(".");
    const lastKey = keys.pop();
    const nested = keys.reduce((acc: any, key) => {
        if (!acc[key]) acc[key] = {};
        return acc[key];
    }, obj);

    if (lastKey) nested[lastKey] = value;
    return obj;
};