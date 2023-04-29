import VisualizationAbstract from "./VisualizationAbstract";

export default class BeeswarmGroup extends VisualizationAbstract {
  attrTooltip = [];
  constructor(
    htmlElementId,
    data,
    xLabel,
    yLabel,
    radius,
    width,
    height,
    settings
  ) {
    super(htmlElementId, width, height);
    this.margin = { top: 30, right: 10, bottom: 60, left: 60 };
    this.element = htmlElementId;
    this.data = data;
    this.xLabel = xLabel;
    this.yLabel = yLabel;
    this.radius = radius || 5;
    this.width = width;
    this.height = height;
    this.settings.dotsType = settings.dotsType ?settings.dotsType: "circle";// circle/ hex
    this.settings.colorAttr = settings.colorAttr ?? "";
    this.settings.colors = settings.colors ?? "";
    this.settings.autoresize = settings.autoresize ?? true;
    this.settings.opacity = settings.opacity ?? 1;
    this.settings.highlightColor = settings.highlightColor ?? "red";
    this.settings.forceSteps = settings.forceSteps ?? 300;
    this.settings.forceX = settings.forceX ?? 1;
    this.settings.forceY = settings.forceY ?? 5;
    this.settings.forceCollider = settings.forceCollider ?? 1;
  }

  prepareData() {
    // super.data(dataset);
  }

  draw() {
    super.draw();
    var x, y;

    if (typeof this.data[0][this.xLabel] === "string") {
      x = d3
        .scaleBand()
        .range([0 + this.margin.left, this.width - this.margin.right])
        .padding(1);
      x.domain(this.data.map((d) => d[this.xLabel]));
    } else if (typeof this.data[0][this.xLabel] === "number") {
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

    // Definir a escala do eixo Y
    if (typeof this.data[0][this.yLabel] === "string") {
      y = d3
        .scaleBand()
        .range([this.height - this.margin.bottom, 0 + this.margin.top])
        .padding(1);
      y.domain(this.data.map((d) => d[this.yLabel]));
    } else if (typeof this.data[0][this.yLabel] === "number") {
      y = d3
        .scaleLinear()
        .range([this.height - this.margin.bottom, 0 + this.margin.top]);
      y.domain(d3.extent(this.data, (d) => d[this.yLabel]));
    } else if (this.data[0][this.xLabel] instanceof Date) {
      y = d3
        .scaleTime()
        .range([this.height - this.margin.bottom, 0 + this.margin.top]);
      y.domain(d3.extent(this.data, (d) => moment(d[this.yLabel]).toDate()));
    }

    this.drawContainer();
    this.drawDots(x, y);
    this.drawAxis(x, y);
  }

  resize() {}

  drawDots(x, y) {
    let selected = [];
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // Criar a simulação de força
    const colorScheme = this.settings.colors ?? undefined;
    const colors = this.setColor(this.xLabel, colorScheme);
    // Adicionar os círculos

    const positionedData = this.calculateSwarmPlotPositions(
      this.data,
      x,
      y,
      this.radius
    );

    const hexagon = (radius) => {
      const x = 0;
      const y = 0;
      const angles = [0, 60, 120, 180, 240, 300, 360].map(
        (a) => (a * Math.PI) / 180
      );
      const points = angles.map((angle) => [
        x + radius * Math.cos(angle),
        y + radius * Math.sin(angle),
      ]);

      return points
        .map((point, i) =>
          i === 0 ? `M${point[0]},${point[1]}` : `L${point[0]},${point[1]}`
        )
        .join("");
    };

    // circle or hex
    // .enter()
    // .append("circle")
    // .attr("class", "dot")
    // .attr("r", this.radius)
    // .attr("cx", (d) => d.x)
    // .attr("cy", (d) => d.y)

    const dotGroup = this.forenground.append("g").attr("class", "dots");
    dotGroup
      .selectAll(".dot")
      .data(positionedData)
      .enter()
      .append("path")
      .attr("class", "dot")
      .attr("d", hexagon(this.radius))
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .attr("cursor", "pointer")
      .attr("fill", (d) => colors(d[this.settings.colorAttr]))
      .attr("title", (d) => this.generateTooltipHtml(d, this.attrTooltip))
      .on("mouseover", function (event, d) {
        d3.select(this).attr("opacity", 0.8);
        // tooltip.transition().style("opacity", 1);
        // tooltip
        //   .html(this.getAttribute("title"))
        //   .style("left", event.pageX + "px")
        //   .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function (d) {
        d3.select(this).attr("opacity", 1);
        // tooltip.transition().style("opacity", 0);
      })
      .on("click", function (d) {
        const circle = d3.select(this);
        const isSelected = circle.classed("selected");
        if (isSelected) {
          selected.splice(selected.indexOf(circle), 1);
          circle.classed("selected", false);
          circle.attr("stroke", "none").attr("opacity", 1);
        } else {
          selected.push(circle);
          circle.classed("selected", true);
          circle.attr("stroke", "red").attr("opacity", 1);
        }
      });
  }

  drawAxis(x, y) {
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    this.axisX
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(${this.margin.left},${this.height})`)
      .call(xAxis);

    this.axisY
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${this.margin.left},${this.margin.top})`)
      .call(yAxis);
  }

  drawAxislegend() {
    // Adicionar títulos para os eixos
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    this.forenground
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(${0},${this.height - this.margin.top}))`)
      .call(xAxis);

    this.forenground
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${0},${0}))`)
      .call(yAxis);
  }

  /**
   * @param {*} attribute
   * @param {*} colors
   */
  setColor(colorColumn, colors) {
    let colorScale;
    let schemeColor = colors ?? d3.schemeCategory10;

    // Verifica se a coluna de cores é numérica ou categórica
    const isNumeric = typeof this.data[0][colorColumn] === "number";
    const isCategorical = typeof this.data[0][colorColumn] === "string";

    // Cria a escala de cores apropriada com base no tipo da coluna de cores
    if (isNumeric) {
      colorScale = d3
        .scaleSequential()
        .domain(d3.extent(this.data, (d) => d[colorColumn]))
        .interpolator(d3.interpolateViridis);
    } else if (isCategorical) {
      const categories = Array.from(
        new Set(this.data.map((d) => d[colorColumn]))
      );

      colorScale = d3.scaleOrdinal().domain(categories).range(schemeColor);
    } else {
      // Se a coluna de cores não for numérica nem categórica, retorna null
      console.warn("Invalid color column");
      colorScale = null;
    }

    return colorScale;
  }

  /**
   * @description - draw container initially in svg
   */
  drawContainer() {
    this.forenground = d3
      .select("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr(
        "transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")"
      );
  }

  setTooltipLabels(titles) {
    this.attrTooltip = titles;
  }

  generateTooltipHtml(d, titles) {
    let html = "";
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
      (a, b) => xScale(a[this.xLabel]) - xScale(b[this.xLabel])
    );

    const simulation = d3
      .forceSimulation(sortedData)
      .force("x", d3.forceX((d) => xScale(d[this.xLabel])).strength(1))
      .force("y", d3.forceY((d) => yScale(d[this.yLabel])).strength(5))
      .force("collide", d3.forceCollide(this.radius + 1).strength(1))
      .force("containX", this.containForce(this.width - this.margin.right, "x"))
      .force(
        "containY",
        this.containForce(
          this.height - (this.margin.top + this.margin.bottom),
          "y"
        )
      )
      .stop();

    // Executar a simulação de força pelos passos definidos
    for (let i = 0; i < this.settings.forceSteps; i++) {
      simulation.tick();
    }

    return sortedData;
  }

  showTooltip() {}

  showLegend() {}
}
