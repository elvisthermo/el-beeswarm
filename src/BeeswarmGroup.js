import VisualizationAbstract from './VisualizationAbstract.js';

export default class BeeswarmGroup extends VisualizationAbstract {
  constructor(htmlElementId, data, xLabel, yLabel, radius, settings) {
    super(htmlElementId, settings.width, settings.height, settings);
    this.margin = settings.margin;
    this.element = htmlElementId;
    this.data = data;
    this.xLabel = xLabel;
    this.yLabel = yLabel;
    this.radius = radius || 5;
    this.width = settings.width;
    this.height = settings.height;
    this.settings.dotsType = settings.dotsType ?? 'circle'; // circle/ hex
    this.settings.colorAttr = settings.colorAttr ?? undefined;
    this.settings.colors = settings.colors ?? undefined;
    this.settings.autoresize = settings.autoresize ?? true;
    this.settings.opacity = settings.opacity ?? 1;
    this.settings.highlightColor = settings.highlightColor ?? 'red';
    this.settings.forceSteps = settings.forceSteps ?? 300;
    this.settings.forceX = settings.forceX ?? 3;
    this.settings.forceY = settings.forceY ?? 5;
    this.theme = settings.theme;
    this.settings.forceCollider = settings.forceCollider ?? 1;
    this.settings.showTooltip = settings.showTooltip ?? false;
    this.settings.showLegend = settings.showLegend ?? false;
  }

  prepareData() {
    var x, y;

    if (
      typeof this.data[0][this.xLabel] === 'string' &&
      isNaN(this.data[0][this.xLabel])
    ) {
      x = d3
        .scaleBand()
        .range([0 + this.margin.left, this.width - this.margin.right])
        .padding(1);
      x.domain(this.data.map((d) => d[this.xLabel]));
    } else if (
      typeof +this.data[0][this.xLabel] === 'number' &&
      !isNaN(this.data[0][this.xLabel])
    ) {
      x = d3
        .scaleLinear()
        .range([0 + this.margin.left, this.width - this.margin.right]);
      x.domain(d3.extent(this.data, (d) => d[this.xLabel]));
    } else if (this.data[0][this.xLabel] instanceof Date) {
      x = d3
        .scaleTime()
        .range([0 + this.margin.left, this.width - this.margin.right]);
      x.domain(d3.extent(this.data, (d) => moment(d[this.xLabel]).toDate()));
    }

    if (
      typeof this.data[0][this.yLabel] === 'string' &&
      isNaN(this.data[0][this.yLabel])
    ) {
      y = d3
        .scaleBand()
        .range([this.height - this.margin.bottom, this.margin.top])
        .padding(1);
      y.domain(this.data.map((d) => d[this.yLabel]));
    } else if (
      typeof +this.data[0][this.yLabel] === 'number' &&
      !isNaN(this.data[0][this.yLabel])
    ) {
      const eixoY = this.data.map((d) => +d[this.yLabel]).sort((a, b) => a - b);
      y = d3
        .scaleLinear()
        .range([this.height - this.margin.bottom, this.margin.top]);
      y.domain(d3.extent(eixoY, (d) => d));
    } else if (this.data[0][this.xLabel] instanceof Date) {
      y = d3
        .scaleTime()
        .range([this.height - this.margin.bottom, 0 + this.margin.top]);
      y.domain(d3.extent(this.data, (d) => moment(d[this.yLabel]).toDate()));
    }
    return { x, y };
  }

  draw() {
    super.draw();
    const { x, y } = this.prepareData();
    this.drawContainer();
    this.drawDots(x, y);
    this.drawAxis(x, y);
  }

  drawDots(x, y) {
    const colorScheme = this.settings.colors ?? undefined;
    const { colors, categories } = this.setColor(
      this.settings.colorAttr,
      colorScheme,
      this.settings.interpolate,
    );
    // Adicionar os círculos
    if (this.settings.showLegend) {
      console.log(colors);
      console.log(categories);
      this.drawLegend(colors, categories);
    }

    const positionedData = this.calculateSwarmPlotPositions(
      this.data,
      x,
      y,
      this.radius,
    );

    this.dotGroup = this.forenground.append('g').attr('class', 'dots');

    this.dotGroup =
      this.settings.dotsType === 'circle'
        ? this.drawCircles(this.dotGroup, positionedData, colors)
        : this.drawHex(this.dotGroup, positionedData, colors);

    return this.dotGroup;
  }

  drawAxis(x, y) {
    const xAxis = d3.axisBottom(x).tickSize(-this.height + this.margin.bottom);
    const yAxis = d3
      .axisLeft(y)
      .tickSize(-this.width + this.margin.left + this.margin.right);

    this.axisX
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${this.height - this.margin.top})`) // Alterado aqui
      .call(xAxis);

    this.axisY
      .append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${this.margin.left}, 0)`) // Alterado aqui
      .call(yAxis);
  }

  setTooltipLabels(titles) {
    this.attrTooltip = titles;
  }

  generateTooltipHtml(d, titles) {
    let html = '';
    for (const [key, value] of Object.entries(d)) {
      if (titles.includes(key)) {
        html += `<div><strong>${key}:</strong> ${value}</div>`;
      }
    }
    return html;
  }

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

  calculateSwarmPlotPositions(data, xScale, yScale, radius) {
    const positionedData = data.map((d) => ({ ...d }));
    const sortedData = positionedData.sort(
      (a, b) => xScale(a[this.xLabel]) - xScale(b[this.xLabel]),
    );

    const simulation = d3
      .forceSimulation(sortedData)
      .force(
        'x',
        d3.forceX((d) => xScale(d[this.xLabel])).strength(this.settings.forceX),
      )
      .force(
        'y',
        d3.forceY((d) => yScale(d[this.yLabel])).strength(this.settings.forceY),
      )
      .force('collide', d3.forceCollide(this.radius + 1).strength(1))
      .force('containX', this.containForce(this.width - this.margin.left, 'x'))
      .force(
        'containY',
        this.containForce(
          this.height - (this.margin.top + this.margin.bottom),
          'y',
        ),
      )
      .stop();

    for (let i = 0; i < this.settings.forceSteps; i++) {
      simulation.tick();
    }

    return sortedData;
  }

  drawContainer() {
    this.forenground = this.forenground
      .append('g')
      .attr('width', -this.width - this.margin.left)
      .attr('height', this.height - this.margin.top)
      .append('g');
  }
}
