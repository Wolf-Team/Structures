/*
  _____ _                   _                           _     ____  ___ 
 / ____| |_ _ __ _   _  ___| |_ _   _ _ __  ___  ___   / \   |  _ \|_ _|
 \___ \| __| '__| | | |/ __| __| | | | '__|/ _ \/ __| / _ \  | |_) || | 
  ___) | |_| |  | |_| | (__| |_| |_| | |  |  __/\__ \/ ___ \ |  __/ | | 
 |____/ \__|_|   \__,_|\___|\__|\__,_|_|   \___||___/_/   \_\|_|   |___|
                                                                                              
                                                                
    StructuresAPI 2.0 ©WolfTeam ( https://vk.com/wolf___team )
*/
/*  ChangeLog:
	v2.0
	- Поддержка мультипллера
	- Рандомное содержимое TileEntity
	- Отсутствие поддержки WorldEdit'а
	v1.4
	- Дополнен перевод.
	- Установка структуры производится в потоке, только если установка в режиме Structure.PROGRESSIVELY.
	- Блоки воздуха в структуре больше не заменяются на камень
	v1.3
	- StructuresAPI удален.
	- Добавлен объект Rotate. Используется для сложных поворотов.
	- Метод структуры get был изменен. struct.get(x, y, z, rotates, return_index).
	- Метод структуры set был изменен. struct.set(x, y, z, rotate, progressively, time).
	- Добавлен метод destroy(x, y, z, rotates, progressively, time) для структуры.
	- Добавлен метод check(...) для структуры. Эквивалентен методу get(...).
	- Добавлен метод Structure.setInWorld(name, ...). Альтернатива Structure.get(name).set(...).
	- Добавлен метод Structure.destroyInWorld(name, ...). Альтернатива Structure.get(name).destroy(...).
	- Добавлены константы Structure.PROGRESSIVELY и Structure.NOT_PROGRESSIVELY.
	- Добавлены константы Structure.MIRROR_X, Structure.MIRROR_Y и Structure.MIRROR_Z.
	- Исправлена установка блоков добавленных модом.
	- Исправлено сохранение предметов и блоков.
	- Исправлен поворот на 180 градусов по Y.
	- Сохраняются TileEntity.
	v1.2
	- Библиотека переписана. Объект StructuresAPI устарел.
	- Сохраняется содержимое сундуков, печей и воронок.
	v1.1
	- Добавлен метод StructuresAPI.init(string NameFolder) - Задает папку со структурами.
	- Изменен метод StructuresAPI.set(name, x, y, z, rotate, destroy, progressively, time) - Добавлены параметры (Автор ToxesFoxes https://vk.com/tmm_corporation )
	 * destroy - Если true, структура будет "уничтожаться"
	 * progressively - Если true, структура будет постепенно "строиться/уничтожаться"
	 * time - Время в миллисекундах между установкой/уничтожением блоков
*/
LIBRARY({
    name: "StructuresAPI",
    version: 7,
    shared: false,
    api: "CoreEngine"
});

var StructuresDB = {
	structures:{},
	versionSaver:3
}
var Random = java.util.Random;

var Utility = {
    random:new Random(),
    getRandom:function(random){
        if(!(random instanceof Random))
            random = new Random();

        return random;
    },
	isInt:function(x){
		if(typeof(x) != "number")
			throw new TypeError('"'+x+'" is not a number.');

		return (x^0)==x;
	},

	checkSlot:function(slot){
		if(!Utility.isInt(slot.id) && id < 0)
			return false;
		
		if(slot.data !== undefined)
			if(!Utility.isInt(slot.data) && slot.data < 0)
				return false;

		if(slot.count !== undefined)
			if(!Utility.isInt(slot.count) && slot.count < 1)
				return false;
		
		return true;
    },

    getSID:function(ID){
        return IDRegistry.getNameByID(ID) || ID;
	},
	
	extends: function(Child, Parent){
        var F = function(){};
        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.prototype.constructor = Child;
        
        //Child.prototype.superclass =
        Child.superclass = Parent.prototype;
    }
}

if(!Translation.sprintf)
	Translation.sprintf = function(){
		var str = Translation.translate(arguments[0]);
		
		for(var i = 1; i < arguments.length; i++)
			str = str.replace("%s", arguments[i]);
		
		return str;
    };

