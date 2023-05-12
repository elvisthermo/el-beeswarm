import VisualizationAbstract from "./VisualizationAbstract.js";

export default class BeeswarmGroup extends VisualizationAbstract {
  attrTooltip = [];
  dotGroup;
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
    super(htmlElementId, width, height, settings);
    this.margin = settings.margin;
    this.element = htmlElementId;
    this.data = data;
    this.xLabel = xLabel;
    this.yLabel = yLabel;
    this.radius = radius || 5;
    this.width = width;
    this.height = height;
    this.settings.dotsType = settings.dotsType ? settings.dotsType : "circle"; // circle/ hex
    this.settings.colorAttr = settings.colorAttr ?? undefined;
    this.settings.colors = settings.colors ?? undefined;
    this.settings.autoresize = settings.autoresize ?? true;
    this.settings.opacity = settings.opacity ?? 1;
    this.settings.highlightColor = settings.highlightColor ?? "red";
    this.settings.forceSteps = settings.forceSteps ?? 300;
    this.settings.forceX = settings.forceX ?? 3;
    this.settings.forceY = settings.forceY ?? 5;
    this.theme = settings.theme;
    this.settings.forceCollider = settings.forceCollider ?? 1;
    this.settings.showTooltip = settings.showTooltip ?? false;
    this.settings.showLegend = settings.showLegend ?? false;
  }

  prepareData() {}

  draw() {
    super.draw();
    var x, y;

    if (
      typeof this.data[0][this.xLabel] === "string" &&
      isNaN(this.data[0][this.xLabel])
    ) {
      x = d3
        .scaleBand()
        .range([0 + this.margin.left, this.width - this.margin.right])
        .padding(1);
      x.domain(this.data.map((d) => d[this.xLabel]));
    } else if (
      typeof +this.data[0][this.xLabel] === "number" &&
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
      typeof this.data[0][this.yLabel] === "string" &&
      isNaN(this.data[0][this.yLabel])
    ) {
      y = d3
        .scaleBand()
        .range([this.height - this.margin.bottom, this.margin.top])
        .padding(1);
      y.domain(this.data.map((d) => d[this.yLabel]));
    } else if (
      typeof +this.data[0][this.yLabel] === "number" &&
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

    this.drawContainer();
    this.drawDots(x, y);
    this.drawAxis(x, y);
  }

  resize() {}

  drawDots(x, y) {
    const self = this;

    let selected = [];
    this.tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    const colorScheme = this.settings.colors ?? undefined;
    const colors = this.setColor(
      this.settings.colorAttr,
      colorScheme,
      this.settings.interpolate
    );
    // Adicionar os círculos
    if (this.settings.showLegend) {
      this.drawLegend(colorScale, categories);
    }

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

    this.dotGroup = this.forenground.append("g").attr("class", "dots");

    this.dotGroup
      .selectAll(".dot")
      .data(positionedData)
      .enter()
      .append("path")
      .attr("class", "dot")
      .attr("d", hexagon(this.radius))
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .attr("cursor", "pointer")
      .attr("fill", (d) => colors(d[this.settings.colorAttr]))
      .attr("title", (d) => this.generateTooltipHtml(d, this.attrTooltip));
    // .on("mouseover", function (event, d) {

    // })
    // .on("mouseleave", function () {
    //   // evento mouseleave adicionado
    //   // console.log('saiu');
    //   // d3.select(this).attr("opacity", 1);
    //   // tooltip.transition().style("opacity", 0)
    //   // .transition()
    //   //       .style("opacity", 0)
    //   //       .style("display", "none")
    // })
    // .on("click", function (d) {
    //   const circle = d3.select(this);
    //   const isSelected = circle.classed("selected");
    //   if (isSelected) {
    //     selected.splice(selected.indexOf(circle), 1);
    //     circle.classed("selected", false);
    //     circle.attr("stroke", "none").attr("opacity", 1);
    //   } else {
    //     selected.push(circle);
    //     circle.classed("selected", true);
    //     circle.attr("stroke", "red").attr("opacity", 1);
    //   }
    // });

    return this.dotGroup;
  }

  drawAxis(x, y) {
    const xAxis = d3.axisBottom(x).tickSize(-this.height + this.margin.bottom);
    const yAxis = d3
      .axisLeft(y)
      .tickSize(-this.width + this.margin.left + this.margin.right);

    this.axisX
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${this.height - this.margin.top})`) // Alterado aqui
      .call(xAxis);

    this.axisY
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${this.margin.left}, 0)`) // Alterado aqui
      .call(yAxis);
  }

  // drawAxislegend(x,y) {
  //   const xAxis = d3.axisBottom(x);
  //   const yAxis = d3.axisLeft(y);

  //   this.forenground
  //     .append("g")
  //     .attr("class", "x-axis")
  //     .attr("transform", `translate(${0},${this.height - (this.margin.bottom+this.margin.top)})`) // modificação aqui
  //     .call(xAxis);

  //   this.forenground
  //     .append("g")
  //     .attr("class", "y-axis")
  //     .attr("transform", `translate(${this.margin.left},${0})`) // modificação aqui
  //     .call(yAxis);
  // }

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
      .force(
        "x",
        d3.forceX((d) => xScale(d[this.xLabel])).strength(this.settings.forceX)
      )
      .force(
        "y",
        d3.forceY((d) => yScale(d[this.yLabel])).strength(this.settings.forceY)
      )
      .force("collide", d3.forceCollide(this.radius + 1).strength(1))
      .force("containX", this.containForce(this.width - this.margin.left, "x"))
      .force(
        "containY",
        this.containForce(
          this.height - (this.margin.top + this.margin.bottom),
          "y"
        )
      )
      .stop();

    for (let i = 0; i < this.settings.forceSteps; i++) {
      simulation.tick();
    }

    return sortedData;
  }

  drawContainer() {
    this.forenground = this.forenground
      .append("g")
      .attr("width", -this.width - this.margin.left)
      .attr("height", this.height - this.margin.top)
      .append("g");
  }

  setTooltip() {
    this.tooltip.transition().style("opacity", 0.8);

    let tooltipHtml = "";
    this.attrTooltip.map((key) => {
      if (d.hasOwnProperty(key)) {
        tooltipHtml += `<div><strong>${key}:</strong> ${d[key]}</div>`;
      }
    });

    this.tooltip
      .html(tooltipHtml)
      .style("left", event.pageX + "px")
      .style("top", event.pageY - 28 + "px")
      .style("display", "block");
    d3.select(this).transition().style("display", "none");
  }

  showLegend(value) {
    this.settings.showLegend = value;
  }
}
