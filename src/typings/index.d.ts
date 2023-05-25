declare module "el-beeswarm" {
  interface vis {
    BeeswarmGroup?: BeeswarmGroup;
    BeeswarmPlot?: BeeswarmPlot;
  }

  export class BeeswarmGroup {
    attrTooltip: string[];
    dotGroup: any;
    margin: any;
    element: string;
    data: any[];
    xLabel: string;
    yLabel: string;
    radius: number;
    width: number;
    height: number;
    theme: any;
    constructor(
      htmlElementId: string,
      data: any[],
      xLabel: string,
      yLabel: string,
      radius: number,
      width: number,
      height: number,
      settings: Settings
    );
    prepareData(): void;
    draw(): void;
    resize(): void;
    drawDots(x: any, y: any): Selection;
    drawAxis(x: any, y: any): void;
    setTooltipLabels(titles: string[]): void;
    generateTooltipHtml(d: any, titles: string[]): string;
    containForce(size: number, axis: string): (alpha: number) => void;
    calculateSwarmPlotPositions(
      data: any[],
      xScale: any,
      yScale: any,
      radius: number
    ): any[];
    drawContainer(): void;
  }

  export class BeeswarmPlot {
    attrTooltip: string[];
    dotGroup: any;
    margin: any;
    element: string;
    data: any[];
    attr: string;
    radius: number;
    width: number;
    height: number;
    settings: {
      dotsType?: string;
      colorAttr?: any;
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
      [key: string]: any;
    };
    theme: any;
    constructor(
      htmlElementId: string,
      data: any[],
      attr: string,
      radius: number,
      width: number,
      height: number,
      settings: any
    );
    prepareData(): void;
    draw(): void;
    resize(): void;
    drawDots(x: any, y: any): Selection;
    drawAxis(x: any, y: any): void;
    setTooltipLabels(titles: string[]): void;
    generateTooltipHtml(d: any, titles: string[]): string;
    containForce(size: number, axis: string): (alpha: number) => void;
    calculateSwarmPlotPositions(
      data: any[],
      xScale: any,
      yScale: any,
      radius: number
    ): any[];
    drawContainer(): void;
  }
  
  export interface Settings {
    dotsType: "circle" | "hex";
    colorAttr?: string;
    colors?: any[] | undefined;
    autoresize: boolean;
    opacity: number;
    highlightColor: string;
    forceSteps: number;
    forceX: number;
    forceY: number;
    theme?: any;
    forceCollider: number;
    showTooltip: boolean;
    showLegend: boolean;
    orientation?: "x" | "y";
  }
  
}

