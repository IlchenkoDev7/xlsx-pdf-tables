import { TableSchema } from "../../types/TableSchema";

export const getColumnCount = <T extends {}>(tableSchema: TableSchema<T>[]) => {
    return tableSchema.reduce((count, header) => {
        const getLeafCount = (column: TableSchema<T>[]): number =>
            column.reduce((sum, h) => sum + (h.children ? getLeafCount(h.children) : 1), 0);

        return count + getLeafCount([header]);
    }, 0);
}