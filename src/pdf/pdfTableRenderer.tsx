import * as React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { TableSchema } from '../types/TableSchema';
import { flattenSchema } from './flattenSchema';
import { distributeColumnWidths } from './distributeColumnWidths';
import { resolveNestedValue } from '../utils/resolveNestedValue';
import { tableStyles } from './tableStyles';
import { JSX } from 'react';

export const pdfTableRenderer = <T extends {}>(
    tableSchema: TableSchema<T>[],
    tableData: T[],
    withNumberRows: boolean = true
) => {
    distributeColumnWidths(tableSchema);

    const flattenedSchema = flattenSchema(tableSchema);

    const renderHeader = (schemas: TableSchema<T>[], level: number = 0, isLastRow: boolean = false): JSX.Element => (
        <View style={tableStyles.tableRow}>
            {schemas.map((schema, index) => {
                const isLastColumn = index === schemas.length - 1;
                return (
                    <View
                        key={index}
                        style={{
                            ...tableStyles.tableCol,
                            width: schema.columnWidth ? `${schema.columnWidth.pdfPercent}%` : 'auto',
                            flexGrow: schema.colspan || 1,
                            borderTopWidth: level > 0 ? 1 : 0,
                            borderBottomWidth: !schema.children ? 1 : 0,
                            borderRightWidth: isLastColumn ? 0 : 1,
                        }}
                    >
                        <View style={tableStyles.tableHeader}>
                            <Text>{schema.label}</Text>
                        </View>
                        {schema.children && renderHeader(schema.children, level + 1, isLastRow)}
                    </View>
                );
            })}
        </View>
    );

    const renderRows = (data: T[], schemas: TableSchema<T>[]): JSX.Element[] => (
        data.map((row, rowIndex, array) => {
            return <View key={rowIndex} style={tableStyles.tableRow}>
                {schemas.map((schema, colIndex) => {
                    const isLastColumn = colIndex === schemas.length - 1;
                    return <View
                        key={colIndex}
                        style={{
                            ...tableStyles.tableCol,
                            width: schema.columnWidth ? `${schema.columnWidth.pdfPercent}%` : 'auto',
                            flexGrow: schema.colspan || 1,
                            alignItems: schema.columnCellsHorizontalAlign || "left" as any,
                            justifyContent: schema.columnCellsVerticalAlign || "top" as any,
                            borderRightWidth: isLastColumn ? 0 : 1,
                            borderBottomWidth: rowIndex + 1 === array.length ? 0 : 1,
                        }}
                    >
                        <View style={tableStyles.tableCell}>
                            <Text>{schema.key ? String(resolveNestedValue(row, schema.key)) : ''}</Text>
                        </View>
                    </View>
                })}
            </View>
        })
    );

    return (
        <View style={tableStyles.table}>
            {renderHeader(tableSchema)}
            {withNumberRows && renderRows(tableData, flattenedSchema)}
        </View>
    );
};
