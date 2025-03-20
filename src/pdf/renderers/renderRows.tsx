import { JSX } from "react";
import { TableSchema } from "../../types/TableSchema";
import { View } from "@react-pdf/renderer";
import { tableStyles } from "../tableStyles";
import ContentCell from "../components/content-cell/ContentCell";

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
export const renderRows = <T extends {}>(
    data: T[],
    schemas: TableSchema<T>[]
): JSX.Element[] => (
    data.map((row, rowIndex) => renderRow(row, schemas, rowIndex))
);