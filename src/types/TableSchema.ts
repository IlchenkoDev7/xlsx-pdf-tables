import { AlignItemsExcel, AlignItemsPdf } from "./AlignItems";
import { DeepKeyOf } from "./DeepKeyOf";

export interface TableSchema<T> {
    label: string;
    key?: Extract<DeepKeyOf<T>, string>;
    colspan?: number;
    rowspan?: number;
    children?: TableSchema<T>[];
    columnWidth?: { pdfPercent?: number, excelWidth?: number };
    columnCellsVerticalAlign?: "middle" | "top" | "bottom" | "distributed" | "justify" | undefined;
    columnCellsHorizontalAlign?: {
        pdf?: AlignItemsPdf,
        excel?: AlignItemsExcel
    }
    colorKey?: keyof T;
}