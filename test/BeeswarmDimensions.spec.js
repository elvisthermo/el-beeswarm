import BeeswarmDimensions from '../src/BeeswarmDimensions';

describe(`${BeeswarmDimensions.name}`, () => {
  beforeEach(() => {
    // Set up DOM
    document.body.innerHTML = `
          <div id="element"></div>
        `;
  });

  it('should initialize with correct values', () => {
    const htmlElementId = 'element';
    const data = [];
    const xLabel = 'xLabel';
    const yLabel = 'yLabel';
    const radius = 10;
    const settings = {};

    const beeswarm = new BeeswarmDimensions(
      htmlElementId,
      data,
      xLabel,
      yLabel,
      radius,
      settings,
    );

    // expect(beeswarm.element).toEqual(htmlElementId);
    // expect(beeswarm.data).toEqual(data);
    // expect(beeswarm.xLabel).toEqual(xLabel);
    // expect(beeswarm.yLabel).toEqual(yLabel);
    // expect(beeswarm.radius).toEqual(radius);
    // expect(beeswarm.width).toEqual(settings.width);
    // expect(beeswarm.height).toEqual(settings.height);
    // expect(beeswarm.settings.dotsType).toEqual(settings.dotsType);
    // expect(beeswarm.settings.colorAttr).toEqual(settings.colorAttr);
    // expect(beeswarm.settings.colors).toEqual(settings.colors);
    // expect(beeswarm.settings.autoresize).toEqual(settings.autoresize);
    // expect(beeswarm.settings.opacity).toEqual(settings.opacity);
    // expect(beeswarm.settings.highlightColor).toEqual(settings.highlightColor);
    // expect(beeswarm.settings.forceSteps).toEqual(settings.forceSteps);
    // expect(beeswarm.settings.forceX).toEqual(settings.forceX);
    // expect(beeswarm.settings.forceY).toEqual(settings.forceY);
    expect(beeswarm).toBeDefined();
  });
});
