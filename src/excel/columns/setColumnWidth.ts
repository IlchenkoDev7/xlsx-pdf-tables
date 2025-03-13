import { Worksheet } from "exceljs";
import { TableSchema } from "../../types/TableSchema";
import { setAutoWidth } from "./setAutoWidth";

const extractWidths = <T extends {}>(headers: TableSchema<T>[], columnWidths: (number | undefined)[] = []): void => {
    headers.forEach((header) => {
        const width = header.columnWidth?.excelWidth ?? undefined;
        if (header.key || width !== undefined) {
            columnWidths.push(width);
        }
        if (header.children) {
            extractWidths(header.children, columnWidths);
        }
    });
};

export const setColumnWidth = <T extends {}>(worksheet: Worksheet, tableHeaders: TableSchema<T>[], startRowForHeaders: number) => {

    const columnWidths: (number | undefined)[] = [];
    extractWidths(tableHeaders, columnWidths);

    worksheet.columns.forEach((column, index) => {
        const width = columnWidths[index];

        if (width) {
            column.width = width;
        } else {
            setAutoWidth(column, startRowForHeaders)
        }
    });
}