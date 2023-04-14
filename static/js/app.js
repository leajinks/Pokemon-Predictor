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
    createBattleButton();
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

    pokemon.append("br");

    let panel = pokemon.append("section")
        .attr("id", `pkmn${spot}-panel`)
        .attr("class", "panel panel-default");
    let header = panel.append("header")
        .attr("class", "panel-heading text-center");
    header.append("strong")
        .attr("id", `pkmn${spot}-name`)
        .attr("class", "panel-title");
    let body = panel.append("div")
        .attr("class", "panel-body");
    body.append("img")
        .attr("id", `pkmn${spot}-img`)
        .attr("class", "img-responsive");
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

    optionChanged(0, spot);
}

function createBattleButton () {
    let buttonBox = d3.select("#battle");
    let pkmnOne = buttonBox.append("h2").attr("class", "text-left");
    pkmnOne.append("span").attr("id", "battle-pkmn1-name");
    buttonBox.append("h3").attr("class", "text-center").text("VS");
    let pkmnTwo = buttonBox.append("h2").attr("class", "text-right");
    pkmnTwo.append("span").attr("id", "battle-pkmn2-name");
    buttonBox.append("br");
    buttonBox.append("br");
    let button = buttonBox.append("button").attr("type", "button").attr("id", "battle-button").attr("class", "btn btn-danger btn-lg center-block");
    button.append("h1").text("\u00A0BATTLE!!!\u00A0");
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
/*function getData (id, json) {
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
}*/

// Update panels
function optionChanged(id, spot) {
    d3.select(`#pkmn${spot}-name`)
        .text(data[id].Name);

    d3.select(`#battle-pkmn${spot}-name`)
        .text(`\u2002${data[id].Name}\u2002`);

    console.log(`../Resources/img/pkmn-artwork/${data[id].Name.toLowerCase()}.png`);

    d3.select(`#pkmn${spot}-img`)
        .attr("src", `../Resources/img/pkmn-artwork/${data[id].Name.toLowerCase()}.png`);

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