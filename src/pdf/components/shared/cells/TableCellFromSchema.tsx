import { JSX } from "react";
import { TableSchema } from "../../../../types/TableSchema";
import { View } from "@react-pdf/renderer";
import ContentCell, { ContentCellProps } from "./ContentCell";

type TableCellFromSchemaProps<T extends {}> =
    Pick<ContentCellProps<T>, 'row' | 'cellStyle' | 'textStyle' | 'borders'> & {
        schema: TableSchema<T>
    }

export const TableCellFromSchema = <T extends {}>({
    row,
    schema,
    cellStyle,
    textStyle,
    borders,
}: TableCellFromSchemaProps<T>): JSX.Element => {
    if (!schema.columnWidth?.pdfPercent) throw new Error('Pdf percent is missing')

    if (!schema.children) {
        return (
            <ContentCell
                row={row}
                dataKey={schema.key as string}
                pdfPercent={schema.columnWidth.pdfPercent}
                alignItems={schema.columnCellsHorizontalAlign?.pdf}
                pdfRender={schema.pdfRender}
                cellStyle={cellStyle}
                textStyle={textStyle}
                borders={borders}
            />
        );
    }

    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                width: `${schema.columnWidth.pdfPercent}%`,
            }}
        >
            {schema.children.map((child, i) => (
                <TableCellFromSchema
                    key={i}
                    row={row}
                    schema={child}
                    cellStyle={cellStyle}
                    textStyle={textStyle}
                    borders={borders}
                />
            ))}
        </View>
    );
}
