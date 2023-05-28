// import { JSDOM } from 'jsdom';
import VisualizationAbstract from '../src/VisualizationAbstract';

describe('VisualizationAbstract', () => {
  let dom;
  let visualization;

  beforeEach(() => {
    // Configurar um novo JSDOM e um novo objeto VisualizationAbstract antes de cada teste
    document.body.innerHTML = `
    <div id="element"></div>
  `;

    // global.window = dom.window;
    // global.document = dom.window.document;

    visualization = new VisualizationAbstract('element', 500, 500);
  });

  afterEach(() => {
    // Limpar o JSDOM e o objeto VisualizationAbstract após cada teste
    // dom = null;
    visualization = null;
    // global.window = null;
    // global.document = null;
  });

  test('constructor initializes with the correct width and height', () => {
    visualization.data();
    visualization.resize();
    expect(visualization.config.width).toBe(500);
    expect(visualization.config.height).toBe(500);
  });

  // Continue escrevendo seus testes aqui...
});
