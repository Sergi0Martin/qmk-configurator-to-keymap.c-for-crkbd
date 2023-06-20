import { LayoutEnum } from "./layoutEnum";

export interface KeymapFormatStrategy {
    canHandle(layout: LayoutEnum): boolean;

    format(data: string): File
}
