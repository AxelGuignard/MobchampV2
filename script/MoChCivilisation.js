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

        // Characteristics
        this.damage = Math.floor(this.combativity * 4 + 1);
        this.defence = Math.floor(this.preservativity * 4 + 1);
        this.growth = Math.floor(this.expensivity * 4 + 1);
        this.infectionativity = 1 - (this.expensivity * 0.4 + 0.5);
        this.density = Math.floor(this.preservativity * 50 + 100);
    }
}