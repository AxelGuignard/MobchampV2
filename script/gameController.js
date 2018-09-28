let viewport = {width: $(document).width(), height: $(document).height() };
let map = null;

let canvas = document.getElementById("viewport");
let ctx = canvas.getContext("2d");

let civilisations = [];
let colonies = [];
let totalPop = 0;

let actionStack = [];
actionStack["attack"] = [];
actionStack["reinforce"] = [];
actionStack["infect"] = [];

$(document).ready(function()
{
    init();
    $("body").on("click", function ()
    {
        update();
    });
});

function init()
{
    // create the canvas and webgl rendering context
    ctx.canvas.width = viewport.width * 0.8;
    ctx.canvas.height = viewport.height;

    $("#display").width(viewport.width * 0.2).height(viewport.height);

    // create the map and size it to viewport size
    map = new Map(50, 50);
    map.resize({ width: viewport.width * 0.8, height: viewport.height });

    // create the civilisations
    civilisations.push(new MoChCivilisation("The blues", { red: 42, green: 20, blue: 225, alpha: 1}));
    colonies.push([]);
    civilisations.push(new MoChCivilisation("The reds", { red: 225, green: 26, blue: 20, alpha: 1}));
    colonies.push([]);
    civilisations.push(new MoChCivilisation("The greens", { red: 1, green: 225, blue: 28, alpha: 1}));
    colonies.push([]);

    let pos = { x: null, y: null };
    let x = Math.floor(Math.random() * map.cellSize.width);
    let y = Math.floor(Math.random() * map.cellSize.height);
    for(let i = 0; i < civilisations.length; i++)
    {
        while(x === pos.x && y === pos.y)
        {
            x = Math.floor(Math.random() * map.cellSize.width);
            y = Math.floor(Math.random() * map.cellSize.height);
        }
        pos.x = x;
        pos.y = y;

        colonies[i].push(new MoChColony({ x: x, y: y }, civilisations[i]));
        map.cells[x][y].changeInhabitant(colonies[i][0]);

        $("#display").append(
            "<table id='" + civilisations[i].name + "' class='d_civ'>" +
                "<tr>" +
                    "<td>" +
                        "<h2>" + civilisations[i].name + "</h2>" +
                    "</td>" +
                    "<td>" +
                        "<span style='display: block; width: 30%; height: 30%; border: 2px solid black; background-color: rgba(" + civilisations[i].color.red + ", " + civilisations[i].color.green + ", " + civilisations[i].color.blue + ", 1);'" +
                    "</td>" +
                "</tr>" +
                "<tr>" +
                    "<td>" +
                        "<span>Population:</span>" +
                    "</td>" +
                    "<td style='text-align: right;'>" +
                        "<span id='" + civilisations[i].name.replace(" ", "_") + "_pop' class='d_attr'></span>" +
                    "</td>" +
                "</tr>" +
                "<tr>" +
                    "<td>" +
                        "<span>Combativity:</span>" +
                    "</td>" +
                    "<td style='text-align: right;'>" +
                        "<span id='" + civilisations[i].name.replace(" ", "_") + "_comb' class='d_attr'></span>" +
                    "</td>" +
                "</tr>" +
                "<tr>" +
                    "<td>" +
                        "<span>Preservativity:</span>" +
                    "</td>" +
                    "<td style='text-align: right;'>" +
                        "<span id='" + civilisations[i].name.replace(" ", "_") + "_pres' class='d_attr'></span>" +
                    "</td>" +
                "</tr>" +
                "<tr>" +
                    "<td>" +
                        "<span>Expensivity:</span>" +
                    "</td>" +
                    "<td style='text-align: right;'>" +
                        "<span id='" + civilisations[i].name.replace(" ", "_") + "_expen' class='d_attr'></span>" +
                    "</td>" +
                "</tr>" +
            "</table>");

        $(".d_civ").height(viewport.height / civilisations.length);
    }

    let update_id = setInterval(update, 100);
    drawMap();
    draw();
}

function update()
{
    if(ctx.canvas.clientWidth !== ctx.canvas.width || ctx.canvas.height !== ctx.canvas.height)
    {
        if(ctx.canvas.clientWidth !== ctx.canvas.width)
        {
            ctx.canvas.width = ctx.canvas.clientWidth;
        }
        if(ctx.canvas.height !== ctx.canvas.height)
        {
            ctx.canvas.height = ctx.canvas.clientHeight;
        }

        map.resize(viewport);
    }

    updateGame();
    draw();
}

