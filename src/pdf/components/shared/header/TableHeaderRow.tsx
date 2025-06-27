import { View } from "@react-pdf/renderer";
import { TableSchema } from "../../../../types/TableSchema";
import { Style } from "@react-pdf/types";
import { HeaderCell } from "../cells/HeaderCell";

export interface TableHeaderRowProps<T extends {}> {
    schemas: TableSchema<T>[];
    rowHeight?: string;
    headerCellStyle?: Style
    textStyle?: Style
}

const TableHeaderRow = <T extends {}>({
    schemas,
    rowHeight,
    headerCellStyle,
    textStyle
}: TableHeaderRowProps<T>) => {
    return (
        <View
            style={[
                { flexDirection: 'row' },
                rowHeight ? { height: rowHeight } : {},
            ]}
        >
            {schemas.map((schema, idx) => {
                if (!schema.children || schema.children.length === 0) {
                    return (
                        <HeaderCell
                            key={idx}
                            pdfPercent={schema.columnWidth?.pdfPercent}
                            label={schema.label}
                            headerCellStyle={headerCellStyle}
                            textStyle={textStyle}
                        />
                    );
                }

                return (
                    <View
                        key={idx}
                        style={{
                            flexDirection: "column",
                            width: `${schema.columnWidth?.pdfPercent}%`,
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <HeaderCell
                                pdfPercent={100}
                                label={schema.label}
                                headerCellStyle={headerCellStyle}
                                textStyle={textStyle}
                            />
                        </View>

                        <View style={{ flex: 1 }}>
                            <TableHeaderRow
                                schemas={schema.children}
                                rowHeight="100%"
                                headerCellStyle={headerCellStyle}
                                textStyle={textStyle}
                            />
                        </View>
                    </View>
                );
            })}
        </View>
    );
}

type HeaderProps<T extends {}> = {
    schemas: TableSchema<T>[];
    height?: number;
    headerCellStyle?: Style
    textStyle?: Style
};

export const TableHeader = <T extends {}>({
    schemas,
    height,
    headerCellStyle,
    textStyle,
}: HeaderProps<T>) => {
    return (
        <TableHeaderRow
            schemas={schemas}
            rowHeight={height !== undefined ? `${height}px` : undefined}
            headerCellStyle={headerCellStyle}
            textStyle={textStyle}
        />
    );
}
