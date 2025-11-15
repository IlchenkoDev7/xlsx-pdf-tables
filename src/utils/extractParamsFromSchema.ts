import { TableSchema } from "../types/TableSchema";

export const extractParamsFromSchema = <T extends {}>(schema: TableSchema<T>[], schemaKey: keyof TableSchema<T>): any[] => {
    const paramValues: any[] = [];

    schema.forEach(column => {
        if (column.key) {
            paramValues.push(column[schemaKey]);
        }
        if (column.children) {
            paramValues.push(...extractParamsFromSchema(column.children, schemaKey));
        }
    });

    return paramValues;
}
