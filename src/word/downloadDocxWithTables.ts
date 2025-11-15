import { Document, Packer } from "docx";
import type { WordTableConfig, WordChild } from "./types";
import { wordListRenderer } from "./wordListRenderer";

export async function downloadDocxWithTables<T extends {}>(
    tables: WordTableConfig<T>[],
    fileName: string
) {
    const children: WordChild[] = [];

    tables.forEach((t) => {
        wordListRenderer(
            children,
            t.tableTitles,
            t.tableSchema,
            t.tableData,
            t.fontOptions
        );
    });

    const doc = new Document({
        sections: [
            {
                properties: {},
                children,
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.docx`;
    link.click();

    URL.revokeObjectURL(url);
}
