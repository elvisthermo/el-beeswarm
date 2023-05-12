import VisualizationAbstract from "./VisualizationAbstract.js";

export default class BeeswarmPlot extends VisualizationAbstract {
  attrTooltip = [];
  constructor(htmlElementId, data, attr, radius, width, height, settings) {
    super(htmlElementId, width, height,settings);
    this.margin = { top: 10, right: 10, bottom: 10, left: 30 };
    this.element = htmlElementId;
    this.data = data;
    this.attr = attr;
    this.radius = radius || 5;
    this.width = width;
    this.height = height;
    this.orientation = settings.orientation; //`x` 'y'
    this.settings.dotsType = settings.dotsType ? settings.dotsType : "circle"; // circle/ hex
    this.settings.colorAttr = settings.colorAttr ?? "";
    this.settings.colors = settings.colors ??undefined;
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

    if (this.orientation === "x") {
      if (typeof this.data[0][this.attr] === "string" && isNaN(this.data[0][this.attr])) {
        x = d3
          .scaleBand()
          .range([0 + this.margin.left, this.width - this.margin.right])
          .padding(1);
        x.domain(this.data.map((d) => d[this.attr]));
      } else if (typeof +this.data[0][this.attr] === "number" && !isNaN(this.data[0][this.attr])) {
        console.log('caiu no numbet y');
        // .range([0 + this.margin.left, this.width - this.margin.right]);
        // x.domain(d3.extent(this.data, (d) => d[this.xLabel]))
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

    if (this.orientation === "y") {
      // Definir a escala do eixo Y
      if (typeof this.data[0][this.attr] === "string" && isNaN(this.data[0][this.attr])) {
        y = d3
          .scaleBand()
          .range([this.height - this.margin.bottom, 0 + this.margin.top])
          .padding(1);
        y.domain(this.data.map((d) => d[this.attr]));
      } else if (typeof +this.data[0][this.attr] === "number" && !isNaN(this.data[0][this.attr])) {
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

    // this.drawContainer();
    this.drawDots(x, y);
    this.drawAxis(x, y);
    return this.dotGroup; 
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
    const colors = this.setColor(this.settings.colorAttr, colorScheme, this.settings.interpolate);

    const scale = x?x:y;

    const positionedData = this.calculateSwarmPlotPositions(
      this.data,
      this.radius,
      0.1,
      scale
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

    const attrOrientation = this.orientation==='x'?['x','y']:['y','x'];
    const attrTranslate = this.orientation==='x'?[0,this.height/2]:[this.width/2,0];

    console.log(positionedData);
    const dotGroup = this.forenground.append("g")
    .attr("transform", `translate(${attrTranslate[0]}, ${attrTranslate[1]})`)
    .attr("class", "dots");
    dotGroup
      .selectAll(".dot")
      .data(positionedData)
      .enter()
      .append("path")
      .attr("class", "dot")
      .attr("d", hexagon(this.radius))
      .attr("transform", (d) => `translate(${d[attrOrientation[0]]},${d[attrOrientation[1]]})`)
      .attr("cursor", "pointer")
      // .append("circle")
      // .attr("class", "dot")
      // .attr("cx", d => d[attrOrientation[0]])
      // .attr("cy", d => d[attrOrientation[1]])
      // .attr("r", this.radius)
      // .attr("cursor", "pointer")
      .attr("fill", (d) => {
        console.log(`d[this.settings.colorAttr]`,d[this.settings.colorAttr]);
        return colors(d[this.settings.colorAttr])})
      .attr("title", (d) => this.generateTooltipHtml(d, this.attrTooltip))
      .on("mouseover", function (event, d) {
        d3.select(this).attr("opacity", 0.8);
        tooltip.transition().style("opacity", 1);
        tooltip
          .html(this.getAttribute("title"))
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 28 + "px");
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
    const xAxis = d3.axisBottom(x).tickSize(-this.height  + this.margin.bottom);
    const yAxis = d3.axisLeft(y).tickSize(-this.width + this.margin.left + this.margin.right);

    if (this.orientation === "x") {
      this.axisX
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(${0},${this.height- (this.margin.bottom + this.margin.top)})`)
        .call(xAxis);
    }

    if (this.orientation === "y") {
      this.axisY
        .append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${this.margin.left},${this.margin.top})`)
        .call(yAxis);
    }
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
   * @description - draw container initially in svg
   */
  // drawContainer() {
  //   this.forenground
  //     .select(".layer-forenground")
  //     .attr("width", this.width + this.margin.left + this.margin.right)
  //     .attr("height", this.height + this.margin.top + this.margin.bottom)
  //     .append("g")
  //     .attr(
  //       "transform",
  //       "translate(" + this.margin.left + "," + this.margin.top + ")"
  //     );
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

  calculateSwarmPlotPositions(data, radius, padding, scale) {
    data.map((d) => ({ ...d }));
    const circles = data.map(d => ( {x: scale(d[this.attr]), ...d})).sort((a, b) => a.x - b.x);
    const epsilon = 0.001;
    let head = null, tail = null;
      
    // Returns true if circle ⟨x,y⟩ intersects with any circle in the queue.
    function intersects(x, y) {
      let a = head;
      while (a) {
        if ((radius * 2 + padding - epsilon) ** 2 > (a.x - x) ** 2 + (a.y - y) ** 2) {
          return true;
        }
        a = a.next;
      }
      return false;
    }
    
    // Place each circle sequentially.
    for (const b of circles) {
      
      // Remove circles from the queue that can’t intersect the new circle b.
      while (head && head.x < b.x - (radius * 2 + padding)) head = head.next;
      
      // Choose the minimum non-intersecting tangent.
      if (intersects(b.x, b.y = 0)) {
        let a = head;
        b.y = Infinity;
        do {
          let y1 = a.y + Math.sqrt((radius * 2 + padding) ** 2 - (a.x - b.x) ** 2);
          let y2 = a.y - Math.sqrt((radius * 2 + padding) ** 2 - (a.x - b.x) ** 2);
          if (Math.abs(y1) < Math.abs(b.y) && !intersects(b.x, y1)) b.y = y1;
          if (Math.abs(y2) < Math.abs(b.y) && !intersects(b.x, y2)) b.y = y2;
          a = a.next;
        } while (a);
      }
      
      // Add b to the queue.
      b.next = null;
      if (head === null) head = tail = b;
      else tail = tail.next = b;
    }
    
    return circles;
  }

  showTooltip() {}

  showLegend() {}
}
