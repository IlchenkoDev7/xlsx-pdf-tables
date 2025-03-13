import { Worksheet } from "exceljs";
import { TableSchema } from "../../types/TableSchema";
import { extractParamsFromSchema } from "../data/extractParamsFromSchema";
import { isRowNotTitle } from "../rows/isRowNotTitle";

export const setColumnAlignment = <T extends {}>(worksheet: Worksheet, tableHeaders: TableSchema<T>[], startRowForHeaders: number) => {

    const columnsHorizontalAlign: any[] = extractParamsFromSchema(tableHeaders, 'columnCellsHorizontalAlign');

    const columnsVerticalAlign: any[] = extractParamsFromSchema(tableHeaders, 'columnCellsVerticalAlign');

    worksheet.columns.forEach((column, index) => {
        const vertical = columnsVerticalAlign[index];
        const horizontal = columnsHorizontalAlign[index]

        column.eachCell?.(cell => {
            if (isRowNotTitle(cell, startRowForHeaders)) {
                cell.alignment = {
                    wrapText: true,
                    vertical: vertical || 'middle',
                    horizontal: horizontal || 'center'
                }
            }
        });
    })
}