/* TODO
* add timer
*/
var SUPPORT_NETWORK = getCoreAPILevel() > 10;

var _World = {
    setBlock:function(x,y,z, id, data, blockSource){
        if(SUPPORT_NETWORK){
            if(!blockSource)
                blockSource = BlockSource.getCurrentWorldGenRegion();
            blockSource.setBlock(x,y,z, id, data);
        }else{
            World.setBlock(x,y,z, id, data);
        }
    },
    getBlock:function(x, y, z, blockSource){
        if(SUPPORT_NETWORK){
            if(!blockSource)
                blockSource = BlockSource.getCurrentWorldGenRegion();
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

Structure.ROTATE_NONE = [
	1,0,0,
	0,1,0,
	0,0,1
];
	
Structure.ROTATE_90Y = [
	0,0,-1,
	0,1,0,
	1,0,0
];
Structure.ROTATE_180Y = [
	-1,0,0,
	0,1,0,
	0,0,-1
];
Structure.ROTATE_270Y = [
	0,0,1,
	0,1,0,
	-1,0,0
];
	
Structure.ROTATE_90X = [
	1,0,0,
	0,0,-1,
	0,1,0
];
Structure.ROTATE_180X = [
	1,0,0,
	0,-1,0,
	0,0,-1
];
Structure.ROTATE_270X = [
	1,0,0,
	0,0,1,
	0,-1,0
];
	
Structure.ROTATE_90Z = [
	0,-1,0,
	1,0,0,
	0,0,1
];
Structure.ROTATE_180Z = [
	-1,0,0,
	0,-1,0,
	0,0,1
];
Structure.ROTATE_270Z = [
	0,1,0,
	-1,0,0,
	0,0,1
];

Structure.ROTATE_ALL = Structure.ROTATE_RANDOM = [
	Structure.ROTATE_180X,
	Structure.ROTATE_180Y,
	Structure.ROTATE_180Z,
	Structure.ROTATE_270X,
	Structure.ROTATE_270Y,
	Structure.ROTATE_270Z,
	Structure.ROTATE_90X,
	Structure.ROTATE_90Y,
	Structure.ROTATE_90Z,
	Structure.ROTATE_NONE
];
Structure.ROTATE_Y = [
	Structure.ROTATE_NONE,
	Structure.ROTATE_90Y,
	Structure.ROTATE_180Y,
	Structure.ROTATE_270Y
];

Structure.MIRROR_X = [
	-1,0,0,
	0,1,0,
	0,0,1
];
Structure.MIRROR_Y = [
	1,0,0,
	0,-1,0,
	0,0,1
];
Structure.MIRROR_Z = [
	1,0,0,
	0,1,0,
	0,0,-1
];

Structure.PROGRESSIVELY = true;
Structure.NOT_PROGRESSIVELY = false;

var Rotate = function(r){
	this._rotates = [];

	if(r){
		if(r instanceof Array && (r[0] instanceof Array || r[0] instanceof Rotate)){
			this.addRotates(r);
		}else{
			this.addRotate(r);
		}
	}
}
Rotate.prototype.addRotate = function(matrix){
	if(!matrix instanceof Array && !matrix instanceof Rotate)
		throw "is not matrix";
	
	if(matrix instanceof Rotate)
		return this.addRotates(matrix.get());
	
	if(matrix.length != 9) throw "Not 9 number";
	
	for(let i = 0; i < 9; i++)
		if(Math.abs(matrix[i]) > 1)
			throw "Not normal matrix";
	
	this._rotates.push(matrix);
}
Rotate.prototype.addRotates = function(rotates){
	if(!rotates instanceof Array) throw "is not array";
	
	for(let i = 0; i < rotates.length; i++)
		this.addRotate(rotates[i]);
}
Rotate.prototype.get = function(){
	return this._rotates;
}
Rotate.prototype.getPosition = function(x,y,z){
    for(var j = 0, l = this._rotates.length; j < l; j++){
        let dx = x * this._rotates[j][0] + y * this._rotates[j][1] + z * this._rotates[j][2];
        let dy = x * this._rotates[j][3] + y * this._rotates[j][4] + z * this._rotates[j][5];
        let dz = x * this._rotates[j][6] + y * this._rotates[j][7] + z * this._rotates[j][8];
        x = dx;
        y = dy;
        z = dz;
    }
    return {x:x, y:y, z:z};
}
//Syns
Rotate.prototype.add = Rotate.prototype.addRotate;
Rotate.prototype.adds = Rotate.prototype.addRotates;

Rotate.getRotate = function(rotates, random){
	random = Utility.getRandom(random);

    if(rotates == undefined)
        return new Rotate(Structure.ROTATE_NONE);

    if(rotates instanceof Array && (rotates[0] instanceof Array || rotates[0] instanceof Rotate))
        rotates = rotates[random.nextInt(rotates.length)];
    
	return (rotates instanceof Rotate) ? rotates : new Rotate(rotates);
}

EXPORT("Rotate", Rotate);

var TileEntityRandomize = function(){
    this._tileEntitysName = {};
}
TileEntityRandomize.parse = function(obj){
    if(typeof(obj) != "object")
        throw new TypeError("obj is not a object.");
    
    let ter = new TileEntityRandomize();
    
    for(let i in obj)
        ter.add(parseInt(i), obj[i]);

    return ter;
}

TileEntityRandomize.prototype.add = function(chance, nameTileEntity){
    if(typeof(chance) != "number")
        throw new TypeError('"'+chance+'" is not a number.');

    if(chance <= 0 || chance > 1 || isNaN(chance))
        throw new Error("Chance must be > 0 AND <= 1.");

    if(this._tileEntitysName.hasOwnProperty(chance))
        throw new Error("Chance "+chance+" already register");
    
    if(typeof(nameTileEntity) != "string")
        throw new TypeError('"'+nameTileEntity+'" is not a string.');

    this._tileEntitysName[chance] = nameTileEntity;
}
TileEntityRandomize.prototype.get = function(chance){
    if(this.isEmpty())
        throw new Error("TileEntityRandomize empty.");
        
    if(chance instanceof Random)
        chance = chance.nextFloat();

    if(typeof(chance) != "number")
        throw new TypeError('"'+chance+'" is not a number.');

    if(chance <= 0 || chance > 1)
        throw new Error("Chance must be > 0 AND <= 1.");

    for(let maxChance in this._tileEntitysName)
        if(chance <= parseFloat(maxChance))
            return this._tileEntitysName[maxChance];

    return null;
}
TileEntityRandomize.prototype.toJSON = function(){
    return this._tileEntitysName;
  }
TileEntityRandomize.prototype.isEmpty = function(){
    for(let i in this._tileEntitysName)
        return false;

    return true;
}

EXPORT("TileEntityRandomize", TileEntityRandomize);

function TileEntityFiller(){}

TileEntityFiller.__filler = {};
TileEntityFiller.register = function(type, filler){
    if(TileEntityFiller.__filler.hasOwnProperty(type))
        throw new Error();

    Utility.extends(filler, TileEntityFiller);
    TileEntityFiller.__filler[type] = filler;
    filler.prototype.type = type;
}
TileEntityFiller.parseJSON = function(json){
    if(!TileEntityFiller.__filler.hasOwnProperty(json.type))
        throw new Error("Not found TileEntityFiller " + json.type);
    
    let filler = new TileEntityFiller.__filler[json.type]();
    filler.parseJSON(json);
    return filler;
}

TileEntityFiller.prototype.type = null;
TileEntityFiller.prototype.fill = function(TE, random){}
TileEntityFiller.prototype.parseJSON = function(json){}
TileEntityFiller.prototype.toJSON = function(){
    return {type:this.type};
}

EXPORT("TileEntityFiller", TileEntityFiller);

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

Translation.addTranslation("Saved to %s",{
	ru:"Сохранено в %s",
	en:"Saved to %s",
});
Translation.addTranslation("Save structure.",{
	ru:"Сохранить структуру.",
	en:"Save structure.",
});
Translation.addTranslation("Structure \"%s\" not found.",{
	ru:"Структура \"%s\" не найдена.",
	en:"Structure \"%s\" not found.",
});
Translation.addTranslation("The zero point of the structure is set.", {
	ru:"Нулевая точка структуры установлена.",
	en:"The zero point of the structure is set.",
});
Translation.addTranslation("Unknown version \"%s\".", {
	ru:"Неизвестная версия \"%s\".",
	en:"Unknown version \"%s\".",
});