function drawMap()
{
    // draw the map
    let cellSize = { width: map.cells[0][0].size.width, height: map.cells[0][0].size.height };
    for(let i = 0; i < map.cellSize.width; i++)
    {
        ctx.moveTo(i * cellSize.width, 0);
        ctx.lineTo(i * cellSize.width, map.size.height);
    }
    for(let i = 0; i < map.cellSize.height; i++)
    {
        ctx.moveTo(0, i * cellSize.height);
        ctx.lineTo(map.size.width, i * cellSize.height);
    }
    ctx.stroke();
}

function draw()
{
    // draw the colonies
    for(let i = 0; i < map.cellSize.height; i++)
    {
        for(let j = 0; j < map.cellSize.width; j++)
        {
            if(map.cells[j][i].inhabitant !== null)
            {
                let cellSize = map.cells[0][0].size;
                ctx.clearRect(j * cellSize.width, i * cellSize.height, cellSize.width, cellSize.height);

                let color = map.cells[j][i].inhabitant.civilisation.color;
                color.alpha = map.cells[j][i].inhabitant.population / map.cells[j][i].inhabitant.civilisation.density;
                ctx.fillStyle = "rgba(" + color.red + ", " + color.green + ", " + color.blue + ", " + color.alpha + ")";
                ctx.fillRect(j * cellSize.width, i * cellSize.height, cellSize.width, cellSize.height);
                // ctx.fillStyle = "black";
                // ctx.fillText(map.cells[j][i].inhabitant.population, j * cellSize.width + cellSize.width / 2, i * cellSize.height + cellSize.height/2);
            }
        }
    }
}

function updateGame()
{
    for(let i = 0; i < civilisations.length; i++)
    {
        civilisations[i].population = 0;
    }

    actionStack["attack"] = [];
    actionStack["reinforce"] = [];
    actionStack["infect"] = [];

    for(let i = 0; i < map.cellSize.height; i++)
    {
        for(let j = 0; j < map.cellSize.width; j++)
        {
            let colony = map.cells[j][i].inhabitant;

            if(colony !== null)
            {
                colony.makeAMove();
                colony.grow();

                colony.civilisation.population += colony.population;
            }
        }
    }

    console.log(actionStack); // debug

    let result = null;
    for(let i = 0; i < actionStack["attack"].length; i++)
    {
        let action = actionStack["attack"][i];
        result = action.attacker.sendPop(action.quantity, map.cells[action.defender.pos.x][action.defender.pos.y]);
        if(result < 0)
        {
            if(!action.attacker.civilisation.changeBehavior("preservativity", Math.random() * 0.005 * (Math.abs(result) / (action.defender.population - result)) + 0.005))
            {
                console.log("error: enable to update behavior");
            }
        }
    }

    for(let i = 0; i < actionStack["reinforce"].length; i++)
    {
        let action = actionStack["reinforce"][i];
        result = action.sender.sendPop(action.quantity, map.cells[action.receiver.pos.x][action.receiver.pos.y]);
    }

    for(let i = 0; i < actionStack["infect"].length; i++)
    {
        let action = actionStack["infect"][i];
        result = action.sender.sendPop(action.quantity, action.location);
    }

    totalPop = 0;
    for(let i = 0; i < civilisations.length; i++)
    {
        totalPop += civilisations[i].population;
    }

    for(let i = 0; i < civilisations.length; i++)
    {
        $("#" + civilisations[i].name.replace(" ", "_") + "_pop").text(civilisations[i].population + "(" + (civilisations[i].population / totalPop * 100).toPrecision(4) + "%)");
        $("#" + civilisations[i].name.replace(" ", "_") + "_comb").text((civilisations[i].combativity * 100).toPrecision(4) + "%");
        $("#" + civilisations[i].name.replace(" ", "_") + "_pres").text((civilisations[i].preservativity * 100).toPrecision(4) + "%");
        $("#" + civilisations[i].name.replace(" ", "_") + "_expen").text((civilisations[i].expensivity * 100).toPrecision(4) + "%");
    }
}