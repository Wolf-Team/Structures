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

function APOFiller(items){
    this.items = items || [];
}; TileEntityFiller.register("apo_filler", APOFiller);

APOFiller.prototype.fill = function(TE, random){
    let isNative = !(TE instanceof UI.Container || (SUPPORT_NETWORK && TE instanceof ItemContainer));

    if(TE && isNative){
        let size = TE.getSize() || 0;
        if(size == 0) return;

        let indexs = [];
        
        for(let i = this.items.length-1; i >= 0 && indexs.length < size; i++){
            let item = this.items[i];
            
            if(random.nextFloat() > item.chance)
                continue;

            let count = item.count;
            if(typeof item.count == "object")
                count = random.nextInt(item.count.max - item.count.min + 1) + item.count.min;
            
            let i;
            do{
                i = random.nextInt(size);
            }while(indexs.indexOf(i) != -1);
            let item_id = slot.id;
            if(isNaN(parseInt(item_id)))
                item_id = BlockID[item_id] || ItemID[item_id];
            
            if(item_id == undefined)
                throw new Error("Unknown item or block \"" + item.id + "\"");

            TE.setSlot(i, item_id, count, item.data || item.meta || 0);
        }
    }
}
APOFiller.prototype.parseJSON = function(json){
    this.items = json.items;
}
APOFiller.prototype.toJSON = function(){
    let json = APOFiller.superclass.toJSON.apply(this);
    json.items = this.items;
    return json;
}

EXPORT("APOFiller", APOFiller);