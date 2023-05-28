import BeeswarmPlot from '../src/BeeswarmPlot';
const dataJson = {
  dataset_name: 'Iris',
  samples: [
    {
      sepal_length: 5.1,
      sepal_width: 3.5,
      petal_length: 1.4,
      petal_width: 0.2,
      species: 'setosa',
    },
    {
      sepal_length: 4.9,
      sepal_width: 3.0,
      petal_length: 1.4,
      petal_width: 0.2,
      species: 'setosa',
    },
    {
      sepal_length: 4.7,
      sepal_width: 3.2,
      petal_length: 1.3,
      petal_width: 0.2,
      species: 'setosa',
    },
    {
      sepal_length: 4.6,
      sepal_width: 3.1,
      petal_length: 1.5,
      petal_width: 0.2,
      species: 'setosa',
    },
    {
      sepal_length: 5.0,
      sepal_width: 3.6,
      petal_length: 1.4,
      petal_width: 0.2,
      species: 'setosa',
    },
  ],
};
describe(`${BeeswarmPlot.name}`, () => {
  beforeEach(() => {
    // Set up DOM
    document.body.innerHTML = `
          <div id="element"></div>
        `;
  });

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
