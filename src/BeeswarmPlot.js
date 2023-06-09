import * as d3 from 'd3';
import VisualizationAbstract from './VisualizationAbstract.js';

/**
 * Represents a beeswarm plot visualization.
 * @extends VisualizationAbstract
 */
export default class BeeswarmPlot extends VisualizationAbstract {
  /**
   * Creates an instance of BeeswarmPlot.
   * @param {string} htmlElementId - The ID of the HTML element to contain the visualization.
   * @param {Object[]} data - The data for the plot.
   * @param {string} attr - The attribute to visualize on the plot.
   * @param {number} radius - The radius of the circles in the plot.
   * @param {Object} settings - Additional settings for the plot.
   */
  constructor(htmlElementId, data, attr, radius, settings) {
    super(htmlElementId, settings.width, settings.height, settings);
    this.margin = { top: 10, right: 10, bottom: 10, left: 30 };
    this.element = htmlElementId;
    this.data = data;
    this.attr = attr;
    this.radius = radius || 5;
    this.width = settings.width;
    this.height = settings.height;
    this.orientation = settings.orientation; //`x` 'y'
    this.settings.dotsType = settings.dotsType ? settings.dotsType : 'circle'; // circle/ hex
    this.settings.colorAttr = settings.colorAttr ?? '';
    this.settings.colors = settings.colors ?? undefined;
    this.settings.autoresize = settings.autoresize ?? true;
    this.settings.opacity = settings.opacity ?? 1;
    this.settings.highlightColor = settings.highlightColor ?? 'red';
    this.settings.forceSteps = settings.forceSteps ?? 300;
    this.settings.forceX = settings.forceX ?? 1;
    this.settings.forceY = settings.forceY ?? 5;
    this.settings.forceCollider = settings.forceCollider ?? 1;
    this.attrTooltip = [];
    this.settings.showLegend = settings.showLegend ?? false;
  }

  /**
   * Prepares the data and returns the x and y scales based on the orientation and attribute.
   * @returns {Object} - The x and y scales.
   */
  prepareData() {
    let x, y;

    if (this.orientation === 'x') {
      if (
        typeof this.data[0][this.attr] === 'string' &&
        isNaN(this.data[0][this.attr])
      ) {
        x = d3
          .scaleBand()
          .range([0 + this.margin.left, this.width - this.margin.right])
          .padding(1);
        x.domain(this.data.map((d) => d[this.attr]));
      } else if (
        typeof +this.data[0][this.attr] === 'number' &&
        !isNaN(this.data[0][this.attr])
      ) {
        x = d3
          .scaleLinear()
          .range([0 + this.margin.left, this.width - this.margin.right]);
        x.domain(d3.extent(this.data, (d) => d[this.attr]));
      } else if (this.data[0][this.xLabel] instanceof Date) {
        x = d3
          .scaleTime()
          .range([0 + this.margin.left, this.width - this.margin.right]);
        x.domain(d3.extent(this.data, (d) => moment(d[this.attr]).toDate()));
      }
    }

    if (this.orientation === 'y') {
      if (
        typeof this.data[0][this.attr] === 'string' &&
        isNaN(this.data[0][this.attr])
      ) {
        y = d3
          .scaleBand()
          .range([this.height - this.margin.bottom, 0 + this.margin.top])
          .padding(1);
        y.domain(this.data.map((d) => d[this.attr]));
      } else if (
        typeof +this.data[0][this.attr] === 'number' &&
        !isNaN(this.data[0][this.attr])
      ) {
        y = d3
          .scaleLinear()
          .range([this.height - this.margin.bottom, 0 + this.margin.top]);
        y.domain(d3.extent(this.data, (d) => d[this.attr]));
      } else if (this.data[0][this.attr] instanceof Date) {
        y = d3
          .scaleTime()
          .range([this.height - this.margin.bottom, 0 + this.margin.top]);
        y.domain(d3.extent(this.data, (d) => moment(d[this.attr]).toDate()));
      }
    }
    return { x, y };
  }

