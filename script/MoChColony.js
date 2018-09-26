class MoChColony
{
    constructor(pos, civilisation)
    {
        this.civilisation = civilisation;
        this.pos = pos;
        this.population = 1;
    }

    sendPop(quantity, cell)
    {
        if(this.population > quantity)
        {
            this.population -= quantity;

            if(cell.inhabitant !== null)
            {
                if (cell.inhabitant.civilisation === this.civilisation)
                {
                    cell.inhabitant.population += quantity;
                }
                else
                {
                    this.attack(quantity, cell);
                }
            }
            else
            {
                if(quantity > 0)
                {
                    cell.changeInhabitant(this);
                    cell.inhabitant.population = quantity;
                }
            }
        }
        else
        {
            return false;
        }
    }

    attack(quantity, cell)
    {
        if(cell.inhabitant.civilisation !== this.civilisation)
        {
            let attacker = quantity * this.civilisation.damage;
            let defender = cell.inhabitant.population * cell.inhabitant.civilisation.defence;
            let survivor = defender - attacker;

            if(survivor > 0)
            {
                cell.inhabitant.population = survivor;
            }
            else if(survivor < 0)
            {
                cell.changeInhabitant(this);
                cell.inhabitant.population = Math.abs(survivor);
            }
            else
            {
                cell.changeInhabitant(null);
            }
        }
        else
        {
            return false;
        }
    }

    scanSurroundings()
    {
        let surroudings = { empty: [], ally: [], ennemy: [] };

        if(map.cells[this.pos.x - 1] !== undefined)
        {
            if(map.cells[this.pos.x - 1][this.pos.y].inhabitant === null)
            {
                surroudings.empty.push(map.cells[this.pos.x - 1][this.pos.y]);
            }
            else if(map.cells[this.pos.x - 1][this.pos.y].inhabitant.civilisation === this.civilisation)
            {
                surroudings.ally.push(map.cells[this.pos.x - 1][this.pos.y].inhabitant);
            }
            else
            {
                surroudings.ennemy.push(map.cells[this.pos.x - 1][this.pos.y].inhabitant);
            }
        }

        if(map.cells[this.pos.x][this.pos.y - 1] !== undefined)
        {
            if(map.cells[this.pos.x][this.pos.y - 1].inhabitant === null)
            {
                surroudings.empty.push(map.cells[this.pos.x][this.pos.y - 1]);
            }
            else if(map.cells[this.pos.x][this.pos.y - 1].inhabitant.civilisation === this.civilisation)
            {
                surroudings.ally.push(map.cells[this.pos.x][this.pos.y - 1].inhabitant);
            }
            else
            {
                surroudings.ennemy.push(map.cells[this.pos.x][this.pos.y - 1].inhabitant);
            }
        }

        if(map.cells[this.pos.x + 1] !== undefined)
        {
            if(map.cells[this.pos.x + 1][this.pos.y].inhabitant === null)
            {
                surroudings.empty.push(map.cells[this.pos.x + 1][this.pos.y]);
            }
            else if(map.cells[this.pos.x + 1][this.pos.y].inhabitant.civilisation === this.civilisation)
            {
                surroudings.ally.push(map.cells[this.pos.x + 1][this.pos.y].inhabitant);
            }
            else
            {
                surroudings.ennemy.push(map.cells[this.pos.x + 1][this.pos.y].inhabitant);
            }
        }

        if(map.cells[this.pos.x][this.pos.y + 1] !== undefined)
        {
            if(map.cells[this.pos.x][this.pos.y + 1].inhabitant === null)
            {
                surroudings.empty.push(map.cells[this.pos.x][this.pos.y + 1]);
            }
            else if(map.cells[this.pos.x][this.pos.y + 1].inhabitant.civilisation === this.civilisation)
            {
                surroudings.ally.push(map.cells[this.pos.x][this.pos.y + 1].inhabitant);
            }
            else
            {
                surroudings.ennemy.push(map.cells[this.pos.x][this.pos.y + 1].inhabitant);
            }
        }

        return surroudings;
    }

    calcBattleOutcome(cell)
    {
        let allyForces = (this.population - 1) * this.civilisation.damage;
        let ennemyForces = cell.inhabitant.population * cell.inhabitant.civilisation.defence;

        return ennemyForces - allyForces < 0;
    }

    makeAMove()
    {
        let action = Math.floor(Math.random() * 100) + 1;

        if(action > 100 * this.civilisation.preservativity) // if <, the colony doesn't take any initiative (they preserve their colony)
        {
            let surroundings = this.scanSurroundings();
            let empties = surroundings.empty;
            let allies = surroundings.ally;
            let enemies = surroundings.ennemy;

            if(enemies.length > 0) // if there is an ennemy colony nearby
            {
                for(let i = 0; i < enemies.length; i++)
                {
                    action = Math.floor(Math.random() * 100) + 1;

                    let outcome = this.calcBattleOutcome(map.cells[enemies[i].pos.x][enemies[i].pos.y]);

                    // deciding if must attack depending on how favorable is the outcome and how aggressive is the colony compared to preservative
                    if(action < 100 * (outcome ? 0.1 : ((this.population - 1) - (enemies[i].population + 1)) / this.population) * (this.civilisation.aggressivity - this.civilisation.preservativity))
                    {
                        actionStack["attack"].push({ attacker: this, defender: enemies[i], quantity: outcome === -1 ? Math.round(Math.random() * (this.population - 2)) + 1 : Math.round(Math.random() * (this.population - 1) - (enemies[i].population + 1) + enemies[i].population + 1) });
                        return;
                    }
                }
            }

            if(allies.length > 0) // if there is an allied colony nearby
            {
                for(let i = 0; i < allies.length; i++)
                {
                    action = Math.floor(Math.random() * 100) + 1;

                    if (action < 100 * (1 - allies[i].population / this.civilisation.density) * (this.civilisation.solidarity - this.civilisation.expensivity))
                    {
                        actionStack["reinforce"].push({ sender: this, receiver: allies[i], quantity: Math.round(Math.random() * (this.population - 2) + 1) });
                        return;
                    }
                }
            }

            // if all cells are empty or the colony rejected the other decisions
            for(let i = 0; i < empties.length; i++)
            {
                action = Math.floor(Math.random() * 100) + 1;

                if(action <= (i === empties.length - 1 ? 100 : 50))
                {
                    actionStack["infect"].push({ sender: this, location: empties[i], quantity: Math.round(Math.random() * (this.population - this.population * this.civilisation.infectionativity - 1) + this.population * this.civilisation.infectionativity) })
                }
            }
        }
    }

    grow()
    {
        if(this.civilisation.density > this.population)
        {
            this.population += this.civilisation.growth;
        }
        else if(this.population > this.civilisation.density)
        {
            this.population -= this.civilisation.unstability;
        }
    }
}