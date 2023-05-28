import BeeswarmDimensions from '../src/BeeswarmDimensions';

describe(`${BeeswarmDimensions.name}`, () => {
  beforeEach(() => {
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
    expect(beeswarm).toBeDefined();
  });
});
