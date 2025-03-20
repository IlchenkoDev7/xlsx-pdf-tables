import { renderRow } from "./renderers/renderRows";
import { TableSchema } from "../types/TableSchema";

interface Props<T extends {}> {
    tableSchema: TableSchema<T>[]
    rowData: T
    withoutBorders?: boolean
}

export const PdfTableRow = <T extends {}>({ rowData, tableSchema, withoutBorders }: Props<T>) => (
    <>
        {renderRow(rowData, tableSchema, 0, withoutBorders)}
    </>
)