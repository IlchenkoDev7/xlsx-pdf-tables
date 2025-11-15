import { JSX } from "react";
import { AlignItemsExcel, AlignItemsPdf, AlignItemsWord } from "./AlignItems";
import { DeepKeyOf } from "./DeepKeyOf";

export interface TableSchema<T> {
    label: string;
    key?: Extract<DeepKeyOf<T>, string>;
    colspan?: number;
    rowspan?: number;
    children?: TableSchema<T>[];
    columnWidth?: {
        pdfPercent?: number;
        excelWidth?: number;
        wordDxWidth?: number;
        wordPercent?: number;
    };
    columnCellsVerticalAlign?: "middle" | "top" | "bottom" | "distributed" | "justify" | undefined;
    columnCellsHorizontalAlign?: {
        pdf?: AlignItemsPdf,
        excel?: AlignItemsExcel
        word?: AlignItemsWord;
    }
    colorKey?: keyof T;
    pdfRender?: (value: any, row: T) => string | JSX.Element;
}