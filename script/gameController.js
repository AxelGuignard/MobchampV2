let viewport = {width: $(document).width(), height: $(document).height() };

$(document).ready(function()
{
    init();

    let update_id = setInterval(update, 10);
    let draw_id = setInterval(draw, 10);
});

function init()
{
    $("#field").width(viewport.width);
    $("#field").height(viewport.height);
}

function update()
{

}

function draw()
{

}