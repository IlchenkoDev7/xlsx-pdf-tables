import { AlignItemsPdf } from "./AlignItems";
import { Style } from "@react-pdf/types";
import { BorderSpec } from "./BorderSpec";

export interface CellConfig {
    content: string | React.JSX.Element;
    alignItems?: AlignItemsPdf;
    withoutBorders?: boolean;
    cellStyle?: Style;
    textStyle?: Style;
    borders?: BorderSpec
}
