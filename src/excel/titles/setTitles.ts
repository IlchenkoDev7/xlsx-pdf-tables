import { Worksheet } from "exceljs";
import { TableTitle } from "../../types/TableTitle";
import { getColumnCount } from "../columns/getColumnCount";
import { TableSchema } from "../../types/TableSchema";

export const setTitles = <T extends {}>(worksheet: Worksheet, tableTitles: TableTitle[], tableSchema: TableSchema<T>[]) => {
    const columnCount = getColumnCount(tableSchema)

    if (tableTitles.length > 0) {
        tableTitles.forEach((title, index) => {
            const rowNumber = index + 1;
            const cell = worksheet.getCell(rowNumber, 1);

            cell.value = title.label;
            cell.font = {
                size: 14,
                bold: title.bold
            }
            cell.alignment = { 
                horizontal: "center", 
                vertical: "middle", 
                wrapText: true 
            };

            worksheet.mergeCells(rowNumber, 1, rowNumber, columnCount);
        });
    }
}