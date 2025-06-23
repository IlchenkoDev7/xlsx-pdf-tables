import { Text, View } from '@react-pdf/renderer';
import { TableSchema } from '../types/TableSchema';
import { tableStyles } from './tableStyles';
import { renderHeader } from './renderers/renderHeader';
import { renderRows } from './renderers/renderRows';
import { DeepKeyOf } from '../types/DeepKeyOf';

export interface PdfTableProps<T extends {}> {
    tableSchema: TableSchema<T>[],
    tableData: T[],
    withNumberRows?: boolean,
    groupBy?: DeepKeyOf<T>,
    getGroupSummaryTitle?: (groupValue: any) => string,
    computeGroupSummary?: (groupRows: T[]) => T,
    headerHeight?: number
}

export const PdfTable = <T extends {}>({
    tableSchema,
    tableData,
    withNumberRows = true,
    getGroupSummaryTitle,
    groupBy,
    computeGroupSummary,
    headerHeight
}: PdfTableProps<T>) => {
    return (
        <View style={tableStyles.table}>
            {renderHeader(tableSchema, headerHeight)}
            {withNumberRows &&
                renderRows(
                    tableData,
                    tableSchema,
                    {
                        groupBy,
                        getGroupSummaryTitle,
                        computeGroupSummary
                    }
                )
            }
        </View>
    );
};