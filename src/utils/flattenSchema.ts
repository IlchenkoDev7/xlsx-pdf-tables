import { TableSchema } from "../types/TableSchema";

export const flattenSchema = <T,>(schemas: TableSchema<T>[], depth: number = 0): TableSchema<T>[] => {
    return schemas.reduce((acc, schema) => {
        if (schema.children && schema.children.length > 0) {
            return [...acc, ...flattenSchema(schema.children, depth + 1)];
        }
        return [...acc, schema];
    }, [] as TableSchema<T>[]);
};