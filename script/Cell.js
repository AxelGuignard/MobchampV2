class Cell
{
    constructor(posX, posY, growthModifier, capacity)
    {
        this.posX = posX;
        this.posY = posY;
        this.inhabitant = null;
        this.size = { width: null, height: null };
        this.growthModifier = growthModifier;
        this.capacity = capacity;
    }

    resize(size)
    {
        this.size.width = size.width;
        this.size.height = size.height;
    }
}