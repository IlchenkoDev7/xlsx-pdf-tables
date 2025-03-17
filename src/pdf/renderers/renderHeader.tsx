import { JSX } from "react";
import { TableSchema } from "../../types/TableSchema";
import { View } from "@react-pdf/renderer";
import { tableStyles } from "../tableStyles";
import HeaderItem from "../components/HeaderItem";

export const renderHeader = <T extends {}>(schemas: TableSchema<T>[]): JSX.Element => (
    <View style={tableStyles.tableRow}>
        {schemas.map((schema, idx) => {
            if (!schema.children) {
                return (
                    <HeaderItem
                        key={idx}
                        pdfPercent={schema.columnWidth?.pdfPercent}
                        label={schema.label}
                    />
                );
            } else {
                return (
                    <View
                        key={idx}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: `${schema.columnWidth?.pdfPercent}%`
                        }}
                    >
                        <HeaderItem
                            pdfPercent={100}
                            label={schema.label}
                        />
                        {renderHeader(schema.children)}
                    </View>
                );
            }
        })}
    </View>
);