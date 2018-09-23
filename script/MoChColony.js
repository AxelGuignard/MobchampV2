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

            if(cell.inhabitant.civilisation === this.civilisation)
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
            else
            {
                cell.inhabitant.population = Math.abs(survivor);
                cell.changeInhabitant(this.civilisation);
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
        let outcome = 0;

        if(ennemyForces - allyForces < 0)
        {
            let minForces = ennemyForces + 1;
            outcome = { min: minForces, max: this.population - 1 };
        }
        else
        {
            outcome = -1;
        }

        return outcome;
    }

    makeAMove()
    {
        let action = Math.floor(Math.random() * 100) + 1;

        if(action > 100 * this.civilisation.preservativity) // if <, the colony doesn't take any initiative (they preserve their colony)
        {
            let surroundings = this.scanSurroundings();
            let empties = surroundings.empty;
            let allies = surroundings.ally;
            let ennemies = surroundings.ennemy;

            if(ennemies !== []) // if there is an ennemy colony nearby
            {
                for(let i = 0; i < ennemies.length; i++)
                {
                    action = Math.floor(Math.random() * 100) + 1;

                    let outcome = this.calcBattleOutcome(ennemies[i]);

                    // deciding if must attack depending on how favorable is the outcome and how aggressive is the colony compared to preservative
                    if(action < 100 * (outcome === -1 ? 0.1 : (outcome.max - outcome.min) / this.population) * (this.civilisation.aggressivity - this.civilisation.preservativity))
                    {
                        this.sendPop(outcome === -1 ? Math.floor(Math.random() * this.population) + 1 : Math.floor(Math.random() * (outcome.max + 1)) + outcome.min, ennemies[i]);
                        return;
                    }
                }
            }

            if(allies !== []) // if there is an allied colony nearby
            {
                for(let i = 0; i < allies.length; i++)
                {
                    action = Math.floor(Math.random() * 100) + 1;

                    if (action < 100 * (1 - allies[i].population / this.civilisation.density) * (this.civilisation.solidarity - this.civilisation.expensivity))

                        return;
                }
            }

            // if all cells are empty or the colony rejected the other decisions
            action = Math.floor(Math.random() * 100) + 1;

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