import VisualizationAbstract from './VisualizationAbstract.js';

export default class BeeswarmDimensions extends VisualizationAbstract {
  constructor(htmlElementId, data, xLabel, yLabel, radius, settings) {
    super(htmlElementId, settings.width, settings.height);
    this.margin = { top: 30, right: 10, bottom: 60, left: 60 };
    this.element = htmlElementId;
    this.data = data;
    this.xLabel = xLabel;
    this.yLabel = yLabel;
    this.radius = radius || 5;
    this.width = settings.width;
    this.height = settings.height;
    this.settings.dotsType = settings.dotsType ? settings.dotsType : 'circle'; // circle/ hex
    this.settings.colorAttr = settings.colorAttr ?? '';
    this.settings.colors = settings.colors ?? '';
    this.settings.autoresize = settings.autoresize ?? true;
    this.settings.opacity = settings.opacity ?? 1;
    this.settings.highlightColor = settings.highlightColor ?? 'red';
    this.settings.forceSteps = settings.forceSteps ?? 300;
    this.settings.forceX = settings.forceX ?? 1;
    this.settings.forceY = settings.forceY ?? 5;
    this.settings.forceCollider = settings.forceCollider ?? 1;
  }
}
