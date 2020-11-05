/* TODO
* add timer
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
    getBlock:function(x, y, z, blockSource){
        if(SUPPORT_NETWORK){
            return blockSource.getBlock(x, y, z);
        }else{
            return World.getBlock(x, y, z);
        }
    }
};

var Structure = function(file){
    this.clear();
    if(file != undefined)
        this.readFromFile(file);
}
Structure.dir = "structures";

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
    if(data != undefined && data != 0){
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

Structure.prototype.addTileEntity = function(name, tileEntityFiller){
    if(typeof(name) != "string")
        throw new TypeError('"'+name+'" is not a string.');

    if(this._tileEntities.hasOwnProperty(name))
        throw new Error("TileEntity "+name+" already exists in the structure.");

    if(!tileEntityFiller instanceof TileEntityFiller)
        throw new TypeError('tileEntityFiller is not a TileEntityFiller.');

    this._tileEntities[name] = tileEntityFiller;
}

Structure.prototype.get = function(x, y, z, rotates, blockSource){
    if(SUPPORT_NETWORK && blockSource == undefined)
        blockSource = BlockSource.getCurrentWorldGenRegion();
    
    if(rotates instanceof Rotate){
        rotates = [rotates];
    } else if(rotates instanceof Array){
        if(typeof rotates[0] == "number"){
            rotates = [new Rotate(rotates)];
        }else{
            for(let i in rotates)
                if(rotates[i] instanceof Array)
                    rotates[i] = new Rotate(rotates[i]);
        }
    }

    for(let i = 0; i < rotates.length; i++){
        let rotate = rotates[i],
            k = 0,
            l = this._structure.length;

        for(; k < l; k++){
            let blockInfo = this._structure[k];
            let deltaPos = rotate.getPosition(blockInfo[0], blockInfo[1], blockInfo[2]),
                id = blockInfo[3],
                data = 0;
            
            if(typeof(id) == "object"){
                data = id.data;
                id = id.id;
            }
            if(typeof(id) == "string")
                id = BlockID[id] || 1;
            
            
            let block = _World.getBlock(x + deltaPos.x, y + deltaPos.y, z + deltaPos.z, blockSource);
            if(block.id != id || block.data != data) break;
        }
        
        if(k == l)
            return i;
    }

    return -1;
}
Structure.prototype.check = function(x, y, z, rotates, blockSource){
    return this.get(x, y, z, rotates, blockSource) != -1;
}

Structure.prototype.build = function(x,y,z, rotates, random, blockSource){
    random = Utility.getRandom(random);
    if(SUPPORT_NETWORK && blockSource == undefined)
        blockSource = BlockSource.getCurrentWorldGenRegion();

    let rotate = Rotate.getRotate(rotates, random);

    for(let i = this._structure.length-1; i >= 0; i--){
        let blockInfo = this._structure[i];
        let deltaPos = rotate.getPosition(blockInfo[0], blockInfo[1], blockInfo[2]),
            id = blockInfo[3],
            data = 0;
        
        if(typeof(id) == "object"){
			data = id.data;
			id = id.id;
        }
        if(typeof(id) == "string")
            id = BlockID[id] || 1;

        _World.setBlock(x + deltaPos.x, y + deltaPos.y, z + deltaPos.z, id, data, blockSource);

        if(blockInfo[4] instanceof TileEntityRandomize){
            let TE_name = blockInfo[4].get(random.nextFloat());
            if(TE_name){
                let TE_Filler = this._tileEntities[TE_name];
                let TE = World.getContainer(x + deltaPos.x, y + deltaPos.y, z + deltaPos.z, blockSource);
                if(TE instanceof UI.Container || (SUPPORT_NETWORK && TE instanceof ItemContainer))
                    TE = World.addTileEntity(x, y, z, blockSource);
                TE_Filler.fill(TE, random);
            }
        }
    }
}
Structure.prototype.destroy = function(x, y, z, rotates, blockSource){
    let i = this.get(x, y, z, rotates, blockSource);

    if(SUPPORT_NETWORK && blockSource == undefined)
        blockSource = BlockSource.getCurrentWorldGenRegion();

    let rotate = rotates[i];

    for(let i = this._structure.length-1; i >= 0; i--){
        let blockInfo = this._structure[i];
        let deltaPos = rotate.getPosition(blockInfo[0], blockInfo[1], blockInfo[2]);

        _World.setBlock(x + deltaPos.x, y + deltaPos.y, z + deltaPos.z, 0, 0, blockSource);
    }
}

Structure.prototype.readFromFile = function(FileName){

    let path = __dir__ + "/" + Structure.dir + "/" + FileName + ".struct";
    if(!FileTools.isExists(path))
        throw new Error("File \"" + FileName + ".struct\" not found.");

    let version = 0;
    let read = JSON.parse(FileTools.ReadText(path));

    if(read.version){
        version = read.version;
        switch(read.version){
            case 3:
                this._structure = read.structure.map(function(i){
                    if(i[4])
                        i[4] = TileEntityRandomize.parse(i[4]);

                    return i;
                });
                for(let i in read.tile_entities)
                    this._tileEntities[i] = TileEntityFiller.parseJSON(read.tile_entities[i]);

            break;
            case 2:
                this._structure = read.structure.map(function(block){
                    if(block[4]){
                        let ter = new TileEntityRandomize();
                        ter.add(1, block[4]);
                        block[4] = ter;
                    }
                    return block;
                });
                if(read.te)
                    for(let i in read.te)
                        this._tileEntities[i] = new DefaultTileEntityFiller(read.te[i].slots, read.te[i].data);
                        

                if(read.chests){
                    for(let tile in read.chests){
                        let chest = read.chests[tile]
                        this._tileEntities[tile] = new DefaultTileEntityFiller();
                        for(let i in chest){
                            let slot = chest[i];
                            this._tileEntities[tile].slots[slot[0]] = slot[1];
                        }
                    }
                }
                
            break;
            case 1:
                this._structure = read.struture.map(function(block){
                    if(block[4]){
                        let ter = new TileEntityRandomize();
                        ter.add(1, block[4]);
                        block[4] = ter;
                    }
                    return block;
                });
                if(read.chests){
                    for(let tile in read.chests){
                        let chest = read.chests[tile]
                        this._tileEntities[tile] = new DefaultTileEntityFiller();
                        for(let i in chest){
                            let slot = chest[i];
                            this._tileEntities[tile].slots[slot[0]] = slot[1];
                        }
                    }
                }
                break;
            default:
                throw new Error(Translation.sprintf("Unknown version \"%s\".", read.version));
        }
    }else{
        this._structure = read;
    }

    if(version != StructuresDB.versionSaver)
        this.writeInFile(FileName);

    StructuresDB.structures[FileName] = this;
}
Structure.prototype.writeInFile = function(FileName){
    let saveObject = {
        version: StructuresDB.versionSaver,
        structure: this._structure
    };

    if(Object.keys(this._tileEntities).length)
        saveObject.tile_entities = this._tileEntities;

    FileTools.mkdir(__dir__ + "/" + Structure.dir);
    FileTools.WriteText(__dir__ + "/" + Structure.dir + "/" + FileName + ".struct", JSON.stringify(saveObject));
}

Structure.get = function(file){
    if(StructuresDB.structures.hasOwnProperty(file))
       return StructuresDB.structures[file];
    else
        return new Structure(file);
}


EXPORT("Structure", Structure);