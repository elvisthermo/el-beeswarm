import * as d3 from "d3";
import "./styles/main.css";
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
      colors: ["#FF1122"],
    };

    // converter width "100%"" e height "100vh" em numerico
    this.config = {
      width: width ? width : 500,
      height: height ? height : 500,
      color: "#23a88e",
    };

    this.margin = settings.margin;
    console.log('this.margin in container', this.margin);
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

    this.forenground = this.svg
      .append("g")
      .attr("class", "layer-forenground");

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

  /**
   * @param {*} attribute
   * @param {*} colors
   */
  setColor(colorColumn, colors, sequentialInterpolator) {
    let colorScale;
    let schemeColor = colors ?? d3.schemeCategory10;
    const isNumber = isNaN(this.data[0][colorColumn]);
    // Verifica se a coluna de cores é numérica ou categórica
    const isNumeric = typeof +this.data[0][colorColumn] === "number";
    const isCategorical = typeof this.data[0][colorColumn] === "string";
    // Cria a escala de cores apropriada com base no tipo da coluna de cores
    if (isNumeric && !isNumber) {
      const interpolator = this.settings.colors
        ? this.createCustomInterpolator()
        : sequentialInterpolator;
      colorScale = d3
        .scaleSequential()
        .domain(d3.extent(this.data, (d) => d[colorColumn]))
        .interpolator(interpolator);
    } else if (isCategorical && isNumber) {
      console.log("é categorico");
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

  createCustomInterpolator() {
    return d3.interpolateRgbBasis(this.settings.colors);
  }
}
