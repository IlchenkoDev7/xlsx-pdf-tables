import { JSX } from "react";
import { View } from "@react-pdf/renderer";
import { TableSchema } from "../../types/TableSchema";
import { tableStyles } from "../tableStyles";
import HeaderItem from "../components/HeaderItem";

const renderHeaderInternal = <T extends {}>(
    schemas: TableSchema<T>[],
    height?: string
): JSX.Element => (
    <View style={[
        tableStyles.tableRow,
        height ? { height } : {},
    ]}>
        {schemas.map((schema, idx) => {
            if (!schema.children || schema.children.length === 0) {
                return (
                    <HeaderItem
                        key={idx}
                        pdfPercent={schema.columnWidth?.pdfPercent}
                        label={schema.label}
                    />
                );
            }

            return (
                <View
                    key={idx}
                    style={{
                        flexDirection: 'column',
                        width: `${schema.columnWidth?.pdfPercent}%`,
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <HeaderItem pdfPercent={100} label={schema.label} />
                    </View>

                    <View style={{ flex: 1 }}>
                        {renderHeaderInternal(schema.children, '100%')}
                    </View>
                </View>
            );
        })}
    </View>
);

export const renderHeader = <T extends {}>(schemas: TableSchema<T>[], height?: number): JSX.Element =>
    renderHeaderInternal(schemas, `${height}px`);
