/*
  _____ _                   _                           _     ____  ___ 
 / ____| |_ _ __ _   _  ___| |_ _   _ _ __  ___  ___   / \   |  _ \|_ _|
 \___ \| __| '__| | | |/ __| __| | | | '__|/ _ \/ __| / _ \  | |_) || | 
  ___) | |_| |  | |_| | (__| |_| |_| | |  |  __/\__ \/ ___ \ |  __/ | | 
 |____/ \__|_|   \__,_|\___|\__|\__,_|_|   \___||___/_/   \_\|_|   |___|
                                                                                              
                                                                
    StructuresAPI

    Внимание! Запрещено:
    1.Распространение библиотеки на сторонних источниках без указание ссылки на официальное сообщество
    2.Изменение кода
    3.Явное копирование кода

    Используя библиотеку вы автоматически соглашаетесь с этими правилами.

    ©WolfTeam ( https://vk.com/wolf___team )
*/
/*  ChangeLog:
	v2
	- Поддержка мультипллера
	- Рандомное сожержимое TileEntity
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
    version: 6,
    shared: false,
    api: "CoreEngine"
});

var StructuresDB = {
	structures:{},
	dir:"structures",
	index:0,
	versionSaver:2
}
var Random = java.util.Random;

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
    alert(random + ":" + (!random instanceof Random) + ":" + Random);
    
    if(!(random instanceof Random))
        random = new Random();
    
    alert(random + ":" + (random instanceof Random) + ":" + Random);

    let rotate = Rotate.getRotate(rotates);

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

Structure.ROTATE_RANDOM = [
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
Structure.ROTATE_ALL = Structure.ROTATE_RANDOM;
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

Structure.get = function(name, alerted) {
	if(StructuresDB.structures.hasOwnProperty(name))
		return StructuresDB.structures[name];
	else
		return new Structure(name, alerted);
}
Structure.init = function(folderName){
	if(typeof folderName != "string" && !(folderName instanceof java.lang.String))
		throw "folderName is not string.";
		
	StructuresDB.folderName = folderName;
}
Structure.setInWorld = function(name, x, y, z, rotate, progressively, time){
	Structure.get(name).set(x, y, z, rotate, progressively, time);
}
Structure.destroyInWorld = function(name, x, y, z, rotate, progressively, time){
	Structure.get(name).destroy(x, y, z, rotate, progressively, time);
}

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

Rotate.getRotate = function(rotates){
    if(rotates == undefined)
        return new Rotate(Structure.ROTATE_NONE);

    if(rotates instanceof Array && (rotates[0] instanceof Array || rotates[0] instanceof Rotate))
        rotates = rotates[Utility.randomI(0, rotates.length - 1)];
    
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
        ter.add(i, obj[i]);

    return ter;
}

TileEntityRandomize.prototype.add = function(chance, nameTileEntity){
    if(typeof(chance) != "number")
        throw new TypeError('"'+x+'" is not a number.');

    if(chance <= 0 || chance > 1)
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

    if(typeof(chance) != "number")
        throw new TypeError('"'+x+'" is not a number.');

    if(chance <= 0 || chance > 1)
        throw new Error("Chance must be > 0 AND <= 1.");

    for(let maxChance in this._tileEntitysName)
        if(chance <= parseFloat(maxChance))
            return this._tileEntitysName[maxChance];
}
TileEntityRandomize.prototype.isEmpty = function(){
    return this._tileEntitysName.isEmpty();
}

var Utility = {
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
    
    random:function(min, max){
        if(min === undefined) min=0;
        if(max === undefined) max=min+1;
        
        return (max-min) * Math.random() + min;
    },
    randomI:function(min, max){
        if(min === undefined) min=0;
        if(max === undefined) max=min+10;

        return Math.ceil(Utility.random(min, max));
    },

    getSID:function(ID){
        return IDRegistry.getNameByID(ID) || ID;
    }
}

if(!Object.prototype.isEmpty)
    Object.prototype.isEmpty = function(){
        for(let i in this)
            return false;
            
        return true;
    }

if(!Translation.sprintf)
	Translation.sprintf = function(){
		var str = Translation.translate(arguments[0]);
		
		for(var i = 1; i < arguments.length; i++)
			str = str.replace("%s", arguments[i]);
		
		return str;
    };

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
Translation.addTranslation("Unknown version \"%s\".", {
	ru:"Неизвестная версия \"%s\".",
	en:"Unknown version \"%s\".",
});
Translation.addTranslation("The zero point of the structure is set.", {
	ru:"Нулевая точка структуры установлена.",
	en:"The zero point of the structure is set.",
});

