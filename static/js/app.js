// Setup
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
const dataPromise = d3.json(url);
const statList = {
    hp: "HP",
    atk: "Attack",
    def: "Defense",
    spa: "Sp. Atk",
    spd: "Sp. Def",
    spe: "Speed"
}
init();

// Initialize page
function init () {
    /*dataPromise.then((json) => {
        popDrop(json);
    });*/
    preparePokemon(1);
    preparePokemon(2);
    popDrop(data);
}

function preparePokemon (spot) {
    let pokemon = d3.select(`#pkmn${spot}`);

    let selector = pokemon.append("div")
        .attr("id", `pkmn${spot}-selector`)
        .attr("class", "text-center");
    selector.append("strong")
        .text("Pokémon:\u00A0");
    dropdown = selector.append("select")
        .attr("id", `pkmn${spot}-selDataset`)
        .attr("onChange", `optionChanged(this.value, ${spot})`);
    dropdown.append("option").text("-- Choose a Pokémon --");

    pokemon.append("br");

    let panel = pokemon.append("section")
        .attr("class", "panel panel-primary");
    let header = panel.append("header")
        .attr("class", "panel-heading text-center");
    header.append("strong")
        .attr("id", `pkmn${spot}-name`)
        .attr("class", "panel-title")
        .text("Pokemon Name");
    let body = panel.append("div")
        .attr("class", "panel-body");
    body.append("img")
        .attr("id", `pkmn${spot}-img`)
        .attr("class", "img-responsive")
        .attr("src", "../Resources/img/amaura.png");
    let footer = panel.append("footer")
        .attr("class", "panel-footer text-center");
    footer.append("strong")
        .text("Type:\u00A0");
    footer.append("strong")
        .attr("id", `pkmn${spot}-type`)
        .attr("style", "color: white");

    pokemon.append("h4")
        .text("Base Stats:");
    for (stat in statList) {
        let row = pokemon.append("div")
            .attr("class", "row row-no-gutters");
        row.append("strong")
            .attr("class", "col-md-3 text-right")
            .text(`${statList[stat]}:\u2003`);
        let bar = row.append("div")
            .attr("class", "col-md-9 stat-bar");
        let progress = bar.append("div")
            .attr("id", `pkmn${spot}-${stat}`)
            .attr("class", "progress");
        progress.append("div")
            .attr("class", "progress-bar");
        progress.append("div")
            .attr("class", "outer-text");
    };
}

// Populate dropdown menu
function popDrop (data) {
    let dropdownOne = d3.select("#pkmn1-selDataset");
    let dropdownTwo = d3.select("#pkmn2-selDataset");
    for (let i = 0; i < data.length; i++) {
        dropdownOne.append("option")
            .attr("value", i)
            .text(data[i].Name);
        dropdownTwo.append("option")
            .attr("value", i)
            .text(data[i].Name);
    }
}

// Get data for selected subject
function getData (id, json) {
    let subjectMetadata = json.metadata[id];
    let metadataPanel = d3.select("#other-info");
    metadataPanel.selectAll("div")
        .remove();
    for (const [key, value] of Object.entries(subjectMetadata)) {
        if (value) metadataPanel.append("div")
            .text(`${key}: ${value}`);
    }

    let bar = [{
        type: "bar",
        x: json.samples[id].sample_values.slice(0,10),
        y: json.samples[id].otu_ids.slice(0,10)
            .map((element) => `OTU ${element}`),
        text: json.samples[id].otu_labels.slice(0,10)
            .map((element) => element.replaceAll(";","<br>")),
        orientation: "h"
    }];

    let bubble = [{
        mode: "markers",
        x: json.samples[id].otu_ids,
        y: json.samples[id].sample_values,
        marker: {
            size: json.samples[id].sample_values,
            color: json.samples[id].otu_ids
        },
        text: json.samples[id].otu_labels
            .map((element) => element.replaceAll(";","<br>"))
    }];

    let data = {
        bar: bar,
        bubble: bubble
    };
    return data;
}

// Update plots
function optionChanged(id, spot) {
    d3.select(`#pkmn${spot}-name`)
        .text(data[id].Name);

    let type = d3.select(`#pkmn${spot}-type`);
    type.selectAll("span")
        .remove();
    type.append("span")
        .attr("class", data[id]["Type 1"])
        .text(`\u00A0${data[id]["Type 1"]}\u00A0`);
    if (data[id]["Type 2"]) {
        type.append("span")
            .text("\u00A0");
        type.append("span")
            .attr("class", data[id]["Type 2"])
            .text(`\u00A0${data[id]["Type 2"]}\u00A0`);
    }

    Object.keys(statList).forEach(stat => {
        let statBar = d3.select(`#pkmn${spot}-${stat}`);
        let statValue = data[id][statList[stat]];

        let width = `${Math.round(statValue * 500 / 255) / 5}%`;
        let hue = Math.min(Math.max((statValue - 50) * 12 / 5, 0), 300);
        let bgColor = `hsl(${hue}, 75%, 50%)`;
        let style = `width: ${width}; background-color: ${bgColor}`;

        let barType = "progress-bar";
        if (statValue > 150) barType += " progress-bar-striped active";

        statBar.select("div")
            .attr("style", style)
            .attr("class", barType)
            .text(statValue);
        if (statValue < 20) {
            statBar.select("div")
                .text("");
            statBar.select(".outer-text")
                .text(`\u00A0${statValue}`);
        }
        else statBar.select(".outer-text")
            .text("");
    });

    /*dataPromise.then((json) => {
        let barLayout = {
            yaxis: {
                autorange: "reversed"
            }
        };
        let bubbleLayout = {
            xaxis: {
                title: "OTU ID"
            }
        };
        let data = getData(id, json)
        //Plotly.newPlot("stat-bars", data.bar, barLayout);
        //Plotly.newPlot("bubble", data.bubble, bubbleLayout);
    });*/
}