  /**
   * Desenha o gráfico.
   * @returns {Object} O elemento do grupo de pontos.
   */
  draw() {
    super.draw();
    const { x, y } = this.prepareData();
    this.drawDots(x, y);
    this.drawAxis(x, y);
    return this.dotGroup;
  }

  /**
   * Desenha os pontos no gráfico.
   * @param {Object} x - Os valores de coordenada x.
   * @param {Object} y - Os valores de coordenada y.
   * @returns {Object} O elemento do grupo de pontos.
   */

  drawDots(x, y) {
    const colorScheme = this.settings.colors ?? undefined;
    const { colors, categories } = this.setColor(
      this.settings.colorAttr,
      colorScheme,
      this.settings.interpolate,
    );
    if (this.settings.showLegend) {
      this.drawLegend(colors, categories);
    }

    const scale = x ? x : y;

    const positionedData = this.calculateSwarmPlotPositions(
      this.data,
      this.radius,
      0.1,
      scale,
    );

    const attrOrientation = this.orientation === 'x' ? ['x', 'y'] : ['y', 'x'];
    const attrTranslate =
      this.orientation === 'x' ? [0, this.height / 2] : [this.width / 2, 0];

    this.dotGroup = this.forenground
      .append('g')
      .attr('transform', `translate(${attrTranslate[0]}, ${attrTranslate[1]})`)
      .attr('class', 'dots');

    this.dotGroup =
      this.settings.dotsType === 'circle'
        ? this.drawCircles(
            this.dotGroup,
            positionedData,
            colors,
            attrOrientation,
          )
        : this.drawHex(this.dotGroup, positionedData, colors, attrOrientation);

    return this.dotGroup;
  }

  /**
   * Desenha pontos no formato hexagonal.
   * @param {Object} element - O elemento SVG para desenhar os pontos.
   * @param {Array} positionedData - Os dados posicionados para os pontos.
   * @param {Function} colors - A função para obter a cor de um ponto.
   * @param {Array} positions - As posições x e y do ponto.
   * @returns {Object} O elemento do grupo de pontos.
   */
  drawHex(element, positionedData, colors, positions) {
    const hexagon = (radius) => {
      const x = 0;
      const y = 0;
      const angles = [0, 60, 120, 180, 240, 300, 360].map(
        (a) => (a * Math.PI) / 180,
      );
      const points = angles.map((angle) => [
        x + radius * Math.cos(angle),
        y + radius * Math.sin(angle),
      ]);

      return points
        .map((point, i) =>
          i === 0 ? `M${point[0]},${point[1]}` : `L${point[0]},${point[1]}`,
        )
        .join('');
    };

    return element
      .selectAll('.dot')
      .data(positionedData)
      .enter()
      .append('path')
      .attr('class', 'dot')
      .attr('d', hexagon(this.radius))
      .attr(
        'transform',
        (d) => `translate(${d[positions[0]]},${d[positions[1]]})`,
      )
      .attr('cursor', 'pointer')
      .attr('fill', (d) =>
        !colors ? this.settings.color : colors(d[this.settings.colorAttr]),
      )
      .attr('title', (d) => this.generateTooltipHtml(d, this.attrTooltip))
      .attr('cursor', 'pointer');
  }

  /**
   * Desenha os pontos no formato de círculo.
   * @param {Object} element - O elemento SVG para desenhar os pontos.
   * @param {Array} positionedData - Os dados posicionados para os pontos.
   * @param {Function} colors - A função para obter a cor de um ponto.
   * @param {Array} positions - As posições x e y do ponto.
   * @returns {Object} O elemento do grupo de pontos.
   */
  drawCircles(element, positionedData, colors, positions) {
    return element
      .selectAll('.dot')
      .data(positionedData)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', this.radius)
      .attr('cx', (d) => d[positions[0]])
      .attr('cy', (d) => d[positions[1]])
      .attr('cursor', 'pointer')
      .attr('fill', (d) =>
        !colors ? this.settings.color : colors(d[this.settings.colorAttr]),
      )
      .attr('title', (d) => this.generateTooltipHtml(d, this.attrTooltip))
      .attr('cursor', 'pointer');
  }

