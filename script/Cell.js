class Cell
{
    constructor(posX, posY)
    {
        this.posX = posX;
        this.posY = posY;
        this.inhabitant = null;
        this.size = { width: null, height: null };
    }

    changeInhabitant(inhabitant)
    {
        this.inhabitant = new MoChColony({ x: this.posX, y: this.posY }, inhabitant.civilisation);
    }

    resize(size)
    {
        this.size.width = size.width;
        this.size.height = size.height;
    }
}