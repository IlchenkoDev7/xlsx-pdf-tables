import { JSX } from "react";
import { TableSchema } from "../../types/TableSchema";
import { View } from "@react-pdf/renderer";
import { tableStyles } from "../tableStyles";
import ContentCell from "../components/content-cell/ContentCell";
import { DeepKeyOf } from "../../types/DeepKeyOf";
import { resolveNestedValue } from "../../utils/resolveNestedValue";

const renderCell = <T extends {}>(
    row: T,
    schema: TableSchema<T>,
    colIndex: number,
    withoutBorders: boolean = false
): JSX.Element => {
    if (!schema.children) {
        return (
            <ContentCell
                key={colIndex}
                row={row}
                dataKey={schema.key}
                pdfPercent={schema.columnWidth.pdfPercent}
                alignItems={schema.columnCellsHorizontalAlign?.pdf}
                withoutBorders={withoutBorders}
                pdfRender={schema.pdfRender}
            />
        );
    } else {
        return (
            <View
                key={colIndex}
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: `${schema.columnWidth.pdfPercent}%`
                }}
            >
                {schema.children.map((childSchema, childIndex) =>
                    renderCell(row, childSchema, childIndex, withoutBorders)
                )}
            </View>
        );
    }
};

/**
 * Функция для генерации одной строки таблицы.
 * @param row - Данные строки.
 * @param schemas - Схема таблицы.
 * @param rowIndex - Индекс строки.
 * @param withoutBorders - Наличие рамок у ячеек текущей строки.
 * @returns Элемент строки таблицы.
 */
export const renderRow = <T extends {}>(
    row: T,
    schemas: TableSchema<T>[],
    rowIndex: number,
    withoutBorders: boolean = false
): JSX.Element => (
    <View key={rowIndex} style={tableStyles.tableRow}>
        {schemas.map((schema, colIndex) =>
            renderCell(row, schema, colIndex, withoutBorders)
        )}
    </View>
);

/**
 * Функция для генерации всех строк таблицы.
 * @param data - Данные таблицы.
 * @param schemas - Схема таблицы.
 * @returns Массив элементов строк таблицы.
 */
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

export const renderRows = <T extends {}>(
    data: T[],
    schemas: TableSchema<T>[],
    options?: {
        groupBy?: DeepKeyOf<T>;
        getGroupSummaryTitle?: (groupValue: any) => string;
        computeGroupSummary?: (groupRows: T[]) => Partial<T>;
    }
): JSX.Element[] => {
    const { groupBy, getGroupSummaryTitle, computeGroupSummary } = options || {};

    if (!groupBy || !getGroupSummaryTitle || !computeGroupSummary) {
        return data.map((row, rowIndex) => renderRow(row, schemas, rowIndex));
    }

    const groups = data.reduce((acc, row) => {
        const groupValue = resolveNestedValue(row, groupBy);
        const key = String(groupValue);
        if (!acc[key]) acc[key] = [];
        acc[key].push(row);
        return acc;
    }, {} as Record<string, T[]>);

    const result: JSX.Element[] = [];
    let rowIndex = 0;

    Object.entries(groups).forEach(([groupKey, groupRows]) => {
        groupRows.forEach((row) => {
            result.push(renderRow(row, schemas, rowIndex++));
        });

        const summaryRow = computeGroupSummary(groupRows);
        const firstColumnKey = schemas[0].key;

        let rowWithTitle = summaryRow as T;

        if (firstColumnKey) {
            rowWithTitle = setNestedValue(
                { ...(summaryRow as T) },
                firstColumnKey,
                getGroupSummaryTitle(groupKey)
            );
        }

        result.push(renderRow(rowWithTitle, schemas, rowIndex++));
    });

    return result;
};
