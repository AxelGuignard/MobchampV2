class Land
{
    constructor(cellSizeX, cellSizeY)
    {
        this.size = { width: null, height: null };
        this.cellSize = { width: cellSizeX, height: cellSizeY };
        this.cells = this.generate();
    }

    generate()
    {
        let cells = [];
        for(let i = 0; i < this.cellSize.height; i++)
        {
            cells.push([]);
            for(let j = 0; j < this.cellSize.width; j++)
            {
                cells[i].push(new Cell(i, j, Math.round(Math.random() * 3 + 2), Math.round(Math.random() * 30 + 100)));
            }
        }

        return cells;
    }

    resize(size)
    {
        this.size.width = size.width;
        this.size.height = size.height;
        let cellSize = { width: this.size.width / this.cellSize.width, height: this.size.height / this.cellSize.height };
        for(let i = 0; i < this.cells.length - 1; i++)
        {
            for(let j = 0; j < this.cells[i].length - 1; j++)
            {
                this.cells[j][i].resize(cellSize);
            }
        }
    }
}