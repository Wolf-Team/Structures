function DefaultTileEntityFiller(slots, data){
    this.slots = slots || {};
    this.data = data || {};
}; TileEntityFiller.register("default_filler", DefaultTileEntityFiller);

DefaultTileEntityFiller.prototype.fill = function(TE){
    let isNative = !(TE instanceof UI.Container || (SUPPORT_NETWORK && TE instanceof ItemContainer));
    let isItemContainer = SUPPORT_NETWORK && TE instanceof ItemContainer;

    if(TE){
        let size = isNative ? TE.getSize() : 0;
        
        if(!isNative){
            //TE = World.addTileEntity(x, y, z, blockSource);
            //if(!TE) return;

            TE.data = this.data;
            TE = TE.container;
        }

        for(let i in this.slots){
            if(isNative){
                i = parseInt(i);
                if(isNaN(i) || i >= size) continue;
            }

            let slot = this.slots[i];
            let item_id = slot.id;
            if(isNaN(parseInt(item_id)))
                item_id = BlockID[item_id] || ItemID[item_id];

            TE.setSlot(i, item_id, slot.count, slot.data || 0);
            if(isItemContainer) TE.sendChanges();
        }

        
    }
}
DefaultTileEntityFiller.prototype.parseJSON = function(json){
    this.slots = json.slots;
    this.data = json.data;
}
DefaultTileEntityFiller.prototype.toJSON = function(){
    let json = DefaultTileEntityFiller.superclass.toJSON.apply(this);
    json.slots = this.slots;
    json.data = this.data;
    return json;
}

EXPORT("DefaultTileEntityFiller", DefaultTileEntityFiller);