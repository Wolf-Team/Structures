/* TODO
* Get
* Build with TE
* Destroy
* add timer
* Work with files
*/
var SUPPORT_NETWORK = getCoreAPILevel() > 10;

var _World = {
    setBlock:function(x,y,z, id, data, blockSource){
        if(SUPPORT_NETWORK){
            blockSource.setBlock(x,y,z, id, data);
        }else{
            World.setBlock(x,y,z, id, data);
        }
    },
    getBlock:function(){
        
    }
};

var Structure = function(file){
    this.clear();
    if(file != undefined)
        this.readFromFile(file);
}
Structure.dir = "/structures";

Structure.prototype.clear = function(){
    this._structure = [];
    this._tileEntities = {};
}

Structure.prototype.addBlock = function(x, y, z, id, data, tileEntityRandomize){
    if(!Utility.isInt(x))
        throw new TypeError('"'+x+'" is not a integer.');
    if(!Utility.isInt(y))
        throw new TypeError('"'+y+'" is not a integer.');
    if(!Utility.isInt(z))
        throw new TypeError('"'+z+'" is not a integer.');
    
    if(!Utility.isInt(id))
        throw new TypeError('"'+id+'" is not a integer.');

    let block = [x, y, z];
        
    let blockInfo = id;
    if(data != undefined){
        if(!Utility.isInt(data))
            throw new TypeError('"'+data+'" is not a integer.');

        blockInfo = {
            id:blockInfo,
            data:data
        }
    }
    
    block.push(blockInfo);

    if(tileEntityRandomize != undefined){
        if(typeof(tileEntityRandomize) == "string"){
            let _tileEntityRandomize = new TileEntityRandomize();
            _tileEntityRandomize.add(1, tileEntityRandomize);
            tileEntityRandomize = _tileEntityRandomize;
        }else if(!tileEntityRandomize instanceof TileEntityRandomize){
            throw new TypeError("tileEntityRandomize must be TileEntityRandomize.");
        }
        
        block.push(tileEntityRandomize);
    }
    
    this._structure.push(block);
}

Structure.prototype.addTileEntity = function(name, slots, data){
    if(typeof(name) != "string")
        throw new TypeError('"'+name+'" is not a string.');

    if(this._tileEntities.hasOwnProperty(name))
        throw new Error("TileEntity "+name+" already exists in the structure.");

    for(let i in slots){
        let slot = slots[i];
        if(!Utility.checkSlot(slot))
            throw new TypeError(i+':"'+JSON.stringify(slot)+'" is not a ItemInstance.');
    }

    let TileEntity = { slots:slots };

    if(data){
        if(!typeof(data) == "object")
            throw new TypeError('"'+data+'" is not a object.');
        TileEntity.data = data;
    }
    this._tileEntities[name] = TileEntity;
}

Structure.prototype.get = function(x, y, z, rotates){
    return -1;
}
Structure.prototype.check = function(x, y, z, rotates){
    return this.get(x, y, z, rotates) != -1;
}

Structure.prototype.build = function(x,y,z, rotates, random, blockSource){
    random = Utility.getRandom(random);

    let rotate = Rotate.getRotate(rotates, random);

    if(SUPPORT_NETWORK && blockSource == undefined)
        blockSource = BlockSource.getCurrentWorldGenRegion();

    for(let i = this._structure.length-1; i >= 0; i--){
        let blockInfo = this._structure[i];
        let deltaPos = rotate.getPosition(blockInfo[0], blockInfo[1], blockInfo[2]),
            id = blockInfo[3],
            data = 0;
        
        if(typeof(id) != "number"){
			data = id.data;
			id = id.id;
        }

        _World.setBlock(x + deltaPos.x, y + deltaPos.y, z + deltaPos.z, id, data, blockSource);

        if(blockInfo[4] instanceof TileEntityRandomize){
            let TE_Info = this._tileEntities[blockInfo[4].get(random.nextFloat())];

            let TE = World.getContainer(x + deltaPos.x, y + deltaPos.y, z + deltaPos.z, blockSource);
            
            Debug.message(TE);
            
            if(TE){
                if(TE instanceof UI.Container || (SUPPORT_NETWORK && TE instanceof ItemContainer)){
                    TE = World.addTileEntity(x, y, z, blockSource);
                    if(TE){
                        TE.data = TE_Info.data;
                        for(let i in TE_Info.slots){
                            let slot = TE_Info.slots[i];
                            let item_id = slot.id;
                            if(isNaN(parseInt(item_id)))
                                item_id = BlockID[item_id] || ItemID[item_id];
                            
                            TE.container.setSlot(i, item_id, slot.count, slot.data);
                            TE.container.sendChanges();
                        }
                    }
                }else{
                    let size = TE.getSize();
                    
                    for(let i in TE_Info.slots){
                        i = parseInt(i);
                        if(isNaN(i) || i >= size) continue;
    
                        let slot = TE_Info.slots[i];
                        let item_id = slot.id;
                        if(isNaN(parseInt(item_id)))
                            item_id = BlockID[item_id] || ItemID[item_id];
    
                        TE.setSlot(i, item_id, slot.count, slot.data || 0);
                    }
                }
            }
            

        }
    }
}

Structure.prototype.readFromFile = function(FileName){}
Structure.prototype.writeInFile = function(FileName){}



EXPORT("Structure", Structure);