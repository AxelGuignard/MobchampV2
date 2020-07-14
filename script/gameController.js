let viewport = {width: $(document).width(), height: $(document).height() };
let map = null;

let canvas = document.getElementById("viewport");
let ctx = canvas.getContext("2d");

let species = [];
let colonies = [];
let totalPop = 0;

let time = 1020 - $("#speed").val();

let debug = true;

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
    map = new Land(30, 30);
    map.resize({ width: ctx.canvas.width, height: ctx.canvas.height });

    // create the species
    species.push(new Species("The blues", { red: 42, green: 20, blue: 225, alpha: 1}));
    species.push(new Species("The reds", { red: 225, green: 26, blue: 20, alpha: 1}));
    species.push(new Species("The greens", { red: 1, green: 225, blue: 28, alpha: 1}));
    species.push(new Species("The yellows", { red: 247, green: 199, blue: 35, alpha: 1}));

    let pos = { x: null, y: null };
    let x = Math.floor(Math.random() * map.cellSize.width);
    let y = Math.floor(Math.random() * map.cellSize.height);
    for(let i = 0; i < species.length; i++)
    {
        while(x === pos.x && y === pos.y)
        {
            x = Math.floor(Math.random() * map.cellSize.width);
            y = Math.floor(Math.random() * map.cellSize.height);
        }
        pos.x = x;
        pos.y = y;

        let thresholdColonize = Math.floor(Math.random() * (map.cells[x][y].capacity - 2) + 2);
        let minPopColonize = Math.floor(Math.random() * thresholdColonize + 1);
        let maxPopColonize = Math.floor(Math.random() * (thresholdColonize - minPopColonize + 1) + minPopColonize);
        let thresholdAttack = Math.floor(Math.random() * (map.cells[x][y].capacity - 2) + 2);
        let minPopAttack = Math.floor(Math.random() * thresholdAttack + 1);
        let maxPopAttack = Math.floor(Math.random() * (thresholdAttack - minPopAttack + 1) + minPopAttack);
        let thresholdTransfer = Math.floor(Math.random() * (map.cells[x][y].capacity - 2) + 2);
        let minPopTransfer = Math.floor(Math.random() * thresholdTransfer + 1);
        let maxPopTransfer = Math.floor(Math.random() * (thresholdTransfer - minPopTransfer + 1) + minPopTransfer);
        let colony = new Colony(map.cells[x][y], species[i], 1, thresholdColonize, minPopColonize, maxPopColonize, thresholdAttack, minPopAttack, maxPopAttack, thresholdTransfer, minPopTransfer, maxPopTransfer);
        colonies.push(colony);
        map.cells[x][y].inhabitant = colony;

        $("#display").append(
            "<table id='" + species[i].name + "' class='d_civ'>" +
                "<tr>" +
                    "<td>" +
                        "<h2>" + species[i].name + "</h2>" +
                    "</td>" +
                    "<td>" +
                        "<span style='display: block; width: 30%; height: 30%; border: 2px solid black; background-color: rgba(" + species[i].color.red + ", " + species[i].color.green + ", " + species[i].color.blue + ", 1);'" +
                    "</td>" +
                "</tr>" +
                "<tr>" +
                    "<td>" +
                        "<span>Population:</span>" +
                    "</td>" +
                    "<td style='text-align: right;'>" +
                        "<span id='" + species[i].name.replace(" ", "_") + "_pop' class='d_attr'></span>" +
                    "</td>" +
                "</tr>" +
            "</table>");

        $(".d_civ").height($("#display").height() / species.length);
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
        let updateTimeout = setTimeout(update, time);
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

                let color = map.cells[j][i].inhabitant.species.color;
                color.alpha = map.cells[j][i].inhabitant.population / map.cells[j][i].capacity;
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
    for (let _species of species)
    {
        _species.population = 0;
    }

    for(let i = 0; i < map.cellSize.height; i++)
    {
        for(let j = 0; j < map.cellSize.width; j++)
        {
            let colony = map.cells[j][i].inhabitant;

            if(colony !== null)
            {
                colony.makeAMove();
                if (colony.cell === null)
                {
                    colonies.splice(colonies.indexOf(colony), 1);
                }
                else
                {
                    colony.grow();
                    colony.species.population += colony.population;
                }
            }
        }
    }

    for (let colony of colonies)
    {
        if (colony.cell === null)
        {
            colonies.splice(colonies.indexOf(colony), 1);
        }
    }

    totalPop = 0
    for (let _species of species)
    {
        totalPop += _species.population;
    }
    // display species informations
    for(let i = 0; i < species.length; i++)
    {
        $("#" + species[i].name.replace(" ", "_") + "_pop").text(species[i].population + "(" + (species[i].population / totalPop * 100).toPrecision(4) + "%)");
    }
}