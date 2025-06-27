import { JSX } from 'react';
import { View } from '@react-pdf/renderer';
import { TableSchema } from '../../../../types/TableSchema';
import { CellConfig } from '../../../../types/CellConfig';
import ContentCell from '../cells/ContentCell';

type TableConfigurableRowProps<T extends object> = {
    schemas: TableSchema<T>[];
    cellConfigs: CellConfig[];
};

export const TableConfigurableRow = <T extends object>(
    props: TableConfigurableRowProps<T>,
) => {
    const { schemas, cellConfigs } = props;

    let leafIdx = 0;

    const renderNode = (schema: TableSchema<T>, path: number[]): JSX.Element => {
        if (!schema.columnWidth?.pdfPercent)
            throw new Error('Pdf percent is missing');

        const nodeKey = (schema as any).key ?? path.join('-');

        if (schema.children?.length) {
            return (
                <View
                    key={nodeKey}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: `${schema.columnWidth.pdfPercent}%`,
                    }}
                >
                    {schema.children.map((child, idx) =>
                        renderNode(child, [...path, idx]),
                    )}
                </View>
            );
        }

        const cfg = cellConfigs[leafIdx++];
        return (
            <ContentCell
                key={nodeKey}
                row={{}}
                dataKey=""
                pdfPercent={schema.columnWidth.pdfPercent}
                alignItems={cfg.alignItems}
                pdfRender={() => cfg.content}
                cellStyle={cfg.cellStyle}
                textStyle={cfg.textStyle}
                borders={cfg.borders}
            />
        );
    };

    return (
        <View style={{ flexDirection: 'row' }}>
            {schemas.map((schema, idx) => renderNode(schema, [idx]))}
        </View>
    );
};
