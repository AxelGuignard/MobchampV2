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

let time = 1020 - $("#speed").val();

let debug = false;

$(document).ready(function()
{
    init();
    if(debug)
    {
        $("body").on("click", function ()
        {
            update(); // debug
        });
    }
});

function init()
{
    // create the canvas and webgl rendering context
    ctx.canvas.width = viewport.width * 0.8;
    ctx.canvas.height = viewport.height * 0.93;

    $("#display").width(viewport.width * 1 - ctx.canvas.width).height(ctx.canvas.height);
    $("#controls").height(viewport.height * 1 - ctx.canvas.height);
    $("#speed").width(viewport.width * 0.2);

    // create the map and size it to viewport size
    map = new Battlefield(30, 30);
    map.resize({ width: ctx.canvas.width, height: ctx.canvas.height });

    // create the civilisations
    civilisations.push(new MoChCivilisation("The blues", { red: 42, green: 20, blue: 225, alpha: 1}));
    colonies.push([]);
    civilisations.push(new MoChCivilisation("The reds", { red: 225, green: 26, blue: 20, alpha: 1}));
    colonies.push([]);
    civilisations.push(new MoChCivilisation("The greens", { red: 1, green: 225, blue: 28, alpha: 1}));
    colonies.push([]);
    civilisations.push(new MoChCivilisation("The yellows", { red: 247, green: 199, blue: 35, alpha: 1}));
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

        $(".d_civ").height($("#display").height() / civilisations.length);
    }

    setTimeout(update, time);
    $("#speed").on("change", function()
    {
        time = 1020 - $("#speed").val();
    });

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
    if(!debug)
    {
        setTimeout(update, time);
    }
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
                ctx.fillStyle = "black";
                ctx.fillText(map.cells[j][i].inhabitant.population, j * cellSize.width + cellSize.width / 2, i * cellSize.height + cellSize.height/2);
            }
        }
    }
}

function updateGame()
{
    for(let i = 0; i < civilisations.length; i++)
    {
        civilisations[i].population = 0;
        civilisations[i].potential = { empty: 0, occupied: 0, owned: 0 };
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
                try
                {
                    colony.makeAMove();
                }
                catch(e)
                {
                    console.log(e.message);
                }
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
        try
        {
            result = action.attacker.sendPop(action.quantity, map.cells[action.defender.pos.x][action.defender.pos.y]);
        }
        catch(e)
        {
            console.log(e.message);
        }

        if(result < 0)
        {
            try
            {
                action.attacker.civilisation.changeBehavior("preservativity", Math.random() * 0.005 * (1 - Math.abs(result) / (action.defender.population - result)) + 0.005);
                action.defender.civilisation.changeBehavior("combativity", Math.random() * 0.005 * (1 - Math.abs(result) / (action.defender.population - result)) + 0.005);
            }
            catch(e)
            {
                console.log(e.message);
            }
        }
        else
        {
            try
            {
                action.attacker.civilisation.changeBehavior("combativity", Math.random() * 0.0025 * (1 - result / action.attacker.population + result) + 0.0025);
                action.defender.civilisation.changeBehavior("preservativity", Math.random() * 0.0025 * (1 - result / action.attacker.population + result) + 0.0025);
            }
            catch(e)
            {
                console.log(e.message);
            }
        }
    }

    for(let i = 0; i < actionStack["reinforce"].length; i++)
    {
        let action = actionStack["reinforce"][i];
        try
        {
            result = action.sender.sendPop(action.quantity, map.cells[action.receiver.pos.x][action.receiver.pos.y]);
        }
        catch(e)
        {
            console.log(e.message);
        }
    }

    for(let i = 0; i < actionStack["infect"].length; i++)
    {
        let action = actionStack["infect"][i];
        try
        {
            result = action.sender.sendPop(action.quantity, action.location);
        }
        catch(e)
        {
            console.log(e.message);
        }
    }

    totalPop = 0;
    for(let i = 0; i < civilisations.length; i++)
    {
        totalPop += civilisations[i].population;
    }

    for(let i = 0; i < map.cellSize.height; i++)
    {
        for(let j = 0; j < map.cellSize.width; j++)
        {
            let colony = map.cells[j][i].inhabitant;

            if(colony !== null)
            {
                for(let k = 0; k < civilisations.length; k++)
                {
                    if(colony.civilisation !== civilisations[k])
                    {
                        civilisations[k].potential.occupied++;
                    }
                    else
                    {
                        civilisations[k].potential.owned++;
                    }
                }
            }
            else
            {
                for(let k = 0; k < civilisations.length; k++)
                {
                    civilisations[k].potential.empty++;
                }
            }
        }
    }

    for(let i = 0; i < civilisations.length; i++)
    {
        civilisations[i].changeBehavior("expensivity", (civilisations[i].potential.empty / (map.cellSize.height * map.cellSize.width)) * 0.01);
        civilisations[i].changeBehavior("combativity", (civilisations[i].potential.occupied / (map.cellSize.height * map.cellSize.width)) * 0.01);
        civilisations[i].changeBehavior("preservativity", (civilisations[i].potential.owned / (map.cellSize.height * map.cellSize.width)) * 0.005);
    }

    // display civilisations informations
    for(let i = 0; i < civilisations.length; i++)
    {
        $("#" + civilisations[i].name.replace(" ", "_") + "_pop").text(civilisations[i].population + "(" + (civilisations[i].population / totalPop * 100).toPrecision(4) + "%)");
        $("#" + civilisations[i].name.replace(" ", "_") + "_comb").text((civilisations[i].combativity * 100).toPrecision(4) + "%");
        $("#" + civilisations[i].name.replace(" ", "_") + "_pres").text((civilisations[i].preservativity * 100).toPrecision(4) + "%");
        $("#" + civilisations[i].name.replace(" ", "_") + "_expen").text((civilisations[i].expensivity * 100).toPrecision(4) + "%");
    }
}