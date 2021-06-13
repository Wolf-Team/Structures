interface ITileEntityFiller { type: string; }

class TileEntityFiller implements ITileEntityFiller {
    private static _filler: Dict<typeof TileEntityFiller>;

    public static register(filler: typeof TileEntityFiller) {
        if (this._filler.hasOwnProperty(filler.prototype.type))
            throw new Error();

        this._filler[filler.prototype.type] = filler;
    }
    public static parseJSON(json: ITileEntityFiller) {
        if (!TileEntityFiller._filler.hasOwnProperty(json.type))
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