export class BeeswarmGroup {
    constructor(
        htmlElementId: string,
        data: any[],
        xLabel:string,
        yLabel: string,
        radius: number,
        width: number,
        height: number,
        SwarmOptions
        );
        draw(): void;
        setTooltipLabels(titles: string[]): void;
}

export class BeeswarmPlot{
    constructor(
        htmlElementId: string,
        data: any[],
        xLabel:string,
        yLabel: string,
        radius: number,
        width: number,
        height: number,
        SwarmOptions
        );
        draw(): void;
        setTooltipLabels(titles: string[]): void;
}

export interface SwarmOptions {
    dotsType?: 'circle' | 'hex';
    colorAttr?: string;
    colors?: any;
    autoresize?: boolean;
    opacity?: number;
    highlightColor?: string;
    forceSteps?: number;
    forceX?: number;
    forceY?: number;
    theme?: any;
    forceCollider?: number;
    showTooltip?: boolean;
    showLegend?: boolean;
}
