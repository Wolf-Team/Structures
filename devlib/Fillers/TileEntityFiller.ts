interface ITileEntityFiller { type: string; }

class TileEntityFiller implements ITileEntityFiller {
    private static _filler: Dict<typeof TileEntityFiller> = {};

    public static register(type: string, filler: typeof TileEntityFiller) {
        if (this._filler.hasOwnProperty(type))
            throw new Error(`Filler "${type}" was been registered!`);

        this._filler[type] = filler;
    }
    public static parseJSON(json: ITileEntityFiller) {
        if (!this._filler.hasOwnProperty(json.type))
            throw new Error("Not found TileEntityFiller " + json.type);

        let TEFiller = TileEntityFiller._filler[json.type];
        let filler = new TEFiller();
        filler.parseJSON(json);
        return filler;
    }


    type: string = "";

    public fill(TE: ItemContainer | TileEntity | NativeTileEntity, random: Random): void { }
    public parseJSON(json: ITileEntityFiller) { };
    public toJSON(): ITileEntityFiller {
        return { type: this.type };
    };
}


EXPORT("TileEntityFiller", TileEntityFiller);