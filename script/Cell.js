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
        this.inhabitant = inhabitant;
    }

    resize(size)
    {
        this.size.width = size.width;
        this.size.height = size.height;
    }
}