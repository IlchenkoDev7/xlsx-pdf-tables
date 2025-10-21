import { Borders, Worksheet } from "exceljs";
import { TableSchema } from "../../types/TableSchema";

type HeaderOptions = {
    borderedContent?: boolean;
    headerBottomRow?: number;
};

function getMaxDepth<T>(headers: TableSchema<T>[]): number {
    let max = 0;
    for (const h of headers) {
        const childDepth = h.children && h.children.length > 0 ? getMaxDepth(h.children) + 1 : (h.rowspan ?? 1);
        if (childDepth > max) max = childDepth;
    }
    return Math.max(max, 1);
}

// Создание шапки таблицы
export const createNestedHeaders = <T extends {}>(
    worksheet: Worksheet,
    headers: TableSchema<T>[],
    startRow: number,
    startCol: number,
    opts: HeaderOptions = {}
): void => {
    const borderedContent = opts.borderedContent ?? true;

    const headerBottomRow =
        opts.headerBottomRow ??
        (startRow + getMaxDepth(headers) - 1);

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

        const cellBottomRow = currentRow + (rowspan - 1);

        const bottomStyle: NonNullable<Borders['bottom']>['style'] =
            (!borderedContent && cellBottomRow === headerBottomRow) ? 'double' : 'medium';

        const border: Partial<Borders> = {
            top: { style: 'medium' },
            left: { style: 'medium' },
            bottom: { style: bottomStyle },
            right: { style: 'medium' },
        };
        cell.border = border;

        if (children && children.length > 0) {
            createNestedHeaders(worksheet, children, currentRow + 1, currentCol, {
                borderedContent,
                headerBottomRow,
            });
        }

        currentCol += colspan;
    });
};