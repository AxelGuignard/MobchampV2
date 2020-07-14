class Colony
{
    constructor(cell, species, population, thresholdColonize, minPopColonize, maxPopColonize, thresholdAttack, minPopAttack, maxPopAttack, thresholdTransfer, minPopTransfer, maxPopTransfer)
    {
        this.cell = cell;
        this.species = species;
        this.population = population;
        this.thresholdColonize = thresholdColonize;
        this.minPopColonize = minPopColonize;
        this.maxPopColonize = maxPopColonize;
        this.thresholdAttack = thresholdAttack;
        this.minPopAttack = minPopAttack;
        this.maxPopAttack = maxPopAttack;
        this.thresholdTransfer = thresholdTransfer;
        this.minPopTransfer = minPopTransfer;
        this.maxPopTransfer = maxPopTransfer;
    }

    colonize(cell)
    {
        let popSent = Math.round(Math.random() * (this.maxPopColonize - this.minPopColonize) + this.minPopColonize);
        this.population -= popSent;
        cell.inhabitant = this.createNewColony(cell, popSent);
    }

    attack(colony)
    {
        let popSent = Math.round(Math.random() * (this.maxPopAttack - this.minPopAttack) + this.minPopAttack);
        this.population -= popSent;
        colony.population -= Math.round(popSent * 1.5);

        if (colony.population <= 0)
        {
            let popLeft = Math.round(Math.abs(colony.population) / 1.5);
            colony.cell.inhabitant = this.createNewColony(colony.cell, popLeft);
            colony.cell = null;
        }
    }

    transfer(colony)
    {
        let popSent = Math.round(Math.random() * (this.maxPopTransfer - this.minPopTransfer) + this.minPopTransfer);
        this.population -= popSent;
        colony.population += popSent;

        if (colony.population >= colony.cell.capacity)
        {
            colony.sporeExplosion();
        }
    }

    scanSurroundings()
    {
        let surroundings = { empty: [], ally: [], enemy: [] };

        if(map.cells[this.cell.posX - 1] !== undefined)
        {
            if(map.cells[this.cell.posX - 1][this.cell.posY].inhabitant === null)
            {
                surroundings.empty.push(map.cells[this.cell.posX - 1][this.cell.posY]);
            }
            else if(map.cells[this.cell.posX - 1][this.cell.posY].inhabitant.species === this.species)
            {
                surroundings.ally.push(map.cells[this.cell.posX - 1][this.cell.posY].inhabitant);
            }
            else
            {
                surroundings.enemy.push(map.cells[this.cell.posX - 1][this.cell.posY].inhabitant);
            }
        }

        if(map.cells[this.cell.posX][this.cell.posY - 1] !== undefined)
        {
            if(map.cells[this.cell.posX][this.cell.posY - 1].inhabitant === null)
            {
                surroundings.empty.push(map.cells[this.cell.posX][this.cell.posY - 1]);
            }
            else if(map.cells[this.cell.posX][this.cell.posY - 1].inhabitant.species === this.species)
            {
                surroundings.ally.push(map.cells[this.cell.posX][this.cell.posY - 1].inhabitant);
            }
            else
            {
                surroundings.enemy.push(map.cells[this.cell.posX][this.cell.posY - 1].inhabitant);
            }
        }

        if(map.cells[this.cell.posX + 1] !== undefined)
        {
            if(map.cells[this.cell.posX + 1][this.cell.posY].inhabitant === null)
            {
                surroundings.empty.push(map.cells[this.cell.posX + 1][this.cell.posY]);
            }
            else if(map.cells[this.cell.posX + 1][this.cell.posY].inhabitant.species === this.species)
            {
                surroundings.ally.push(map.cells[this.cell.posX + 1][this.cell.posY].inhabitant);
            }
            else
            {
                surroundings.enemy.push(map.cells[this.cell.posX + 1][this.cell.posY].inhabitant);
            }
        }

        if(map.cells[this.cell.posX][this.cell.posY + 1] !== undefined)
        {
            if(map.cells[this.cell.posX][this.cell.posY + 1].inhabitant === null)
            {
                surroundings.empty.push(map.cells[this.cell.posX][this.cell.posY + 1]);
            }
            else if(map.cells[this.cell.posX][this.cell.posY + 1].inhabitant.species === this.species)
            {
                surroundings.ally.push(map.cells[this.cell.posX][this.cell.posY + 1].inhabitant);
            }
            else
            {
                surroundings.enemy.push(map.cells[this.cell.posX][this.cell.posY + 1].inhabitant);
            }
        }

        return surroundings;
    }

    makeAMove()
    {
        let neighbors = this.scanSurroundings();

        if(neighbors.empty.length > 0 && this.population >= this.thresholdColonize)
        {
            this.colonize(neighbors.empty[0]);
        }
        else if (neighbors.enemy.length > 0 && this.population >= this.thresholdAttack)
        {
            this.attack(neighbors.enemy[0]);
        }
        else if (neighbors.ally.length > 0 && this.population >= this.thresholdTransfer)
        {
            this.transfer(neighbors.ally[0]);
        }
    }

    createNewColony(cell, population)
    {
        let childThresholdColonize;
        let childMinPopColonize;
        let childMaxPopColonize;
        let childThresholdAttack;
        let childMinPopAttack;
        let childMaxPopAttack;
        let childThresholdTransfer;
        let childMinPopTransfer;
        let childMaxPopTransfer;

        let rnd = Math.random() * 100 + 1;
        if (rnd <= 10)
            childThresholdColonize = this.thresholdColonize - 2;
        else if (rnd <= 30 && rnd > 10)
            childThresholdColonize = this.thresholdColonize - 1;
        else if (rnd <= 70 && rnd > 30)
            childThresholdColonize = this.thresholdColonize;
        else if (rnd <= 90 && rnd > 70)
            childThresholdColonize = this.thresholdColonize + 1;
        else
            childThresholdColonize = this.thresholdColonize + 2;

        if (childThresholdColonize < 2)
            childThresholdColonize = 2;
        if (childThresholdColonize >= cell.capacity - cell.growthModifier * 2)
            childThresholdColonize = cell.capacity - cell.growthModifier * 2;

        rnd = Math.random() * 100 + 1;
        if (rnd <= 10)
            childMinPopColonize = this.minPopColonize - 2;
        else if (rnd <= 30 && rnd > 10)
            childMinPopColonize = this.minPopColonize - 1;
        else if (rnd <= 70 && rnd > 30)
            childMinPopColonize = this.minPopColonize;
        else if (rnd <= 90 && rnd > 70)
            childMinPopColonize = this.minPopColonize + 1;
        else
            childMinPopColonize = this.minPopColonize + 2;

        if (childMinPopColonize < 1)
            childMinPopColonize = 1;
        if (childMinPopColonize >= childThresholdColonize)
            childMinPopColonize = childThresholdColonize - 1;

        rnd = Math.random() * 100 + 1;
        if (rnd <= 10)
            childMaxPopColonize = this.maxPopColonize - 2;
        else if (rnd <= 30 && rnd > 10)
            childMaxPopColonize = this.maxPopColonize - 1;
        else if (rnd <= 70 && rnd > 30)
            childMaxPopColonize = this.maxPopColonize;
        else if (rnd <= 90 && rnd > 70)
            childMaxPopColonize = this.maxPopColonize + 1;
        else
            childMaxPopColonize = this.maxPopColonize + 2;

        if (childMaxPopColonize < childMinPopColonize)
            childMaxPopColonize = childMinPopColonize;
        if (childMaxPopColonize >= childThresholdColonize)
            childMaxPopColonize = childThresholdColonize - 1;


        rnd = Math.random() * 100 + 1;
        if (rnd <= 10)
            childThresholdAttack = this.thresholdAttack - 2;
        else if (rnd <= 30 && rnd > 10)
            childThresholdAttack = this.thresholdAttack - 1;
        else if (rnd <= 70 && rnd > 30)
            childThresholdAttack = this.thresholdAttack;
        else if (rnd <= 90 && rnd > 70)
            childThresholdAttack = this.thresholdAttack + 1;
        else
            childThresholdAttack = this.thresholdAttack + 2;

        if (childThresholdAttack < 2)
            childThresholdAttack = 2;
        if (childThresholdAttack >= cell.capacity - cell.growthModifier * 2)
            childThresholdAttack = cell.capacity - cell.growthModifier * 2;

        rnd = Math.random() * 100 + 1;
        if (rnd <= 10)
            childMinPopAttack = this.minPopAttack - 2;
        else if (rnd <= 30 && rnd > 10)
            childMinPopAttack = this.minPopAttack - 1;
        else if (rnd <= 70 && rnd > 30)
            childMinPopAttack = this.minPopAttack;
        else if (rnd <= 90 && rnd > 70)
            childMinPopAttack = this.minPopAttack + 1;
        else
            childMinPopAttack = this.minPopAttack + 2;

        if (childMinPopAttack < 1)
            childMinPopAttack = 1;
        if (childMinPopAttack >= childThresholdAttack)
            childMinPopAttack = childThresholdAttack - 1;

        rnd = Math.random() * 100 + 1;
        if (rnd <= 10)
            childMaxPopAttack = this.maxPopAttack - 2;
        else if (rnd <= 30 && rnd > 10)
            childMaxPopAttack = this.maxPopAttack - 1;
        else if (rnd <= 70 && rnd > 30)
            childMaxPopAttack = this.maxPopAttack;
        else if (rnd <= 90 && rnd > 70)
            childMaxPopAttack = this.maxPopAttack + 1;
        else
            childMaxPopAttack = this.maxPopAttack + 2;

        if (childMaxPopAttack < childMinPopAttack)
            childMaxPopAttack = childMinPopAttack;
        if (childMaxPopAttack >= childThresholdAttack)
            childMaxPopAttack = childThresholdAttack - 1;

        rnd = Math.random() * 100 + 1;
        if (rnd <= 10)
            childThresholdTransfer = this.thresholdTransfer - 2;
        else if (rnd <= 30 && rnd > 10)
            childThresholdTransfer = this.thresholdTransfer - 1;
        else if (rnd <= 70 && rnd > 30)
            childThresholdTransfer = this.thresholdTransfer;
        else if (rnd <= 90 && rnd > 70)
            childThresholdTransfer = this.thresholdTransfer + 1;
        else
            childThresholdTransfer = this.thresholdTransfer + 2;

        if (childThresholdTransfer < 2)
            childThresholdTransfer = 2;
        if (childThresholdTransfer >= cell.capacity - cell.growthModifier * 2)
            childThresholdTransfer = cell.capacity - cell.growthModifier * 2;

        rnd = Math.random() * 100 + 1;
        if (rnd <= 10)
            childMinPopTransfer = this.minPopTransfer - 2;
        else if (rnd <= 30 && rnd > 10)
            childMinPopTransfer = this.minPopTransfer - 1;
        else if (rnd <= 70 && rnd > 30)
            childMinPopTransfer = this.minPopTransfer;
        else if (rnd <= 90 && rnd > 70)
            childMinPopTransfer = this.minPopTransfer + 1;
        else
            childMinPopTransfer = this.minPopTransfer + 2;

        if (childMinPopTransfer < 1)
            childMinPopTransfer = 1;
        if (childMinPopTransfer >= childThresholdTransfer)
            childMinPopTransfer = childThresholdTransfer - 1;

        rnd = Math.random() * 100 + 1;
        if (rnd <= 10)
            childMaxPopTransfer = this.maxPopTransfer - 2;
        else if (rnd <= 30 && rnd > 10)
            childMaxPopTransfer = this.maxPopTransfer - 1;
        else if (rnd <= 70 && rnd > 30)
            childMaxPopTransfer = this.maxPopTransfer;
        else if (rnd <= 90 && rnd > 70)
            childMaxPopTransfer = this.maxPopTransfer + 1;
        else
            childMaxPopTransfer = this.maxPopTransfer + 2;

        if (childMaxPopTransfer < childMinPopTransfer)
            childMaxPopTransfer = childMinPopTransfer;
        if (childMaxPopTransfer >= childThresholdTransfer)
            childMaxPopTransfer = childThresholdTransfer - 1;

        return new Colony(cell, this.species, population, childThresholdColonize, childMinPopColonize, childMaxPopColonize, childThresholdAttack, childMinPopAttack, childMaxPopAttack, childThresholdTransfer, childMinPopTransfer, childMaxPopTransfer);
    }

    grow()
    {
        this.population += this.cell.growthModifier;
        
        if (this.population >= this.cell.capacity)
        {
            this.sporeExplosion();
        }
    }
    
    sporeExplosion()
    {
        let neighbours = this.scanSurroundings();
        let neighboursLeft = neighbours.ally.length + neighbours.empty.length + neighbours.enemy.length;
        let popSent;

        for (let empty of neighbours.empty)
        {
            popSent = Math.floor(this.population / neighboursLeft);
            this.population -= popSent;
            empty.inhabitant = this.createNewColony(empty, popSent);
            neighboursLeft--;
        }

        for (let enemy of neighbours.enemy)
        {
            popSent = Math.floor(this.population / neighboursLeft);
            this.population -= popSent;
            enemy.inhabitant.population -= Math.round(popSent * 1.5);

            if (enemy.inhabitant.population <= 0)
            {
                let popLeft = Math.round(Math.abs(enemy.inhabitant.population) / 1.5);
                enemy.inhabitant.cell.inhabitant = this.createNewColony(enemy, popLeft);
                enemy.inhabitant.cell = null;
            }
            neighboursLeft--;
        }

        for (let ally of neighbours.ally)
        {
            popSent = Math.floor(this.population / neighboursLeft);
            this.population -= popSent;
            ally.inhabitant.population += popSent;
            neighboursLeft--;
        }

        this.cell.inhabitant = null;
        this.cell = null;
    }
}