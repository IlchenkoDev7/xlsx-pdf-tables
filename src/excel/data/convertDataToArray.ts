import { TableSchema } from "../../types/TableSchema";
import { extractParamsFromSchema } from "./extractParamsFromSchema";
import { flattenData, FlattenedRow } from "./flattenData";

/**
 * Преобразует данные в плоский массив строк для таблицы
 *
 * @param data - Исходные данные
 * @param schema - Заголовки таблицы
 * @returns Плоский массив строк
 */
export const convertDataToArray = <T extends {}>(
    data: T[],
    schema: TableSchema<T>[]
): FlattenedRow[] => {
    const keys = extractParamsFromSchema(schema, 'key');
    return flattenData(data, schema);
};