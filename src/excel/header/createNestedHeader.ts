import { Borders, Worksheet } from "exceljs";
import { TableSchema } from "../../types/TableSchema";

// Создание шапки таблицы
export const createNestedHeaders = <T extends {}>(
    worksheet: Worksheet, 
    headers: TableSchema<T>[], 
    startRow: number, 
    startCol: number
): void => {
    let currentRow = startRow;
    let currentCol = startCol;

    headers.forEach((header) => {
        const { label, colspan = 1, rowspan = 1, children } = header;

        const cell = worksheet.getCell(currentRow, currentCol);
        cell.value = label;
        cell.font = { bold: true };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };

        if (colspan > 1) {
            worksheet.mergeCells(currentRow, currentCol, currentRow, currentCol + colspan - 1);
        }

        if (rowspan > 1) {
            worksheet.mergeCells(currentRow, currentCol, currentRow + rowspan - 1, currentCol);
        }

        const border: Partial<Borders> = {
            top: { style: 'medium' },
            left: { style: 'medium' },
            bottom: { style: 'medium' },
            right: { style: 'medium' },
        };
        cell.border = border;

        if (children && children.length > 0) {
            createNestedHeaders(worksheet, children, currentRow + 1, currentCol);
        }

        currentCol += colspan;
    });
};