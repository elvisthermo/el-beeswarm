import BeeswarmPlot from '../src/BeeswarmPlot';
import { dataJson } from './jest/__mocks__/datasetMock';

describe(`${BeeswarmPlot.name}`, () => {
  beforeEach(() => {
    // Set up DOM
    document.body.innerHTML = `
          <div id="element"></div>
        `;
  });

  afterEach(() => {});

  it('should initialize with correct values', () => {
    const htmlElementId = 'element';
    const data = dataJson.samples;
    const radius = 10;
    const settings = {
      color: '#069', //"grey",//"#069",
      colorAttr: 'petal_width',
      highlightColor: '#FF1122', //"#08E700",
      opacity: 1,
      notSelectedOpacity: 0.15,
      size_type: 'fit', //"absolute"
      width: 700,
      height: 400,
      autoresize: true,
      theme: 'light',
      orientation: 'x',
      margin: { top: 30, right: 10, bottom: 60, left: 60 },
      showLegend: true,
      // colors:['red','blue','pink',"green"]
    };

    const beeswarm = new BeeswarmPlot(
      htmlElementId,
      data,
      'petal_width',
      radius,
      settings,
    );
    expect(beeswarm).toBeDefined();
    beeswarm.draw();
  });
});
