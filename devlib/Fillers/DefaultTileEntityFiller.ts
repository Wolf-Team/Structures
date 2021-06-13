/// <reference path="TileEntityFiller.ts" />
interface IDefaultTileEntityFiller extends ITileEntityFiller {
    slots: Dict<ItemInstance>;
    data: Dict<any>;
}
class DefaultTileEntityFiller extends TileEntityFiller {
    public readonly type: string = "default_filler";

    public _slots: Dict<ItemInstance> = {};
    private _data: Dict<any> = {};
    constructor(slots?, data?) {
        super();
        if (slots)
            this._slots = slots;
        if (data)
            this._data = data;
    }

    public fill(TE: ItemContainer | TileEntity | NativeTileEntity, random: Random): void {
        let size: number = 0;
        if (!(TE instanceof ItemContainer)) {
            if ((<TileEntity>TE).data != undefined) {
                (<TileEntity>TE).data = this._data;
                TE = <ItemContainer>(<TileEntity>TE).container;
            } else {
                size = TE.getSize() || 0;
            }
        }

        for (let i in this._slots) {
            if (!(TE instanceof ItemContainer)) {
                const n = parseInt(i);
                if (isNaN(n) || n >= size)
                    continue;
            }

            let slot: Slot = this._slots[i];
            let item_id = slot.id;
            if (typeof item_id == "string")
                item_id = BlockID[item_id] || ItemID[item_id];

            if (item_id == undefined)
                throw new Error("Unknown item or block \"" + item_id + "\"");

            TE.setSlot(i, item_id, slot.count, slot.data || 0);
            if (TE instanceof ItemContainer)
                TE.sendChanges();
        }
    }

    public parseJSON(json: IDefaultTileEntityFiller): void {
        this._slots = json.slots;
        this._data = json.data;
    }
    public toJSON(): IDefaultTileEntityFiller {
        let json = <IDefaultTileEntityFiller>super.toJSON();
        json.slots = this._slots;
        json.data = this._data;
        return json;
    }

}
TileEntityFiller.register("default_filler", DefaultTileEntityFiller);


/*
DefaultTileEntityFiller.prototype.fill = function (TE) {
    let isNative = !(TE instanceof UI.Container || (SUPPORT_NETWORK && TE instanceof ItemContainer));
    let isItemContainer = SUPPORT_NETWORK && TE instanceof ItemContainer;
    

    if (TE) {
        let size = isNative ? TE.getSize() : 0;

        if (!isNative) {
            //TE = World.addTileEntity(x, y, z, blockSource);
            //if(!TE) return;

            TE.data = this.data;
            TE = TE.container;
        }

        for (let i in this.slots) {
            if (isNative) {
                i = parseInt(i);
                if (isNaN(i) || i >= size) continue;
            }

            let slot = this.slots[i];
            let item_id = slot.id;
            if (isNaN(parseInt(item_id)))
                item_id = BlockID[item_id] || ItemID[item_id];

            TE.setSlot(i, item_id, slot.count, slot.data || 0);
            if (isItemContainer) TE.sendChanges();
        }


    }
}
*/

EXPORT("DefaultTileEntityFiller", DefaultTileEntityFiller);