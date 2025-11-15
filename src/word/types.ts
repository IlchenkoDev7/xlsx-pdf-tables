import { Paragraph, Table } from "docx";
import type { TableSchema } from "../types/TableSchema";
import type { TableTitle } from "../types/TableTitle";

export type WordFontOptions = {
    headerFontSize?: number;
    contentFontSize?: number;
};

type PageOrientation = "portrait" | "landscape";

export type WordOptions = WordFontOptions & {
    pageOrientation?: PageOrientation;
    pageWidthDxaOverride?: number;
};

export type WordTableConfig<T extends {}> = {
    tableTitles: TableTitle[];
    tableSchema: TableSchema<T>[];
    tableData: T[];
    borderedContent?: boolean;
    fontOptions?: WordFontOptions;
};

export type WordChild = Paragraph | Table;

export type InternalRowSpanMatrix = number[][];