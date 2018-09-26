let viewport = {width: $(document).width(), height: $(document).height() };
let map = null;

let canvas = document.getElementById("field");
let ctx = canvas.getContext("2d");

let civilisations = [];
let colonies = [];

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
    //ctx.viewport(0, 0, $(document).width(), $(document).height());
    ctx.canvas.width = viewport.width;
    ctx.canvas.height = viewport.height;

    // create the map and size it to viewport size
    map = new Map(10, 10);
    map.resize(viewport);

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
                ctx.fillStyle = "black";
                ctx.fillText(map.cells[j][i].inhabitant.population, j * cellSize.width + cellSize.width / 2, i * cellSize.height + cellSize.height/2);
            }
        }
    }
}

function updateGame()
{
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
            }
        }
    }

    console.log(actionStack);

    for(let i = 0; i < actionStack["attack"].length; i++)
    {
        let action = actionStack["attack"][i];
        action.attacker.sendPop(action.quantity, map.cells[action.defender.pos.x][action.defender.pos.y]);
    }

    for(let i = 0; i < actionStack["reinforce"].length; i++)
    {
        let action = actionStack["reinforce"][i];
        action.sender.sendPop(action.quantity, map.cells[action.receiver.pos.x][action.receiver.pos.y]);
    }

    for(let i = 0; i < actionStack["infect"].length; i++)
    {
        let action = actionStack["infect"][i];
        action.sender.sendPop(action.quantity, action.location);
    }
}