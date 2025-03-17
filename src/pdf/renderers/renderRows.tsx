import { JSX } from "react";
import { TableSchema } from "../../types/TableSchema";
import { View } from "@react-pdf/renderer";
import { tableStyles } from "../tableStyles";
import ContentCell from "../components/content-cell/ContentCell";

export const renderRows = <T extends {}>(data: T[], schemas: TableSchema<T>[]): JSX.Element[] => (
    data.map((row, rowIndex) => (
        <View key={rowIndex} style={tableStyles.tableRow}>
            {schemas.map((schema, colIndex) => {
                if (!schema.children) {
                    return (
                        <ContentCell
                            key={colIndex}
                            row={row}
                            dataKey={schema.key}
                            pdfPercent={schema.columnWidth.pdfPercent}
                            alignItems={schema.columnCellsHorizontalAlign?.pdf}
                        />
                    );
                } else {
                    return (
                        <View
                            key={colIndex}
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                width: `${schema.columnWidth.pdfPercent}%`
                            }}
                        >
                            {renderRows([row], schema.children)}
                        </View>
                    );
                }
            })}
        </View>
    ))
);