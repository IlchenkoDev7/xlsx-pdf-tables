import type { Alignment, Worksheet } from "exceljs";
import { TableSchema } from "../../types/TableSchema";
import { extractParamsFromSchema } from "../data/extractParamsFromSchema";
import { isRowNotTitle } from "../rows/isRowNotTitle";

function getSchemaHorizontalAlign(v: unknown): Alignment['horizontal'] | undefined {
    if (!v) return undefined;
    if (typeof v === 'string') return v as Alignment['horizontal'];
    if (typeof v === 'object' && v !== null && 'excel' in (v as any) && typeof (v as any).excel === 'string') {
        return (v as any).excel as Alignment['horizontal'];
    }
    return undefined;
}

export const setColumnAlignment = <T extends {}>(
    worksheet: Worksheet,
    tableHeaders: TableSchema<T>[],
    startRowForHeaders: number
) => {
    const columnsHorizontalAlign = extractParamsFromSchema(tableHeaders, 'columnCellsHorizontalAlign');
    const columnsVerticalAlign = extractParamsFromSchema(tableHeaders, 'columnCellsVerticalAlign');

    worksheet.columns.forEach((column, index) => {
        const verticalFromSchema = columnsVerticalAlign[index] as Alignment['vertical'] | undefined;
        const horizontalFromSchema = getSchemaHorizontalAlign(columnsHorizontalAlign[index]);

        column.eachCell?.(cell => {
            if (!isRowNotTitle(cell, startRowForHeaders)) return;

            const existing = cell.alignment ?? {};

            cell.alignment = {
                wrapText: existing.wrapText ?? true,
                vertical: existing.vertical ?? verticalFromSchema ?? 'middle',
                horizontal: existing.horizontal ?? horizontalFromSchema ?? 'center',
            };
        });
    });
};
