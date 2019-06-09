class MoChCivilisation
{
    constructor(name, color)
    {
        this.population = 0;
        this.color = color;
        this.name = name;

        // Main behavior
        this.combativity = 1/3;
        this.expensivity = 1/3;
        this.preservativity = 1/3;

        // Secondary behavior
        this.aggressivity = this.combativity * 2;
        this.solidarity = this.preservativity * 2;

        // Characteristics
        this.damage = Math.round(this.combativity * 4 + 1);
        this.defence = Math.round(this.preservativity * 4 + 1);
        this.growth = Math.round(this.expensivity * 4 + 1);
        this.infectionativity = 1 - (this.expensivity * 0.4 + 0.5);
        this.density = Math.round(this.preservativity * 50 + 100);
        this.unstability = Math.round((1 - this.preservativity * (-5)));
    }

    changeBehavior(behavior, change)
    {
        switch (behavior) {
            case "combativity":
                if(this.combativity + change > 1)
                {
                    this.combativity = 1;
                    this.preservativity = 0;
                    this.expensivity = 0;
                }
                else
                {
                    if(this.combativity + change < 0)
                    {
                        change = this.combativity;
                    }

                    this.combativity += change;
                    this.preservativity -= change / 2;
                    this.expensivity -= change / 2;
                }

                break;
            case "preservativity":
                if(this.preservativity + change > 1)
                {
                    this.preservativity = 1;
                    this.combativity = 0;
                    this.expensivity = 0;
                }
                else
                {
                    if(this.preservativity + change < 0)
                    {
                        change = this.preservativity;
                    }

                    this.preservativity += change;
                    this.combativity -= change / 2;
                    this.expensivity -= change / 2;
                }

                break;
            case "expensivity":
                if(this.expensivity + change > 1)
                {
                    this.expensivity = 1;
                    this.combativity = 0;
                    this.preservativity = 0;
                }
                else
                {
                    if(this.expensivity + change < 0)
                    {
                        change = this.expensivity;
                    }

                    this.expensivity += change;
                    this.combativity -= change / 2;
                    this.preservativity -= change / 2;
                }

                break;
            default:
                throw  new Error("Wrong parameter 'behavior' passed\r\nat: Civilisation '" + this.name + "'");
        }

        this.updateCharacteristics();

        return true;
    }

    updateCharacteristics()
    {
        this.damage = Math.round(this.combativity * 4 + 1);
        this.defence = Math.round(this.preservativity * 4 + 1);
        this.growth = Math.round(this.expensivity * 4 + 1);
        this.infectionativity = 1 - (this.expensivity * 0.4 + 0.5);
        this.density = Math.round(this.preservativity * 50 + 100);
        this.unstability = Math.round((1 - this.preservativity * (-5)));
    }
}