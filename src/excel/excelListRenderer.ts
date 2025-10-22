import { Workbook } from "exceljs";
import { convertDataToArray } from "./data/convertDataToArray";
import { createNestedHeaders } from "./header/createNestedHeader";
import { generateDataRows } from "./rows/generateDataRows";
import { setColumnWidth } from "./columns/setColumnWidth";
import { TableTitle } from "./types/TableTitle";
import { setColumnAlignment } from "./columns/setColumnAlignment";
import { TableSchema } from "../types/TableSchema";
import { setTitles } from "./titles/setTitles";

type ExcelFontOptions = {
    headerFontSize?: number;
    contentFontSize?: number;
};

export const excelListRenderer = <T extends {}>(
    workbook: Workbook,
    listName: string,
    tableTitles: TableTitle[],
    tableSchema: TableSchema<T>[],
    tableData: T[],
    borderedContent?: boolean,
    opts?: ExcelFontOptions
): void => {
    const worksheet = workbook.addWorksheet(listName);

    setTitles(worksheet, tableTitles, tableSchema);

    const startRowForHeaders = tableTitles.length + 1;

    createNestedHeaders<T>(worksheet, tableSchema, startRowForHeaders, 1, opts);

    const data = convertDataToArray<T>(tableData, tableSchema);

    generateDataRows(data, worksheet, {
        borderedContent: borderedContent ?? true,
        contentFontSize: opts?.contentFontSize,
    });

    setColumnWidth(worksheet, tableSchema, startRowForHeaders);
    setColumnAlignment(worksheet, tableSchema, startRowForHeaders);
};
