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
                    return cell.inhabitant.population - this.civilisation.density;
                }
                else
                {
                    return this.attack(quantity, cell);
                }
            }
            else
            {
                if(quantity > 0)
                {
                    cell.changeInhabitant(this);
                    cell.inhabitant.population = quantity;
                    return true;
                }
                else
                {
                    throw new Error("Can't infect a cell by sending less than 1 population\r\nat: Colony{x: " + this.pos.x + ",y: " + this.pos.y + "}");
                }
            }
        }
        else
        {
            throw new Error("Can't send more than total population\r\nat: Colony{x: " + this.pos.x + ",y: " + this.pos.y + "}");
        }
    }

    attack(quantity, cell)
    {
        if(cell.inhabitant !== null)
        {
            if(cell.inhabitant.civilisation !== this.civilisation)
            {
                let attackPower = quantity * this.civilisation.damage;
                let defencePower = cell.inhabitant.population * cell.inhabitant.civilisation.defence;
                let remainingPower = defencePower - attackPower;
                let survivor;
                if(remainingPower > 0)
                {
                    survivor = Math.round(remainingPower / cell.inhabitant.civilisation.defence);
                }
                else
                {
                    survivor = Math.round(remainingPower / this.civilisation.damage);
                }
                let result = 0;

                if(survivor > 0)
                {
                    result = cell.inhabitant.population - survivor; // nbr of population lost by defender
                    cell.inhabitant.population = survivor;
                    return result * -1;
                }
                else if(survivor < 0)
                {
                    cell.changeInhabitant(this);
                    cell.inhabitant.population = Math.abs(survivor);
                    return quantity - Math.abs(survivor);
                }
                else
                {
                    result = cell.inhabitant.population;
                    cell.changeInhabitant(null);
                    return result * -1; // nbr of population lost by defender (all of it)
                }
            }
            else
            {
                throw new Error("Can't attack its allies\r\nat: Colony{x: " + this.pos.x + ",y: " + this.pos.y + "}");
            }
        }
        else
        {
                throw new Error("Can't attack an empty cell\r\nat: Colony{x: " + this.pos.x + ",y: " + this.pos.y + "}");
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
        if(cell.inhabitant !== null)
        {
            if(cell.inhabitant.civilisation !== this.civilisation)
            {
                let allyForces = (this.population - 1) * this.civilisation.damage;
                let ennemyForces = cell.inhabitant.population * cell.inhabitant.civilisation.defence;

                return ennemyForces - allyForces < 0;
            }
            else
            {
                throw new Error("Can't calculate the outcome of a battle against an ally\r\nat: Colony{x: " + this.pos.x + ",y: " + this.pos.y + "}");
            }
        }
        else
        {
            throw new Error("Can't calculate the outcome of a battle against an empty cell\r\nat: Colony{x: " + this.pos.x + ",y: " + this.pos.y + "}");
        }
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

                    if (action < 100 * ((this.population / this.civilisation.density) - (allies[i].population / this.civilisation.density)) > 0 ? ((this.population / this.civilisation.density) - (allies[i].population / this.civilisation.density)) * (this.civilisation.solidarity - this.civilisation.expensivity) : 0)
                    {
                        actionStack["reinforce"].push({ sender: this, receiver: allies[i], quantity: Math.round(Math.random() * (this.population - allies[i].population - 1) + 1) });
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
                    if(this.population > this.civilisation.density * this.civilisation.infectionativity)
                    {
                        actionStack["infect"].push({ sender: this, location: empties[i], quantity: Math.round(Math.random() * (this.population - (this.civilisation.density * this.civilisation.infectionativity) - 1) + (this.civilisation.density * this.civilisation.infectionativity)) });
                        return;
                    }
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