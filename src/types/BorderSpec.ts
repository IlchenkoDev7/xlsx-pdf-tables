export type BorderSpec =
    | "all"
    | "none"
    | Partial<{
        top: boolean;
        right: boolean;
        bottom: boolean;
        left: boolean;
    }>;