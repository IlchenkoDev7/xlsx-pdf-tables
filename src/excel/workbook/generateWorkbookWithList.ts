import { Workbook } from "exceljs";
import { excelListRenderer } from "../excelListRenderer";
import { TableSchema } from "../../types/TableSchema";
import { TableTitle } from "../types/TableTitle";

type ExcelFontOptions = {
    headerFontSize?: number;
    contentFontSize?: number;
};

export const downloadWorkbookWithList = async <T extends {}>(
    headers: TableSchema<T>[],
    tableTitle: TableTitle[],
    fileName: string,
    data: T[],
    borderedContent?: boolean,
    opts?: ExcelFontOptions
) => {
    const workbook = new Workbook();

    excelListRenderer<T>(
        workbook,
        fileName,
        tableTitle,
        headers,
        data,
        borderedContent,
        opts
    );

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.xlsx`;
    link.click();

    URL.revokeObjectURL(url);
};
