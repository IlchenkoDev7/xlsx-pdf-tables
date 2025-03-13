import { TableSchema } from "../../types/TableSchema";
import { extractParamsFromSchema } from "./extractParamsFromSchema";

export interface FlattenedRow {
    data: any[];       // Массив значений строки
    mergeKeys: string[]; // Ключи для объединения строк
    colors: string[];  // Цвета ячеек строки
}

/**
 * Преобразует вложенные данные в плоский массив с упорядоченными значениями и цветами
 *
 * @param input - Исходные данные с сервера
 * @param tableSchema - Схема заголовков таблицы
 * @param parentMergeKeys - Ключи объединения для родителя
 * @returns Плоский массив строк
 */
export function flattenData<T extends {}>(
    input: any[],
    tableSchema: TableSchema<T>[],
    parentMergeKeys: string[] = []
): FlattenedRow[] {
    const result: FlattenedRow[] = [];

    const keys = extractParamsFromSchema(tableSchema, 'key')
    const colorKeys = extractParamsFromSchema(tableSchema, 'colorKey')

    if (!Array.isArray(input)) return [];

    input.forEach((item, index) => {
        const { children, ...rest } = item;

        // Формируем значения строки
        const rowData = keys.map((key) => (key in rest ? rest[key] : null));

        // Формируем цвета строки
        const rowColors = colorKeys.map((colorKey) => (colorKey in rest ? rest[colorKey] : null))

        // Создаём ключи для объединения
        const mergeKeys = [...parentMergeKeys, `${index}`];

        if (children && children.length > 0) {
            // Обработка детей
            const childRows = flattenData(children, tableSchema, mergeKeys);

            // Добавляем данные родителя в первые строки детей
            childRows.forEach((child, childIndex) => {
                if (childIndex === 0) {
                    child.data = rowData.map((value, idx) => (value !== null ? value : child.data[idx]));
                    child.colors = rowColors.map((color, idx) => color || child.colors[idx]);
                }
            });

            result.push(...childRows);
        } else {
            // Если детей нет, добавляем строку
            result.push({
                data: rowData,
                mergeKeys,
                colors: rowColors,
            });
        }
    });

    return result;
}