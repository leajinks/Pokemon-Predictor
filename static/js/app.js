// Setup
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
const dataPromise = d3.json(url);
init();

// Initialize page
function init () {
    dataPromise.then((json) => {
        popDrop(json);
    });
    optionChanged(0, 1);
    optionChanged(0, 2);
    preparePokemon(3);
}

function preparePokemon (spot) {
    let pokemon = d3.select("pkmn" + spot + " col-md-4");
    console.log(spot);
    pokemon.append("h4").text("Base Stats:");
    const statList = ["hp", "atk", "def", "spa", "spd", "spe"];
    statList.forEach(stat => {
        console.log(stat);
        let row = pokemon.append("div").attr("class", "row row-no-gutters");
        row.append("strong").text(stat + ":\xA0");
        let bar = row.append("div").attr("class", "col-md-9 stat-bar");
        let progress = bar.append("div").attr("id", "pkmn" + spot + "-" + stat).attr("class", "progress");
    });
}

// Populate dropdown menu
function popDrop (data) {
    let dropdownOne = d3.select("#pkmn1-selDataset");
    let dropdownTwo = d3.select("#pkmn2-selDataset");
    for (i=0; i<data.names.length; i++) {
        dropdownOne.append("option").attr("value", i).text(data.names[i]);
        dropdownTwo.append("option").attr("value", i).text(data.names[i]);
    }
}

// Get data for selected subject
function getData (id, json) {
    let subjectMetadata = json.metadata[id];
    let metadataPanel = d3.select("#other-info");
    metadataPanel.selectAll("div").remove();
    for (const [key, value] of Object.entries(subjectMetadata)) {
        if (value) metadataPanel.append("div").text(`${key}: ${value}`);
    }

    let bar = [{
        type: "bar",
        x: json.samples[id].sample_values.slice(0,10),
        y: json.samples[id].otu_ids.slice(0,10).map((element) => "OTU " + element),
        text: json.samples[id].otu_labels.slice(0,10).map((element) => element.replaceAll(";","<br>")),
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
        text: json.samples[id].otu_labels.map((element) => element.replaceAll(";","<br>"))
    }];

    let data = {
        bar: bar,
        bubble: bubble
    };
    return data;
}

// Update plots
function optionChanged(id, spot) {
    const bins = [70, 90, 110, 130];
    const statList = ["hp", "atk", "def", "spa", "spd", "spe"]; // TODO: use the actual column names instead

    statList.forEach(stat => {
        let statValue = Math.round((Math.random() + Math.random() + Math.random()) * (200/3)); // TODO: get the actual stat
        let statBar = d3.select("#pkmn" + spot + "-" + stat);
        let barType = "progress-bar";
        if (statValue < bins[0]) barType += " progress-bar-danger";
        else if (statValue < bins[1]) barType += " progress-bar-warning";
        else if (statValue < bins[2]) barType += " progress-bar-success";
        else if (statValue < bins[3]) barType += " progress-bar-info";
        if (!(50 < statValue && statValue < 150)) barType += " progress-bar-striped active";

        statBar.select("div").attr("style","width:" + (statValue/255) * 100 +"%").attr("class", barType).text(statValue);
        if (statValue < 10) {
            statBar.select("div").text("");
            statBar.select(".outer-text").text("\xA0" + statValue);
        }
        else statBar.select(".outer-text").text("");
    });

    dataPromise.then((json) => {
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
    });
}