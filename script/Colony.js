class Colony
{
    constructor(cell, species, population, thresholdColonize, minPopColonize, maxPopColonize, thresholdAttack, minPopAttack, maxPopAttack, thresholdTransfer, minPopTransfer, maxPopTransfer)
    {
        this.cell = cell;
        this.species = species;
        this.population = population;
        this.colonizationStats = {threshold: thresholdColonize, minPopSent: minPopColonize, maxPopSent: maxPopColonize};
        this.attackStats = {threshold: thresholdAttack, minPopSent: minPopAttack, maxPopSent: maxPopAttack};
        this.transferStats = {threshold: thresholdTransfer, minPopSent: minPopTransfer, maxPopSent: maxPopTransfer};
        this.isAlive = true;
    }

    addPopulation(quantity)
    {
        this.population += quantity;
    }

    removePopulation(quantity)
    {
        this.population -= quantity;

        if (this.population <= 0)
            this.isAlive = false;
    }

    colonize(cell, popSent = null)
    {
        if (cell.inhabitant === null)
        {
            if (popSent === null)
                popSent = Math.round(Math.random() * (this.colonizationStats.maxPopSent - this.colonizationStats.minPopSent) + this.colonizationStats.minPopSent);
            this.removePopulation(popSent);
            let newColony = this.createNewColony(cell, popSent);
            cell.inhabitant = newColony;
            return newColony;
        }
        return null;
    }

    attack(colony, popSent = null)
    {
        if (colony.isAlive)
        {
            if (popSent === null)
                popSent = Math.round(Math.random() * (this.attackStats.maxPopSent - this.attackStats.minPopSent) + this.attackStats.minPopSent);
            this.removePopulation(popSent);
            colony.removePopulation(popSent);

            if (!colony.isAlive)
            {
                let popLeft = Math.abs(colony.population);
                return this.createNewColony(colony.cell, popLeft);
            }
        }

        return null;
    }

    transfer(colony, popSent = null)
    {
        if (colony.isAlive)
        {
            if (popSent === null)
                popSent = Math.round(Math.random() * (this.transferStats.maxPopSent - this.transferStats.minPopSent) + this.transferStats.minPopSent);
            this.removePopulation(popSent);
            colony.addPopulation(popSent);
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
            childThresholdColonize = this.colonizationStats.threshold - 2;
        else if (rnd <= 30 && rnd > 10)
            childThresholdColonize = this.colonizationStats.threshold - 1;
        else if (rnd <= 70 && rnd > 30)
            childThresholdColonize = this.colonizationStats.threshold;
        else if (rnd <= 90 && rnd > 70)
            childThresholdColonize = this.colonizationStats.threshold + 1;
        else
            childThresholdColonize = this.colonizationStats.threshold + 2;

        if (childThresholdColonize < 2)
            childThresholdColonize = 2;
        if (childThresholdColonize >= cell.capacity - cell.growthModifier * 2)
            childThresholdColonize = cell.capacity - cell.growthModifier * 2;

        rnd = Math.random() * 100 + 1;
        if (rnd <= 10)
            childMinPopColonize = this.colonizationStats.minPopSent - 2;
        else if (rnd <= 30 && rnd > 10)
            childMinPopColonize = this.colonizationStats.minPopSent - 1;
        else if (rnd <= 70 && rnd > 30)
            childMinPopColonize = this.colonizationStats.minPopSent;
        else if (rnd <= 90 && rnd > 70)
            childMinPopColonize = this.colonizationStats.minPopSent + 1;
        else
            childMinPopColonize = this.colonizationStats.minPopSent + 2;

        if (childMinPopColonize < 1)
            childMinPopColonize = 1;
        if (childMinPopColonize >= childThresholdColonize)
            childMinPopColonize = childThresholdColonize - 1;

        rnd = Math.random() * 100 + 1;
        if (rnd <= 10)
            childMaxPopColonize = this.colonizationStats.maxPopSent - 2;
        else if (rnd <= 30 && rnd > 10)
            childMaxPopColonize = this.colonizationStats.maxPopSent - 1;
        else if (rnd <= 70 && rnd > 30)
            childMaxPopColonize = this.colonizationStats.maxPopSent;
        else if (rnd <= 90 && rnd > 70)
            childMaxPopColonize = this.colonizationStats.maxPopSent + 1;
        else
            childMaxPopColonize = this.colonizationStats.maxPopSent + 2;

        if (childMaxPopColonize < childMinPopColonize)
            childMaxPopColonize = childMinPopColonize;
        if (childMaxPopColonize >= childThresholdColonize)
            childMaxPopColonize = childThresholdColonize - 1;


        rnd = Math.random() * 100 + 1;
        if (rnd <= 10)
            childThresholdAttack = this.attackStats.threshold - 2;
        else if (rnd <= 30 && rnd > 10)
            childThresholdAttack = this.attackStats.threshold - 1;
        else if (rnd <= 70 && rnd > 30)
            childThresholdAttack = this.attackStats.threshold;
        else if (rnd <= 90 && rnd > 70)
            childThresholdAttack = this.attackStats.threshold + 1;
        else
            childThresholdAttack = this.attackStats.threshold + 2;

        if (childThresholdAttack < 2)
            childThresholdAttack = 2;
        if (childThresholdAttack >= cell.capacity - cell.growthModifier * 2)
            childThresholdAttack = cell.capacity - cell.growthModifier * 2;

        rnd = Math.random() * 100 + 1;
        if (rnd <= 10)
            childMinPopAttack = this.attackStats.minPopSent - 2;
        else if (rnd <= 30 && rnd > 10)
            childMinPopAttack = this.attackStats.minPopSent - 1;
        else if (rnd <= 70 && rnd > 30)
            childMinPopAttack = this.attackStats.minPopSent;
        else if (rnd <= 90 && rnd > 70)
            childMinPopAttack = this.attackStats.minPopSent + 1;
        else
            childMinPopAttack = this.attackStats.minPopSent + 2;

        if (childMinPopAttack < 1)
            childMinPopAttack = 1;
        if (childMinPopAttack >= childThresholdAttack)
            childMinPopAttack = childThresholdAttack - 1;

        rnd = Math.random() * 100 + 1;
        if (rnd <= 10)
            childMaxPopAttack = this.attackStats.maxPopSent - 2;
        else if (rnd <= 30 && rnd > 10)
            childMaxPopAttack = this.attackStats.maxPopSent - 1;
        else if (rnd <= 70 && rnd > 30)
            childMaxPopAttack = this.attackStats.maxPopSent;
        else if (rnd <= 90 && rnd > 70)
            childMaxPopAttack = this.attackStats.maxPopSent + 1;
        else
            childMaxPopAttack = this.attackStats.maxPopSent + 2;

        if (childMaxPopAttack < childMinPopAttack)
            childMaxPopAttack = childMinPopAttack;
        if (childMaxPopAttack >= childThresholdAttack)
            childMaxPopAttack = childThresholdAttack - 1;

        rnd = Math.random() * 100 + 1;
        if (rnd <= 10)
            childThresholdTransfer = this.transferStats.threshold - 2;
        else if (rnd <= 30 && rnd > 10)
            childThresholdTransfer = this.transferStats.threshold - 1;
        else if (rnd <= 70 && rnd > 30)
            childThresholdTransfer = this.transferStats.threshold;
        else if (rnd <= 90 && rnd > 70)
            childThresholdTransfer = this.transferStats.threshold + 1;
        else
            childThresholdTransfer = this.transferStats.threshold + 2;

        if (childThresholdTransfer < 2)
            childThresholdTransfer = 2;
        if (childThresholdTransfer >= cell.capacity - cell.growthModifier * 2)
            childThresholdTransfer = cell.capacity - cell.growthModifier * 2;

        rnd = Math.random() * 100 + 1;
        if (rnd <= 10)
            childMinPopTransfer = this.transferStats.minPopSent - 2;
        else if (rnd <= 30 && rnd > 10)
            childMinPopTransfer = this.transferStats.minPopSent - 1;
        else if (rnd <= 70 && rnd > 30)
            childMinPopTransfer = this.transferStats.minPopSent;
        else if (rnd <= 90 && rnd > 70)
            childMinPopTransfer = this.transferStats.minPopSent + 1;
        else
            childMinPopTransfer = this.transferStats.minPopSent + 2;

        if (childMinPopTransfer < 1)
            childMinPopTransfer = 1;
        if (childMinPopTransfer >= childThresholdTransfer)
            childMinPopTransfer = childThresholdTransfer - 1;

        rnd = Math.random() * 100 + 1;
        if (rnd <= 10)
            childMaxPopTransfer = this.transferStats.maxPopSent - 2;
        else if (rnd <= 30 && rnd > 10)
            childMaxPopTransfer = this.transferStats.maxPopSent - 1;
        else if (rnd <= 70 && rnd > 30)
            childMaxPopTransfer = this.transferStats.maxPopSent;
        else if (rnd <= 90 && rnd > 70)
            childMaxPopTransfer = this.transferStats.maxPopSent + 1;
        else
            childMaxPopTransfer = this.transferStats.maxPopSent + 2;

        if (childMaxPopTransfer < childMinPopTransfer)
            childMaxPopTransfer = childMinPopTransfer;
        if (childMaxPopTransfer >= childThresholdTransfer)
            childMaxPopTransfer = childThresholdTransfer - 1;

        return new Colony(cell, this.species, population, childThresholdColonize, childMinPopColonize, childMaxPopColonize, childThresholdAttack, childMinPopAttack, childMaxPopAttack, childThresholdTransfer, childMinPopTransfer, childMaxPopTransfer);
    }

    grow()
    {
        this.addPopulation(this.cell.growthModifier);
    }
    
    sporeExplosion()
    {
        let neighbours = this.scanSurroundings();
        let neighboursLeft = neighbours.ally.length + neighbours.empty.length + neighbours.enemy.length;
        let popSent;
        let newColonies = [];

        for (let empty of neighbours.empty)
        {
            popSent = Math.floor(this.population / neighboursLeft);
            let newColony = this.colonize(empty, popSent);
            if (newColony !== null)
                newColonies.push(newColony);
            neighboursLeft--;
        }

        for (let enemy of neighbours.enemy)
        {
            popSent = Math.floor(this.population / neighboursLeft);
            let newColony = this.attack(enemy, popSent);
            if (newColony !== null)
                newColonies.push(newColony);
            neighboursLeft--;
        }

        for (let ally of neighbours.ally)
        {
            popSent = Math.floor(this.population / neighboursLeft);
            this.transfer(ally, popSent);
            neighboursLeft--;
        }

        return newColonies;
    }
}