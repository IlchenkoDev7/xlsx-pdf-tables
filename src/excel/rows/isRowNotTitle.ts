import { Cell } from "exceljs"

export const isRowNotTitle = (cell: Cell, startRowForHeaders: number) => {
    return parseInt(cell.row) > startRowForHeaders - 1
}