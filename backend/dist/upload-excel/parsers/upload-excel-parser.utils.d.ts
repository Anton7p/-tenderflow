export declare function toCellString(value: string | number | null): string;
export declare function toNumber(value: string): number;
export declare function normalize(value: string): string;
export declare function getByIndex(row: string[], index: number): string;
export declare function mergeRow(target: string[], source: string[]): void;
export declare function isColumnNotationRow(row: string[]): boolean;
export declare function isServiceCell(value: string): boolean;
export declare function isFooterSectionRow(row: string[]): boolean;
export declare function normalizeFileName(fileName: string): string;
