import * as d3 from 'd3';
import './styles/main.css';
export default class VisualizationAbstract {
  /**
   *
   * @param {htmlElementId} htmlElementId - id do Elemnto html em objeto
   */
  constructor(htmlElementId, width, height, settings = {}) {
    this.parentElement = document.getElementById(htmlElementId);
    this.htmlBounds = this.parentElement.getBoundingClientRect();
    this.settings = {
      color: settings.color ?? '#069', //"grey",//"#069",
      highlightColor: settings.highlightColor ?? 'red',
      opacity: 1,
      notSelectedOpacity: 0.15,
      size_type: 'fit', //"absolute"
      width: 700,
      height: 300,
      autoresize: true,
      colorAttr: '',
      interpolate: settings.interpolate ?? d3.interpolateBlues,
      theme: settings.theme, //light,// dark
      showLegend: settings.showLegend ?? false,
      colors: ['#FF1122'],
    };
    this.hideTooltipTimeout = undefined;

    // converter width "100%"" e height "100vh" em numerico
    this.config = {
      width: width ? width : 500,
      height: height ? height : 500,
      color: '#23a88e',
    };

    this.attrTooltip = [];
    this.selected = [];
    this.margin = settings.margin;
    this.padding = {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    };

    this.svg = d3
      .select(this.parentElement)
      .attr('class', `${this.settings.theme}-theme plot`)
      .append('svg')
      .attr('class', `${this.settings.theme}-theme view-container`)
      .attr('width', this.config.width)
      .attr('height', this.config.height);

    this.background = this.svg.append('g').attr('class', 'layer-backgound');

    this.axisX = this.background.append('g').attr('class', 'layer-axisX');

    this.axisY = this.background.append('g').attr('class', 'layer-axisY');

    this.forenground = this.svg.append('g').attr('class', 'layer-forenground');

    this.highlight = this.svg.append('g').attr('class', 'layer-highlight');

    this.tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);
  }

  /**
   *
   * @param {dataset} dataset - dataset json
   */
  data(dataset) {
    this.data = dataset;
  }

  /**
   * @description - função de desenho do grafico
   */
  draw() {
    return this.forenground;
  }

  /**
   * @description - função de redimencionar
   */
  resize() {
    this.draw();
  }

  /**
   * @param {*} attribute
   * @param {*} colors
   */
  setColor(colorColumn, colors, sequentialInterpolator) {
    let colorScale;
    let schemeColor = colors ?? d3.schemeCategory10;
    const isNumber = isNaN(this.data[0][colorColumn]);
    let categories = [];
    const isNumeric = typeof +this.data[0][colorColumn] === 'number';
    const isCategorical = typeof this.data[0][colorColumn] === 'string';
    if (isNumeric && !isNumber) {
      const interpolator = this.settings.colors
        ? this.createCustomInterpolator()
        : sequentialInterpolator;
      colorScale = d3
        .scaleSequential()
        .domain(d3.extent(this.data, (d) => d[colorColumn]))
        .interpolator(interpolator);
    } else if (isCategorical && isNumber) {
      categories = Array.from(new Set(this.data.map((d) => d[colorColumn])));

      colorScale = d3.scaleOrdinal().domain(categories).range(schemeColor);
    } else {
      console.warn('Invalid color column');
      colorScale = null;
    }
    return { colors: colorScale, categories };
  }

  createCustomInterpolator() {
    return d3.interpolateRgbBasis(this.settings.colors);
  }

  drawLegend(colors, categories) {
    const legendDiv = d3
      .select(this.parentElement)
      .insert('div')
      .attr('class', `legend-container ${this.settings.theme}-theme`);

    legendDiv
      .append('div')
      .attr('class', 'legend-header')
      .append('button')
      .attr('class', 'close-btn')
      .text('➖')
      .on('click', function () {
        const legend = d3.select(d3.select(this).node().parentNode.parentNode);
        const icon = d3.select(this);
        if (legend.select('ul').classed('collapsed')) {
          // Expandir a div de legendas
          legend.select('ul').classed('collapsed', false);
          icon.text('➖');
        } else {
          // Encolher a div de legendas
          legend.select('ul').classed('collapsed', true);
          icon.text('➕');
        }
      });

    if (categories.length > 0) {
      this.drawLegendCategorical(legendDiv, colors, categories);
    } else {
      const min = d3.min(this.data, (d) => {
        return d[this.settings.colorAttr];
      });
      const max = d3.max(this.data, (d) => {
        return d[this.settings.colorAttr];
      });

      this.drawLegendContinuos(legendDiv, min, max);
    }

    legendDiv.classed('collapsed', false);
  }

  drawLegendContinuos(legendDiv, minValue, maxValue) {
    const colorText = this.settings.theme === 'dark' ? 'white' : 'black';
    const colorScale = d3
      .scaleSequential(this.settings.interpolate)
      .domain([0, 100]);

    const colors = this.settings.colors;

    const container = legendDiv;
    const togleContainer = container.append('ul').attr('class', 'legend-ul');
    const svg = togleContainer
      .append('svg')
      .attr('width', 200)
      .attr('height', 40);

    const width = 200;
    const height = 100;

    const defs = svg.append('defs');

    const gradient = defs
      .append('linearGradient')
      .attr('id', 'gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    if (colorScale && !colors) {
      gradient
        .selectAll('stop')
        .data(d3.range(0, 1.01, 0.01))
        .enter()
        .append('stop')
        .attr('offset', function (d) {
          return d * 100 + '%';
        })
        .attr('stop-color', function (d) {
          return colorScale(d * 100);
        });
    } else if (colors) {
      gradient

        .selectAll('stop')
        .data(colors)
        .enter()
        .append('stop')
        .attr('offset', function (d, i) {
          return (i / (colors.length - 1)) * 100 + '%';
        })
        .attr('stop-color', function (d) {
          return d;
        });
    }

    const rectWidth = width * 0.6;
    const rectHeight = height * 0.1;
    const rectX = width * 0.2;
    const rectY = height * 0.9 - rectHeight / 2;

    const rect = svg
      .append('rect')
      .attr('width', rectWidth)
      .attr('height', 20)
      .attr('x', 40)
      .attr('y', 0)
      .attr('fill', 'url(#gradient)');

    const minValueText = svg
      .append('text')
      .text(minValue)
      .attr('x', rectX - 5)
      .attr('y', 30)
      .style('text-anchor', 'end')
      .style('fill', colorText)
      .style('dominant-baseline', 'central');

    const maxValueText = svg
      .append('text')
      .text(maxValue)
      .attr('x', rectX + rectWidth + 5)
      .attr('y', 30)
      .style('text-anchor', 'start')
      .style('fill', colorText)
      .style('dominant-baseline', 'central');
  }

  drawLegendCategorical(legendDiv, colors, categories) {
    const legendItems = legendDiv
      .append('ul')
      .attr('class', 'legend-ul')
      .selectAll('li')
      .data(categories)
      .enter()
      .append('li');

    legendItems
      .append('div')
      .style('width', '20px')
      .style('height', '20px')
      .style('border-radius', '50%')
      .style('background-color', (d, i) => colors(d));

    legendItems
      .append('div')
      .attr('class', 'legend-text')
      .text((d) => d);
  }

  setHighlight(element) {
    d3.select(element)
      .attr('stroke', this.settings.highlightColor)
      .attr('opacity', 0.5);
  }

  setRemoverHighlight(element) {
    const dots = d3.select(element);

    const isSelected = dots.classed('selected');
    if (isSelected) {
      return d3.select(element).attr('opacity', 1);
    }
    return d3.select(element).attr('stroke', 'none').attr('opacity', 1);
  }

  setSelected(element) {
    const dots = d3.select(element);
    const isSelected = dots.classed('selected');
    if (isSelected) {
      this.selected.splice(this.selected.indexOf(dots), 1);
      dots.classed('selected', false);
      dots.attr('stroke', 'none').attr('opacity', 1);
    } else {
      this.selected.push(dots);
      dots.classed('selected', true);
      dots.attr('stroke', this.settings.highlightColor).attr('opacity', 1);
    }
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

  setTooltip(element) {
    if (this.hideTooltipTimeout) {
      clearTimeout(this.hideTooltipTimeout);
    }
    const { left, top } = element.getBoundingClientRect();

    const xGlobal = left + window.scrollX;
    const yGlobal = top + window.scrollY;

    this.tooltip
      .transition()
      .style('display', 'block')
      .transition(1000)
      .style('opacity', 0.9);
    this.tooltip
      .html(element.getAttribute('title'))
      .style('left', xGlobal + 'px')
      .style('top', yGlobal + 25 + 'px');
  }

  setRemoveTooltip(element) {
    this.hideTooltipTimeout = setTimeout(() => {
      this.tooltip.style('display', 'none').style('opacity', 0);
    }, 1000); // 200 milissegundos de atraso
  }

  showLegend(value) {
    this.settings.showLegend = value;
  }

  /**
   * @description - draw container initially in svg
   */
  drawContainer() {
    this.forenground
      .select('.layer-forenground')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')',
      );
  }

  setTooltipLabels(titles) {
    this.attrTooltip = titles;
  }

  drawAxislegend() {
    // Adicionar títulos para os eixos
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    this.forenground
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(${0},${this.height - this.margin.top}))`)
      .call(xAxis);

    this.forenground
      .append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${0},${0}))`)
      .call(yAxis);
  }

  drawHex(element, positionedData, colors) {
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
      .attr('transform', (d) => `translate(${d.x},${d.y})`)
      .attr('cursor', 'pointer')
      .attr('fill', (d) =>
        !colors ? this.settings.color : colors(d[this.settings.colorAttr]),
      )
      .attr('title', (d) => this.generateTooltipHtml(d, this.attrTooltip))
      .attr('cursor', 'pointer');
  }

  drawCircles(element, positionedData, colors) {
    return element
      .selectAll('.dot')
      .data(positionedData)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', this.radius)
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y)
      .attr('cursor', 'pointer')
      .attr('fill', (d) =>
        !colors ? this.settings.color : colors(d[this.settings.colorAttr]),
      )
      .attr('title', (d) => this.generateTooltipHtml(d, this.attrTooltip))
      .attr('cursor', 'pointer');
  }
}