  /**
   * Desenha os eixos do gráfico.
   * @param {Object} x - A escala do eixo x.
   * @param {Object} y - A escala do eixo y.
   */
  drawAxis(x, y) {
    const xAxis = d3.axisBottom(x).tickSize(-this.height + this.margin.bottom);
    const yAxis = d3
      .axisLeft(y)
      .tickSize(-this.width + this.margin.left + this.margin.right);

    if (this.orientation === 'x') {
      this.axisX
        .append('g')
        .attr('class', 'x-axis')
        .attr(
          'transform',
          `translate(${0},${
            this.height - (this.margin.bottom + this.margin.top)
          })`,
        )
        .call(xAxis);
    }

    if (this.orientation === 'y') {
      this.axisY
        .append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${this.margin.left},${this.margin.top})`)
        .call(yAxis);
    }
  }

  /**
   * Aplica força para manter os pontos dentro dos limites do gráfico.
   * @param {number} size - O tamanho do eixo.
   * @param {string} axis - O eixo ao qual a força será aplicada ('x' ou 'y').
   * @returns {Function} Uma função de força para ser usada em uma simulação de força.
   */
  containForce(size, axis) {
    const strength = 0.1;
    const padding = 2 * this.radius;
    return (alpha) => {
      for (const d of this.data) {
        if (d[axis] < padding) {
          d.vx += (padding - d[axis]) * strength * alpha;
        } else if (d[axis] > size - padding) {
          d.vx -= (d[axis] - (size - padding)) * strength * alpha;
        }
      }
    };
  }

  /**
   * Calcula as posições dos pontos no gráfico de dispersão.
   * @param {Array} data - Os dados para os pontos.
   * @param {number} radius - O raio dos pontos.
   * @param {number} padding - O espaçamento entre os pontos.
   * @param {Object} scale - A escala utilizada para posicionar os pontos.
   * @returns {Array} As posições calculadas dos pontos.
   */
  calculateSwarmPlotPositions(data, radius, padding, scale) {
    const circles = data
      .map((d) => ({ x: scale(d[this.attr]), ...d }))
      .sort((a, b) => a.x - b.x);

    let head = null;
    let tail = null;

    for (const b of circles) {
      let a = head;

      while (a && a.x < b.x - (radius * 2 + padding)) {
        a = a.next;
      }

      b.y = 0;

      if (this.intersects(b.x, b.y, head)) {
        b.y = Infinity;

        while (a) {
          const y1 =
            a.y + Math.sqrt((radius * 2 + padding) ** 2 - (a.x - b.x) ** 2);
          const y2 =
            a.y - Math.sqrt((radius * 2 + padding) ** 2 - (a.x - b.x) ** 2);

          if (Math.abs(y1) < Math.abs(b.y) && !this.intersects(b.x, y1, head)) {
            b.y = y1;
          }

          if (Math.abs(y2) < Math.abs(b.y) && !this.intersects(b.x, y2, head)) {
            b.y = y2;
          }

          a = a.next;
        }
      }

      b.next = null;

      if (head === null) {
        head = tail = b;
      } else {
        tail = tail.next = b;
      }
    }

    return circles;
  }

  /**
   * Verifica se um ponto intersecta outros pontos.
   * @param {number} x - A coordenada x do ponto.
   * @param {number} y - A coordenada y do ponto.
   * @param {Object} head - O primeiro ponto na lista de pontos.
   * @returns {boolean} Retorna true se o ponto intersecta outros pontos, caso contrário, retorna false.
   */
  intersects(x, y, head) {
    let a = head;
    const epsilon = 0.001;
    const padding = 0.1;
    while (a) {
      if (
        (this.radius * 2 + padding - epsilon) ** 2 >
        (a.x - x) ** 2 + (a.y - y) ** 2
      ) {
        return true;
      }
      a = a.next;
    }
    return false;
  }
}
