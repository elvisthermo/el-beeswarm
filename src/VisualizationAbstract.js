import * as d3 from "d3";

export default class VisualizationAbstract {
  /**
   *
   * @param {htmlElementId} htmlElementId - id do Elemnto html em objeto
   */
  constructor(htmlElementId, width, height, settings) {
    this.parentElement = document.getElementById(htmlElementId);
    this.htmlBounds = this.parentElement.getBoundingClientRect();
    this.data;
    this.settings = {
      color: "#069", //"grey",//"#069",
      highlightColor: "#FF1122", //"#08E700",
      opacity: 1,
      notSelectedOpacity: 0.15,
      size_type: "fit", //"absolute"
      width: 700,
      height: 300,
      paddingTop: 25,
      paddingLeft: 50,
      paddingRight: 50,
      paddingBottom: 30,
      autoresize: true,
      colorAttr: "",
      interpolate: settings.interpolate ?? d3.interpolateBlues,
      theme: settings.theme, //light or dark
      showLegend : settings.showLegend ?? false,
      colors: ["#FF1122"],
    };

    // converter width "100%"" e height "100vh" em numerico
    this.config = {
      width: width ? width : 500,
      height: height ? height : 500,
      color: "#23a88e",
    };

    this.margin = { top: 0, left: 0, bottom: 0, right: 0 };

    this.padding = {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    };

    this.svg = d3
      .select(this.parentElement)
      .append("svg")
      .attr("class", `${this.settings.theme}-theme view-container`)
      .attr("width", this.config.width)
      .attr("height", this.config.height);

    this.background = this.svg.append("g").attr("class", "layer-backgound");

    this.axisX = this.background.append("g").attr("class", "layer-axisX");

    this.axisY = this.background.append("g").attr("class", "layer-axisY");

    this.forenground = this.svg.append("g").attr("class", "layer-forenground");

    this.highlight = this.svg.append("g").attr("class", "layer-highlight");
  }

  /**
   *
   * @param {dataset} dataset - dataset json
   */
  data(dataset) {
    this.data = dataset;

    console.log(dataset);
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
  resize() {}

  drawLegend(colors, categories) {
    const legend = d3.select("#legend");
    // Adiciona botão para fechar a div de legendas

    const legendDiv = legend
      .append("div")
      .attr("class", "legend-container dark-theme");

    const legendHeader = legendDiv
      .append("div")
      .attr("class", "legend-header")
      .append("button")
      .attr("class", "close-btn")
      .text("➖")
      .on("click", function () {
        const legendDiv = d3.select(".legend-ul");
        // console.log(`ul`,legendDiv);
        const icon = d3.select(this);
        if (legendDiv.classed("collapsed")) {
          // Expandir a div de legendas
          legendDiv.classed("collapsed", false);
          icon.text("➖");
        } else {
          // Encolher a div de legendas
          legendDiv.classed("collapsed", true);
          icon.text("➕");
        }
      });

    if (categories) {
      this.drawLegendCategorical(legendDiv, colors, categories);
    } else if (this.settings.colors) {
      this.drawLegendContinuos(legendDiv, 0, 3500, colors);
    }

    legendDiv.classed("collapsed", false);
  }

  drawLegendContinuos(minValue, maxValue, colorRange) {
    console.log("testes");
    console.log(minValue);
    console.log(maxValue);
    console.log(colorRange);

    const colors = this.settings.colors;

    const container = d3.select(".legend-container");

    container.selectAll("svg").remove(); // Limpar qualquer conteúdo anterior no container
    const togleContainer = container.append("ul").attr("class", "legend-ul");
    const svg = togleContainer
      .append("svg")
      .attr("width", 200)
      .attr("height", 40);

    const width = 200;
    const height = 100;
    console.log("svg", svg);

    const defs = svg.append("defs");

    const gradient = defs
      .append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    gradient
      .selectAll("stop")
      .data(colors)
      .enter()
      .append("stop")
      .attr("offset", function (d, i) {
        return (i / (colors.length - 1)) * 100 + "%";
      })
      .attr("stop-color", function (d) {
        return d;
      });

    const rectWidth = width * 0.6;
    const rectHeight = height * 0.1;
    const rectX = width * 0.2;
    const rectY = height * 0.9 - rectHeight / 2;

    const rect = svg
      .append("rect")
      .attr("width", rectWidth)
      .attr("height", 20)
      .attr("x", 20)
      .attr("y", 0)
      .attr("fill", "url(#gradient)");

    const minValueText = svg
      .append("text")
      .text(0)
      .attr("x", rectX - 5)
      .attr("y", 30)
      .style("text-anchor", "end")
      .style("dominant-baseline", "central");

    const maxValueText = svg
      .append("text")
      .text(100)
      .attr("x", rectX + rectWidth + 5)
      .attr("y", 30)
      .style("text-anchor", "start")
      .style("dominant-baseline", "central");
  }

  drawLegendCategorical(legendDiv, colors, categories) {
    const legendItems = legendDiv
      .append("ul")
      .attr("class", "legend-ul")
      .selectAll("li")
      .data(categories)
      .enter()
      .append("li");

    legendItems
      .append("div")
      .style("width", "20px")
      .style("height", "20px")
      .style("border-radius", "50%")
      .style("background-color", (d, i) => colors(d));

    legendItems
      .append("div")
      .attr("class", "legend-text")
      .text((d) => d);
  }
}
