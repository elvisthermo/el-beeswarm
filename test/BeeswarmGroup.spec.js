import BeeswarmGroup from '../src/BeeswarmGroup';

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

describe(`${BeeswarmGroup.name}`, () => {
  beforeEach(() => {
    // Set up DOM
    // const d3 = d3;
    document.body.innerHTML = `
          <div id="element"></div>
        `;
  });

  it('should initialize with correct values', () => {
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
      paddingBottom: 30,
      autoresize: true,
      margin: { top: 30, right: 60, bottom: 60, left: 60 },
      colorAttr: 'species',
      forceX: 5,
      forceY: 5,
      theme: 'light',
    };

    const beeswarm = new BeeswarmGroup(
      htmlElementId,
      data,
      xLabel,
      yLabel,
      radius,
      settings,
    );
    expect(beeswarm).toBeDefined();
    beeswarm.draw();
  });
});
