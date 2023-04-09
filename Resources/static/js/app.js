// Setup
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
const dataPromise = d3.json(url);
init();

// Initialize page
function init () {
    dataPromise.then((json) => {
        popDrop(json);
    });
    optionChanged(0);
}

// Populate dropdown menu
function popDrop (data) {
    let dropdown = d3.select("#selDataset");
    for (i=0; i<data.names.length; i++) {
        dropdown.append("option").attr("value", i).text(data.names[i]);
    }
}

// Get data for selected subject
function getData (id, json) {
    let subjectMetadata = json.metadata[id];
    let metadataPanel = d3.select("#sample-metadata");
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
function optionChanged(id) {
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
        Plotly.newPlot("bar", data.bar, barLayout);
        //Plotly.newPlot("bubble", data.bubble, bubbleLayout);
    });
}