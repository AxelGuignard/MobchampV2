let viewport = {width: $(document).width(), height: $(document).height() };
let map = null;

let canvas = document.getElementById("field");
let ctx = canvas.getContext("2d");

let civilisations = [];
let colonies = [];

$(document).ready(function()
{
    init();
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
    civilisations.push(new MoChCivilisation("The blues", "#2a14e1"));
    colonies.push([]);
    civilisations.push(new MoChCivilisation("The reds", "#e11a14"));
    colonies.push([]);
    civilisations.push(new MoChCivilisation("The greens", "#01e11c"));
    colonies.push([]);

    let pos = { x: null, y: null };
    let x = Math.floor(Math.random() * map.cellSize.width) + 1;
    let y = Math.floor(Math.random() * map.cellSize.height) + 1;
    for(let i = 0; i < civilisations.length; i++)
    {
        while(x === pos.x && y === pos.y)
        {
            x = Math.floor(Math.random() * map.cellSize.width) + 1;
            y = Math.floor(Math.random() * map.cellSize.height) + 1;
        }

        pos.x = x;
        pos.y = y;
        colonies[i].push(new MoChColony(pos, civilisations[i]));
    }

    let update_id = setInterval(update, 20);
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

function draw()
{
    //ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

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

    // draw the colonies
    for(let i = 0; i < map.cellSize.height; i++)
    {
        for(let j = 0; j < map.cellSize.width; j++)
        {
            if(map.cells[j][i].inhabitant !== null)
            {
                ctx.fillStyle = map.cells[j][i].inhabitant.civilisation.color;
                ctx.fillRect(j * cellSize.width, i * cellSize.height, j * cellSize.width + cellSize.width, i * cellSize.height + cellSize.height);
            }
        }
    }

    ctx.stroke();
}

function updateGame()
{
    for(let i = 0; i < map.cellSize.height; i++)
    {
        for(let j = 0; j < map.cellSize.width; j++)
        {
            let colony = map.cells[j][i].inhabitant;

            if(colony !== null)
            {
                let action = Math.floor(Math.random() * 100) + 1;

                if(action > 100 * colony.civilisation.preservativity) // if <, the colony doesn't take any initiative (they preserve their colony)
                {
                    let ennemies = null;

                    if(ennemies = colony.scanSurroundings().ennemy !== []) // if there is an ennemy colony nearby
                    {
                        for(let ii = 0; ii < ennemies.length; ii++)
                        {
                            action = Math.floor(Math.random() * 100) + 1;

                            let outcome = colony.calcBattleOutcome(ennemies[ii]);

                            // deciding if must attack depending on how favorable is the outcome and how aggressive is the colony compared to preservative
                            if(action < 100 * (outcome === -1 ? 0.1 : (outcome.max - outcome.min) / colony.population) * (colony.civilisation.aggressivity - colony.civilisation.preservativity))
                            {
                                colony.sendPop(outcome === -1 ? Math.floor(Math.random() * colony.population) + 1 : Math.floor(Math.random() * (outcome.max + 1)) + outcome.min, ennemies[ii]);
                                break;
                            }
                        }
                    }
                    else
                    {

                    }
                }

                if(colony.civilisation.density > colony.population)
                {
                    colony.population += colony.civilisation.growth;
                }
                else if(colony.population > colony.civilisation.density)
                {
                    colony.population -= colony.civilisation.unstability;
                }
            }
        }
    }
}