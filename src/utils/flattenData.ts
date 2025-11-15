import { Alignment } from "exceljs";
import { TableSchema } from "../types/TableSchema";
import { extractParamsFromSchema } from "./extractParamsFromSchema";

export interface MergeEx {
    from: number;
    to: number;
    align?: 'horizontal' | 'vertical' | 'wrapText';
    bold?: boolean;
}

export interface FlattenedRow {
    data: unknown[];
    mergeKeys: string[];
    colors: (string | null)[];
    hMerge?: Array<[number, number]>;
    hMergeEx?: MergeEx[];
    rowBold?: boolean;
}

/**
 * Преобразует вложенные данные в плоский массив с упорядоченными значениями и цветами
 *
 * @param input - Исходные данные с сервера
 * @param tableSchema - Схема заголовков таблицы
 * @param parentMergeKeys - Ключи объединения для родителя
 * @returns Плоский массив строк
 */
// flattenData.ts (логика)
export function flattenData<T extends {}>(
    input: any[],
    tableSchema: TableSchema<T>[],
    parentMergeKeys: string[] = []
): FlattenedRow[] {
    const result: FlattenedRow[] = [];
    const keys = extractParamsFromSchema(tableSchema, 'key');
    const colorKeys = extractParamsFromSchema(tableSchema, 'colorKey');

    if (!Array.isArray(input)) return [];

    input.forEach((item, index) => {
        const { children, ...rest } = item;

        const selfHMerge: Array<[number, number]> | undefined =
            Array.isArray(item.__hMerge) ? item.__hMerge :
                (Array.isArray(item.hMerge) ? item.hMerge : undefined);

        const selfHMergeEx = Array.isArray(item.__hMergeEx) ? item.__hMergeEx :
            (Array.isArray(item.hMergeEx) ? item.hMergeEx : undefined);

        const rowBold = Boolean(item.__bold || item.bold || item.__isSummary);

        const rowData = keys.map((key) => (key in rest ? rest[key] : null));
        const rowColors = colorKeys.map((ck) => (ck in rest ? rest[ck] : null));
        const mergeKeys = [...parentMergeKeys, `${index}`];

        if (children && children.length > 0) {
            const childRows = flattenData(children, tableSchema, mergeKeys);
            childRows.forEach((child, childIndex) => {
                if (childIndex === 0) {
                    child.data = rowData.map((v, i) => (v !== null ? v : child.data[i]));
                    child.colors = rowColors.map((c, i) => c || child.colors[i]);
                    if (selfHMerge && selfHMerge.length && !child.hMerge) child.hMerge = selfHMerge;
                    if (selfHMergeEx && selfHMergeEx.length && !child.hMergeEx) child.hMergeEx = selfHMergeEx;
                    if (rowBold && child.rowBold !== true) child.rowBold = true;
                }
            });
            result.push(...childRows);
        } else {
            result.push({
                data: rowData,
                mergeKeys,
                colors: rowColors,
                hMerge: selfHMerge,
                hMergeEx: selfHMergeEx,
                rowBold,
            });
        }
    });

    return result;
}
