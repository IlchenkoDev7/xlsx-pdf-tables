import { Column } from "exceljs";
import { isRowNotTitle } from "../rows/isRowNotTitle";

export const setAutoWidth = (column: Partial<Column>, startRowForHeaders: number) => {
    let maxLength = 0;

    if (column.eachCell) {
        column.eachCell({ includeEmpty: true }, (cell) => {
            if (isRowNotTitle(cell, startRowForHeaders)) {
                const columnLength = cell.value ? cell.value.toString().length : 10;
                if (columnLength > maxLength) {
                    maxLength = columnLength;
                }
            }
        });
    }

    column.width = maxLength < 10 ? 10 : maxLength + 2;
}