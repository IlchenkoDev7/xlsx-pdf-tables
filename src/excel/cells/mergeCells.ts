import { Worksheet } from 'exceljs';

/**
 * Объединяет ячейки в таблице
 *
 * @param sheet - Лист Excel (из ExcelJS)
 * @param startRow - Номер начальной строки
 * @param startCol - Номер начальной колонки
 * @param endRow - Номер конечной строки
 * @param endCol - Номер конечной колонки
 */
export function mergeCells(sheet: Worksheet, startRow: number, startCol: number, endRow: number, endCol: number): void {
    sheet.mergeCells(startRow, startCol, endRow, endCol);
}