import * as d3 from 'd3';
import './styles/main.css'
export default class VisualizationAbstract {
    /**
     *
     * @param {htmlElementId} htmlElementId - id do Elemnto html em objeto
     */
    constructor(htmlElementId, width, height,settings) {
        this.parentElement = document.getElementById(htmlElementId);
        this.htmlBounds = this.parentElement.getBoundingClientRect();
        this.data;
        this.settings = {
            color: "#069",//"grey",//"#069",
            highlightColor: "#FF1122",//"#08E700",
            opacity: 1,
            notSelectedOpacity: 0.15,
            size_type: "fit",//"absolute"
            width: 700,
            height: 300,
            paddingTop: 25,
            paddingLeft: 50,
            paddingRight: 50,
            paddingBottom: 30,
            autoresize: true,
            colorAttr : "",
            interpolate:settings.interpolate??d3.interpolateBlues,
            theme: settings.theme, //light or dark
            colors : ["#FF1122"]
        };

        // converter width "100%"" e height "100vh" em numerico 
        this.config = {
            width: width ? width : 500,
            height: height ? height : 500,
            color: "#23a88e"
        }

        this.margin = { top: 0, left: 0, bottom: 0, right: 0 }

        this.padding = {
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
        }

        this.svg = d3.select(this.parentElement)
            .append("svg")
            .attr("class",`${this.settings.theme}-theme view-container`)
            .attr("width", this.config.width)
            .attr("height", this.config.height);


        this.background = this.svg.append("g")
            .attr("class", "layer-backgound");

        this.axisX = this.background.append("g")
            .attr("class", "layer-axisX");

        this.axisY = this.background.append("g")
            .attr("class", "layer-axisY");

        this.forenground = this.svg.append("g")
            .attr("class", "layer-forenground");

        this.highlight = this.svg.append("g")
            .attr("class", "layer-highlight");

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

}