import React, { JSX } from "react";
import { TableSchema } from "../../../types/TableSchema";
import { DeepKeyOf } from "../../../types/DeepKeyOf";
import { resolveNestedValue } from "../../../utils/resolveNestedValue";
import { setNestedValue } from "../../lib/setNestedValue";
import { Style } from "@react-pdf/types";
import { TableRowFromSchema } from "../shared";

type GroupByFn<T> = (row: T) => string | number | boolean | null | undefined;

export interface GroupLevel<T> {
    groupBy?: DeepKeyOf<T>;
    groupByFn?: GroupByFn<T>;
    getGroupSummaryTitle?: (groupValue: unknown) => string;
    computeGroupSummary?: (groupRows: T[]) => Partial<T>;
}

export type GroupOptions<T> = GroupLevel<T>[] | GroupLevel<T> | undefined;

export const TableDataRowsFromSchema = <T extends object>({
    data,
    schemas,
    groupOptions,
    cellsStyle,
    textStyle
}: {
    data: T[];
    schemas: TableSchema<T>[];
    groupOptions?: GroupOptions<T>;
    cellsStyle?: Style;
    textStyle?: Style;
}) => {
    const levels: GroupLevel<T>[] = groupOptions
        ? Array.isArray(groupOptions)
            ? groupOptions
            : [groupOptions]
        : [];

    const buildRows = (
        rows: T[],
        levelIdx: number,
        path: string[]
    ): JSX.Element[] => {
        if (levelIdx >= levels.length) {
            return rows.map((row, rowIdx) => (
                <TableRowFromSchema
                    key={path.join("::") + `::row-${rowIdx}`}
                    row={row}
                    schemas={schemas}
                    textStyles={textStyle}
                    cellsStyles={cellsStyle}
                />
            ));
        }

        const {
            groupBy,
            groupByFn,
            getGroupSummaryTitle,
            computeGroupSummary
        } = levels[levelIdx];

        const selector: GroupByFn<T> =
            groupByFn ??
            ((r: T) => (groupBy ? resolveNestedValue(r, groupBy) : undefined));

        const grouped = rows.reduce<Record<string, T[]>>((acc, r) => {
            const value = selector(r);
            const key = String(value);
            if (!acc[key]) acc[key] = [];
            acc[key].push(r);
            return acc;
        }, {});

        const out: JSX.Element[] = [];

        Object.entries(grouped).forEach(([groupKey, groupedRows]) => {
            const nextPath = [...path, groupKey];

            out.push(...buildRows(groupedRows, levelIdx + 1, nextPath));

            if (computeGroupSummary) {
                const summary = computeGroupSummary(groupedRows);
                const firstSchemaKey = schemas[0]?.key;

                let summaryRow: T = summary as T;

                if (firstSchemaKey && getGroupSummaryTitle) {
                    summaryRow = setNestedValue(
                        { ...(summary as T) },
                        firstSchemaKey,
                        getGroupSummaryTitle(selector(groupedRows[0]) ?? groupKey)
                    );
                }

                out.push(
                    <TableRowFromSchema
                        key={nextPath.join("::") + "::summary"}
                        row={summaryRow}
                        schemas={schemas}
                        textStyles={textStyle}
                        cellsStyles={cellsStyle}
                    />
                );
            }
        });

        return out;
    };

    return <>{buildRows(data, 0, ["root"])}</>;
};
