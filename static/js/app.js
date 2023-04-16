// Setup
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
    createBattleButton();
    preparePokemon(1);
    preparePokemon(2);
    popDrop(data);
}

// Set up a spot for a combatant in one of the specified locations
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

    let statBox = d3.select(`#pkmn${spot}-stat-box`);
    statBox.append("h4")
        .text("Base Stats:");
    for (stat in statList) {
        let row = statBox.append("div")
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

    createTriviaPanel(spot);

    optionChanged(0, spot);
}

function createBattleButton () {
    let buttonBox = d3.select("#battle");
    let pkmnOne = buttonBox.append("h2")
        .attr("class", "text-left");
    pkmnOne.append("span")
        .attr("id", "battle-pkmn1-name");
    buttonBox.append("h3")
        .attr("class", "text-center")
        .text("VS");
    let pkmnTwo = buttonBox.append("h2")
        .attr("class", "text-right");
    pkmnTwo.append("span")
        .attr("id", "battle-pkmn2-name");
    buttonBox.append("br");
    buttonBox.append("br");
    let button = buttonBox.append("button")
        .attr("type", "button")
        .attr("id", "battle-button")
        .attr("class", "btn btn-lg btn-dark center-block")
        .attr("onclick", `combat()`);
    button.append("h1").text("\u00A0BATTLE!!!\u00A0");
}

function createTriviaPanel (spot) {
    let trivia = d3.select(`#pkmn${spot}-trivia`);
    let panel = trivia.append("section")
        .attr("id", `pkmn${spot}-trivia-panel`)
        .attr("class", "panel panel-info");
    let header = panel.append("header")
        .attr("class", "panel-heading text-center");
    header.append("strong")
        .attr("class", "panel-title")
        .text("Trivia");
    let body = panel.append("div")
        .attr("class", "panel-body");
    let gen = body.append("div");
    gen.append("strong").text("Generation:\u00A0");
    gen.append("span").attr("class", "Generation");
    let legend = body.append("div");
    legend.append("strong").text("Legendary:\u00A0");
    legend.append("span").attr("class", "Legendary");
    let tier = body.append("div");
    tier.append("strong").text("Smogon Tier:\u00A0");
    tier.append("span").attr("class", "Tier");
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

// Predict the winner
function combat () {
    d3.select("#pkmn1-panel")
        .attr("class", "panel panel-default");
    d3.select("#pkmn2-panel")
        .attr("class", "panel panel-default");
    let pkmnOne = document.querySelector("#pkmn1-name").textContent;
    let pkmnTwo = document.querySelector("#pkmn2-name").textContent;
    let url = `/predict/${pkmnOne}/${pkmnTwo}`
    fetch(url).then(response => response.json()).then(
        didOneWin => {
            let victor = 2 - Number(didOneWin);
            d3.select(`#pkmn${victor}-panel`)
                .attr("class", "panel panel-default panel-victor");
            d3.select("#winner-tag")
                .attr("class", `blink victor${victor}`)
                .text(`${victor === 1 ? "\u2B9C " : ""}WINNER${victor === 1 ? "" : " \u2B9E"}`);
        }
    )
}

// Update panels
function optionChanged(id, spot) {
    // Reset winner tag
    d3.select("#pkmn1-panel")
        .attr("class", "panel panel-default");
    d3.select("#pkmn2-panel")
        .attr("class", "panel panel-default");
    d3.select("#winner-tag")
        .attr("class", "")
        .text("\u00A0");

    let name = data[id].Name;
    d3.select(`#pkmn${spot}-name`)
        .text(name);
    d3.select(`#battle-pkmn${spot}-name`)
        .text(`\u2002${name}\u2002`);

    d3.select(`#pkmn${spot}-img`)
        .attr("src", `../static/img/pkmn-artwork/${name.toLowerCase()}.png`);

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

    let tidbits = ["Generation", "Legendary", "Tier"];
    tidbits.forEach(field => {
        d3.select(`#pkmn${spot}-trivia`)
            .select(`.${field}`)
            .text(data[id][field]);
    });
}