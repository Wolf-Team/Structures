type ChanceTileEntity = { [chance: string]: string };

class TileEntityRandomize {
    private _tileEntitysName: ChanceTileEntity = {};

    public static parse(tileEntitys: ChanceTileEntity): TileEntityRandomize {
        const ter = new TileEntityRandomize();
        for (let i in tileEntitys)
            ter.add(parseInt(i), tileEntitys[i]);
        return ter;
    }

    public add(chance: number, nameTE: string) {
        if (chance <= 0 || chance > 1 || isNaN(chance))
            throw new Error("Chance must be > 0 AND <= 1.");

        if (this._tileEntitysName.hasOwnProperty(chance))
            throw new Error("Chance " + chance + " already register");

        this._tileEntitysName[chance] = nameTE;
    }

    public get(chance: Random | number): string | null {
        if (this.isEmpty())
            throw new Error("TileEntityRandomize empty.");

        if (chance instanceof Random)
            chance = chance.nextFloat();

        if (chance <= 0 || chance > 1)
            throw new Error("Chance must be > 0 AND <= 1.");

        for (let maxChance in this._tileEntitysName)
            if (chance <= parseFloat(maxChance))
                return this._tileEntitysName[maxChance];

        return null;
    }

    public isEmpty() {
        for (let i in this._tileEntitysName)
            return false;

        return true;
    }

    private toJSON() {
        return this._tileEntitysName;
    }
}

EXPORT("TileEntityRandomize", TileEntityRandomize);