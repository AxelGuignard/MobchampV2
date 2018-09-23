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
        let surroudings = { left: null, up: null, right: null, down: null, ennemy: [] };

        if(map.cells[this.pos.x - 1][this.pos.y] !== undefined)
        {
            if(map.cells[this.pos.x - 1][this.pos.y].inhabitant.civilisation === this.civilisation)
            {
                surroudings.left = 1;
            }
            else if(map.cells[this.pos.x - 1][this.pos.y].inhabitant.civilisation === null)
            {
                surroudings.left = 0;
            }
            else
            {
                surroudings.left = -1;
                surroudings.ennemy.push(map.cells[this.pos.x - 1][this.pos.y].inhabitant);
            }
        }

        if(map.cells[this.pos.x][this.pos.y - 1] !== undefined)
        {
            if(map.cells[this.pos.x][this.pos.y - 1].inhabitant.civilisation === this.civilisation)
            {
                surroudings.up = 1;
            }
            else if(map.cells[this.pos.x][this.pos.y - 1].inhabitant.civilisation === null)
            {
                surroudings.up = 0;
            }
            else
            {
                surroudings.up = -1;
                surroudings.ennemy.push(map.cells[this.pos.x][this.pos.y - 1].inhabitant);
            }
        }

        if(map.cells[this.pos.x + 1][this.pos.y] !== undefined)
        {
            if(map.cells[this.pos.x + 1][this.pos.y].inhabitant.civilisation === this.civilisation)
            {
                surroudings.right = 1;
            }
            else if(map.cells[this.pos.x + 1][this.pos.y].inhabitant.civilisation === null)
            {
                surroudings.right = 0;
            }
            else
            {
                surroudings.right = -1;
                surroudings.ennemy.push(map.cells[this.pos.x + 1][this.pos.y].inhabitant);
            }
        }

        if(map.cells[this.pos.x][this.pos.y + 1] !== undefined)
        {
            if(map.cells[this.pos.x][this.pos.y + 1].inhabitant.civilisation === this.civilisation)
            {
                surroudings.down = 1;
            }
            else if(map.cells[this.pos.x][this.pos.y + 1].inhabitant.civilisation === null)
            {
                surroudings.down = 0;
            }
            else
            {
                surroudings.down = -1;
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
}