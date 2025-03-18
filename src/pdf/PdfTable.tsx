import { View } from '@react-pdf/renderer';
import { TableSchema } from '../types/TableSchema';
import { tableStyles } from './tableStyles';
import { renderHeader } from './renderers/renderHeader';
import { renderRows } from './renderers/renderRows';

export interface PdfTableProps<T extends {}> {
    tableSchema: TableSchema<T>[],
    tableData: T[],
    withNumberRows?: boolean
}

export const PdfTable = <T extends {}>({
    tableSchema,
    tableData,
    withNumberRows = true
}: PdfTableProps<T>) => {
    return (
        <View style={tableStyles.table}>
            {renderHeader(tableSchema)}
            {withNumberRows && renderRows(tableData, tableSchema)}
        </View>
    );
};