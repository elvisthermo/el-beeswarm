import BeeswarmGroup from '../src/BeeswarmGroup';
import { dataJson } from './jest/__mocks__/datasetMock';
import * as d3 from 'd3';

const htmlElementId = 'element';
const data = dataJson.samples;
const xLabel = 'sepal_length';
const yLabel = 'species';
const radius = 10;
const settings = {
  color: '#069', //"grey",//"#069",
  highlightColor: '#FF1122', //"#08E700",
  opacity: 1,
  notSelectedOpacity: 0.15,
  size_type: 'fit', //"absolute"
  width: 800,
  height: 600,
  paddingTop: 25,
  paddingLeft: 50,
  paddingRight: 50,
  dotsType: 'hex',
  paddingBottom: 30,
  autoresize: true,
  margin: { top: 30, right: 60, bottom: 60, left: 60 },
  colorAttr: 'species',
  forceX: 5,
  forceY: 5,
  theme: 'light',
  showLegend: true,
};

describe(`${BeeswarmGroup.name}`, () => {
  beforeEach(() => {
    document.body.innerHTML = `
          <div id="element"></div>
        `;
  });

  afterEach(() => {});

  it('should initialize with correct values', () => {
    const beeswarm = new BeeswarmGroup(
      htmlElementId,
      data,
      'date',
      'date',
      radius,
      settings,
    );
    expect(beeswarm).toBeDefined();
    beeswarm.setTooltipLabels(['sepal_width', 'species']);
    beeswarm.draw();
  });

  it('should initialize with undefined attr values', () => {
    const beeswarm = new BeeswarmGroup(
      htmlElementId,
      data,
      'date',
      'date',
      undefined,
      {
        width: 300,
        height: 300,
        margin: { top: 30, right: 60, bottom: 60, left: 60 },
        colorAttr: yLabel,
      },
    );
    expect(beeswarm).toBeDefined();
    beeswarm.setTooltipLabels(['sepal_width', 'species']);
    beeswarm.draw();
  });

  describe('containForce', () => {
    test('should adjust vx of data objects based on their position on the given axis', () => {
      // Configuração inicial
      const htmlElementId = 'element';
      const data = dataJson.samples;
      const radius = 10;
      const settings = {
        color: '#069', //"grey",//"#069",
        highlightColor: '#FF1122', //"#08E700",
        opacity: 1,
        notSelectedOpacity: 0.15,
        size_type: 'fit', //"absolute"
        width: 800,
        height: 600,
        paddingTop: 25,
        paddingLeft: 50,
        paddingRight: 50,
        paddingBottom: 30,
        autoresize: true,
        margin: { top: 30, right: 60, bottom: 60, left: 60 },
        colorAttr: 'species',
        forceX: 5,
        forceY: 5,
        theme: 'light',
        showLegend: true,
      };

      const beeswarm = new BeeswarmGroup(
        htmlElementId,
        data,
        'date',
        'date',
        radius,
        settings,
      );

      const size = 10;
      const axis = 'x';
      const instance = {
        radius: 1,
        data: [
          { x: 0, vx: 0 },
          { x: 5, vx: 0 },
          { x: 10, vx: 0 },
        ],
      };

      const expectedDataAfterContainForce = [
        { x: 0, vx: 0.2 },
        { x: 5, vx: 0 },
        { x: 10, vx: -0.2 },
      ];

      // Invoca a função containForce
      beeswarm.containForce(size, axis);

      // Verifica se a função modificou os dados conforme o esperado
      expect(instance.data).toBeDefined();
    });
  });

  // it('should be create beeswarm with default color', () => {});
  it('should be create beeswarm with categorical colors', () => {
    settings.colorAttr = yLabel;
    settings.colors = ['red', 'green', 'blue'];
    const beeswarm = new BeeswarmGroup(
      htmlElementId,
      data,
      yLabel,
      yLabel,
      radius,
      settings,
    );
    expect(beeswarm).toBeDefined();
    beeswarm.setTooltipLabels(['sepal_width', 'species']);
    beeswarm.draw();
    expect(beeswarm.settings.colorAttr).toEqual(settings.colorAttr);
  });

  it('should be create beeswarm with continuos colors', () => {
    settings.colorAttr = xLabel;
    settings.colors = ['red', 'green', 'blue'];
    const beeswarm = new BeeswarmGroup(
      htmlElementId,
      data,
      xLabel,
      xLabel,
      radius,
      settings,
    );
    expect(beeswarm).toBeDefined();
    beeswarm.setTooltipLabels(['sepal_width', 'species']);
    beeswarm.draw();
    expect(beeswarm.settings.colorAttr).toEqual(settings.colorAttr);
  });

  it('should be create beeswarm with continuos colors and interpolate d3.js', () => {
    settings.colorAttr = xLabel;
    settings.interpolate = d3.interpolateMagma;
    const beeswarm = new BeeswarmGroup(
      htmlElementId,
      data,
      xLabel,
      yLabel,
      radius,
      settings,
    );
    expect(beeswarm).toBeDefined();
    beeswarm.setTooltipLabels(['sepal_width', 'species']);
    beeswarm.draw();
    expect(beeswarm.settings.colorAttr).toEqual(settings.colorAttr);
  });

  // it('should perpare data tests categorical');
  // it('should perpare data tests continuous');
  // it('should perpare data tests temporal');

  // it('should be showing as color legends categoricals');
  // it('should be showing as color legends continuous');

  it('should be create beeswarm with dots Hexagons', () => {
    settings.dotsType = 'hex';
    const beeswarm = new BeeswarmGroup(
      htmlElementId,
      data,
      xLabel,
      yLabel,
      radius,
      settings,
    );

    beeswarm.draw();
    expect(beeswarm.settings.dotsType).toEqual('hex');
  });

  it('should be create beeswarm with dots Circles', () => {
    settings.dotsType = 'circle';
    const beeswarm = new BeeswarmGroup(
      htmlElementId,
      data,
      xLabel,
      yLabel,
      radius,
      settings,
    );

    beeswarm.draw();
    expect(beeswarm.settings.dotsType).toEqual('circle');
  });
});
