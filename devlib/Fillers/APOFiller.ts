/// <reference path="TileEntityFiller.ts" />
/**
    "TE_IN_JSON":{
        "type":"apo_filler",
        "items":[
            {
                "id": 5,
                "meta": 1,
                "rarity": 1,
                "count": 4
            },
            {
                "id": "my_item",
                "data": 0,
                "rarity": 0.65,
                "count": { "min": 1,  "max": 9 }
            }
        ]
    }
*/

interface APOItem {
    id: string | number,
    meta?: number, data?: number,
    rarity: number,
    count: number | { min: number, max: number }
}
interface IAPOFiller extends ITileEntityFiller {
    items: APOItem[]
}
class APOFiller extends TileEntityFiller {
    public readonly type: string = "apo_filler";
    private _items: APOItem[];

    constructor(items?: APOItem[]) {
        super();
        if (items)
            this._items = items;
    }

    fill(TE: ItemContainer | TileEntity | NativeTileEntity, random: Random): void {
        if (TE instanceof ItemContainer || (<TileEntity>TE).data != undefined)
            return;

        let size: number = TE.getSize() || 0;
        if (size == 0) return;
        let indexs = [];

        for (let i = this._items.length - 1; i >= 0 && indexs.length < size; i++) {
            let item = this._items[i];

            if (random.nextFloat() > item.rarity)
                continue;

            let count = item.count;
            if (typeof count != "number")
                count = random.nextInt(count.max - count.min + 1) + count.min;

            let ii: number;
            do {
                ii = random.nextInt(size);
            } while (indexs.indexOf(ii) != -1);

            let item_id = item.id;
            if (typeof item_id == "string")
                item_id = BlockID[item_id] || ItemID[item_id];

            if (item_id == undefined)
                throw new Error("Unknown item or block \"" + item.id + "\"");

            TE.setSlot(ii, item_id, count, item.data || item.meta || 0);
        }
    }

    parseJSON(json: IAPOFiller) {
        this._items = json.items;
    }
    toJSON(): IAPOFiller {
        let json = <IAPOFiller>super.toJSON();
        json.items = this._items;
        return json;
    }
}
TileEntityFiller.register(APOFiller);

EXPORT("APOFiller", APOFiller);