var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
     _____ _                   _
    / ____| |_ _ __ _   _  ___| |_ _   _ _ __  ___  ___
    \___ \| __| '__| | | |/ __| __| | | | '__|/ _ \/ __|
     ___) | |_| |  | |_| | (__| |_| |_| | |  |  __/\__ \
    |____/ \__|_|   \__,_|\___|\__|\__,_|_|   \___||___/

    Structures 2.0 ©WolfTeam ( https://vk.com/wolf___team )
*/
/*  ChangeLog:
    v2.0
    - Ренейминг
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
    name: "Structures",
    version: 20,
    shared: false,
    api: "CoreEngine"
});
var Random = java.util.Random;
var _World;
(function (_World) {
    function setBlock(x, y, z, id, data, blockSource) {
        if (!blockSource)
            blockSource = BlockSource.getCurrentWorldGenRegion();
        blockSource.setBlock(x, y, z, id, data);
    }
    _World.setBlock = setBlock;
    function getBlock(x, y, z, blockSource) {
        if (!blockSource)
            blockSource = BlockSource.getCurrentWorldGenRegion();
        return blockSource.getBlock(x, y, z);
    }
    _World.getBlock = getBlock;
})(_World || (_World = {}));
;
/// <reference path="header.ts" />
var Utility;
(function (Utility) {
    function getRandom(random) {
        if (!(random instanceof Random))
            random = new Random();
        return random;
    }
    Utility.getRandom = getRandom;
    function isInt(x) {
        return (x ^ 0) == x;
    }
    Utility.isInt = isInt;
    function getSID(ID) {
        if (typeof ID == "number")
            ID = IDRegistry.getNameByID(ID) || ID.toString();
        return ID;
    }
    Utility.getSID = getSID;
    function checkSlot(slot) {
        if (!Utility.isInt(slot.id) && slot.id < 0)
            return false;
        if (slot.data !== undefined)
            if (!Utility.isInt(slot.data) && slot.data < 0)
                return false;
        if (slot.count !== undefined)
            if (!Utility.isInt(slot.count) && slot.count < 1)
                return false;
        return true;
    }
    Utility.checkSlot = checkSlot;
})(Utility || (Utility = {}));
var TileEntityRandomize = /** @class */ (function () {
    function TileEntityRandomize() {
        this._tileEntitysName = {};
    }
    TileEntityRandomize.parse = function (tileEntitys) {
        var ter = new TileEntityRandomize();
        for (var i in tileEntitys)
            ter.add(parseInt(i), tileEntitys[i]);
        return ter;
    };
    TileEntityRandomize.prototype.add = function (chance, nameTE) {
        if (chance <= 0 || chance > 1 || isNaN(chance))
            throw new Error("Chance must be > 0 AND <= 1.");
        if (this._tileEntitysName.hasOwnProperty(chance))
            throw new Error("Chance " + chance + " already register");
        this._tileEntitysName[chance] = nameTE;
    };
    TileEntityRandomize.prototype.get = function (chance) {
        if (this.isEmpty())
            throw new Error("TileEntityRandomize empty.");
        if (chance instanceof Random)
            chance = chance.nextFloat();
        if (chance <= 0 || chance > 1)
            throw new Error("Chance must be > 0 AND <= 1.");
        for (var maxChance in this._tileEntitysName)
            if (chance <= parseFloat(maxChance))
                return this._tileEntitysName[maxChance];
        return null;
    };
    TileEntityRandomize.prototype.isEmpty = function () {
        for (var i in this._tileEntitysName)
            return false;
        return true;
    };
    TileEntityRandomize.prototype.toJSON = function () {
        return this._tileEntitysName;
    };
    return TileEntityRandomize;
}());
EXPORT("TileEntityRandomize", TileEntityRandomize);
var Rotate = /** @class */ (function () {
    function Rotate(rotates) {
        this._rotates = [];
        if (rotates) {
            if (Array.isArray(rotates) && (Array.isArray(rotates[0]) || rotates[0] instanceof Rotate)) {
                this.addRotates(rotates);
            }
            else {
                this.addRotate(rotates);
            }
        }
    }
    Rotate.prototype.addRotate = function (matrix) {
        if (matrix instanceof Rotate)
            return this.addRotates(matrix.get());
        if (matrix.length != 9)
            throw "Not 9 number";
        for (var i = 0; i < 9; i++)
            if (Math.abs(matrix[i]) > 1)
                throw "Not normal matrix";
        this._rotates.push(matrix);
    };
    Rotate.prototype.addRotates = function (rotates) {
        for (var i = 0; i < rotates.length; i++)
            this.addRotate(rotates[i]);
    };
    Rotate.prototype.get = function () {
        return this._rotates;
    };
    Rotate.prototype.getPosition = function (x, y, z) {
        for (var j = 0, l = this._rotates.length; j < l; j++) {
            var dx = x * this._rotates[j][0] + y * this._rotates[j][1] + z * this._rotates[j][2];
            var dy = x * this._rotates[j][3] + y * this._rotates[j][4] + z * this._rotates[j][5];
            var dz = x * this._rotates[j][6] + y * this._rotates[j][7] + z * this._rotates[j][8];
            x = dx;
            y = dy;
            z = dz;
        }
        return { x: x, y: y, z: z };
    };
    Rotate.getRotate = function (rotates, random) {
        random = Utility.getRandom(random);
        if (rotates == undefined)
            return new Rotate(Rotate.ROTATE_NONE);
        var rotate;
        if (Array.isArray(rotates) && (Array.isArray(rotates[0]) || rotates[0] instanceof Rotate))
            rotate = rotates[random.nextInt(rotates.length)];
        return (rotate instanceof Rotate) ? rotate : new Rotate(rotate);
    };
    Rotate.ROTATE_NONE = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    Rotate.ROTATE_90Y = [0, 0, -1, 0, 1, 0, 1, 0, 0];
    Rotate.ROTATE_180Y = [-1, 0, 0, 0, 1, 0, 0, 0, -1];
    Rotate.ROTATE_270Y = [0, 0, 1, 0, 1, 0, -1, 0, 0];
    Rotate.ROTATE_90X = [1, 0, 0, 0, 0, -1, 0, 1, 0];
    Rotate.ROTATE_180X = [1, 0, 0, 0, -1, 0, 0, 0, -1];
    Rotate.ROTATE_270X = [1, 0, 0, 0, 0, 1, 0, -1, 0];
    Rotate.ROTATE_90Z = [0, -1, 0, 1, 0, 0, 0, 0, 1];
    Rotate.ROTATE_180Z = [-1, 0, 0, 0, -1, 0, 0, 0, 1];
    Rotate.ROTATE_270Z = [0, 1, 0, -1, 0, 0, 0, 0, 1];
    Rotate.MIRROR_X = [-1, 0, 0, 0, 1, 0, 0, 0, 1];
    Rotate.MIRROR_Y = [1, 0, 0, 0, -1, 0, 0, 0, 1];
    Rotate.MIRROR_Z = [1, 0, 0, 0, 1, 0, 0, 0, -1];
    Rotate.ROTATE_Y = [Rotate.ROTATE_NONE, Rotate.ROTATE_90Y, Rotate.ROTATE_180Y, Rotate.ROTATE_270Y];
    Rotate.ROTATE_ALL = [Rotate.ROTATE_180X, Rotate.ROTATE_180Y, Rotate.ROTATE_180Z, Rotate.ROTATE_270X, Rotate.ROTATE_270Y, Rotate.ROTATE_270Z, Rotate.ROTATE_90X, Rotate.ROTATE_90Y, Rotate.ROTATE_90Z, Rotate.ROTATE_NONE];
    Rotate.ROTATE_RANDOM = Rotate.ROTATE_ALL;
    return Rotate;
}());
EXPORT("Rotate", Rotate);
var TileEntityFiller = /** @class */ (function () {
    function TileEntityFiller() {
        this.type = "";
    }
    TileEntityFiller.register = function (type, filler) {
        if (this._filler.hasOwnProperty(type))
            throw new Error("Filler \"" + type + "\" was been registered!");
        this._filler[type] = filler;
    };
    TileEntityFiller.parseJSON = function (json) {
        if (!this._filler.hasOwnProperty(json.type))
            throw new Error("Not found TileEntityFiller " + json.type);
        var TEFiller = TileEntityFiller._filler[json.type];
        var filler = new TEFiller();
        filler.parseJSON(json);
        return filler;
    };
    TileEntityFiller.prototype.fill = function (TE, random) { };
    TileEntityFiller.prototype.parseJSON = function (json) { };
    ;
    TileEntityFiller.prototype.toJSON = function () {
        return { type: this.type };
    };
    ;
    TileEntityFiller._filler = {};
    return TileEntityFiller;
}());
EXPORT("TileEntityFiller", TileEntityFiller);
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
var APOFiller = /** @class */ (function (_super) {
    __extends(APOFiller, _super);
    function APOFiller(items) {
        var _this = _super.call(this) || this;
        _this.type = "apo_filler";
        _this._items = [];
        if (items)
            _this._items = items;
        return _this;
    }
    APOFiller.prototype.fill = function (TE, random) {
        if (TE instanceof ItemContainer || TE.data != undefined)
            return;
        var size = TE.getSize() || 0;
        if (size == 0)
            return;
        var indexs = [];
        for (var i = this._items.length - 1; i >= 0 && indexs.length < size; i++) {
            var item = this._items[i];
            if (random.nextFloat() > item.rarity)
                continue;
            var count = item.count;
            if (typeof count != "number")
                count = random.nextInt(count.max - count.min + 1) + count.min;
            var ii = void 0;
            do {
                ii = random.nextInt(size);
            } while (indexs.indexOf(ii) != -1);
            var item_id = item.id;
            if (typeof item_id == "string")
                item_id = BlockID[item_id] || ItemID[item_id];
            if (item_id == undefined)
                throw new Error("Unknown item or block \"" + item.id + "\"");
            TE.setSlot(ii, item_id, count, item.data || item.meta || 0);
        }
    };
    APOFiller.prototype.parseJSON = function (json) {
        this._items = json.items;
    };
    APOFiller.prototype.toJSON = function () {
        var json = _super.prototype.toJSON.call(this);
        json.items = this._items;
        return json;
    };
    return APOFiller;
}(TileEntityFiller));
TileEntityFiller.register("apo_filler", APOFiller);
EXPORT("APOFiller", APOFiller);
/// <reference path="TileEntityFiller.ts" />
var DefaultTileEntityFiller = /** @class */ (function (_super) {
    __extends(DefaultTileEntityFiller, _super);
    function DefaultTileEntityFiller(slots, data) {
        var _this = _super.call(this) || this;
        _this.type = "default_filler";
        _this._slots = {};
        _this._data = {};
        if (slots)
            _this._slots = slots;
        if (data)
            _this._data = data;
        return _this;
    }
    DefaultTileEntityFiller.prototype.fill = function (TE, random) {
        var size = 0;
        if (!(TE instanceof ItemContainer)) {
            if (TE.data != undefined) {
                TE.data = this._data;
                TE = TE.container;
            }
            else {
                size = TE.getSize() || 0;
            }
        }
        for (var i in this._slots) {
            if (!(TE instanceof ItemContainer)) {
                var n = parseInt(i);
                if (isNaN(n) || n >= size)
                    continue;
            }
            var slot = this._slots[i];
            var item_id = slot.id;
            if (typeof item_id == "string")
                item_id = BlockID[item_id] || ItemID[item_id];
            if (item_id == undefined)
                throw new Error("Unknown item or block \"" + item_id + "\"");
            TE.setSlot(i, item_id, slot.count, slot.data || 0);
            if (TE instanceof ItemContainer)
                TE.sendChanges();
        }
    };
    DefaultTileEntityFiller.prototype.parseJSON = function (json) {
        this._slots = json.slots;
        this._data = json.data;
    };
    DefaultTileEntityFiller.prototype.toJSON = function () {
        var json = _super.prototype.toJSON.call(this);
        json.slots = this._slots;
        json.data = this._data;
        return json;
    };
    return DefaultTileEntityFiller;
}(TileEntityFiller));
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
/* TODO
* add timer
*/
var Structure = /** @class */ (function () {
    function Structure(file) {
        this._structure = [];
        this._tileEntities = {};
        this.check = function (x, y, z, rotates, blockSource) {
            return this.get(x, y, z, rotates, blockSource) != -1;
        };
        this.destroy = function (x, y, z, rotates, blockSource) {
            var i = this.get(x, y, z, rotates, blockSource);
            if (blockSource == undefined)
                blockSource = BlockSource.getCurrentWorldGenRegion();
            var rotate = rotates[i];
            for (var i_1 = this._structure.length - 1; i_1 >= 0; i_1--) {
                var blockInfo = this._structure[i_1];
                var deltaPos = rotate.getPosition(blockInfo[0], blockInfo[1], blockInfo[2]);
                _World.setBlock(x + deltaPos.x, y + deltaPos.y, z + deltaPos.z, 0, 0, blockSource);
            }
        };
        this.clear();
        if (file != undefined)
            this.readFromFile(file);
    }
    Structure.get = function (file) {
        if (Structure.structures.hasOwnProperty(file))
            return Structure.structures[file];
        else
            return new Structure(file);
    };
    Structure.prototype.clear = function () {
        this._structure = [];
        this._tileEntities = {};
    };
    Structure.prototype.readFromFile = function (FileName) {
        var path = __dir__ + "/" + Structure.dir + "/" + FileName + ".struct";
        if (!FileTools.isExists(path))
            throw new Error("File \"" + FileName + ".struct\" not found.");
        var version = 0;
        var read = JSON.parse(FileTools.ReadText(path));
        if (read.version) {
            version = read.version;
            switch (read.version) {
                case 3:
                    this._structure = read.structure.map(function (i) {
                        if (i[4])
                            i[4] = TileEntityRandomize.parse(i[4]);
                        return i;
                    });
                    for (var i in read.tile_entities)
                        this._tileEntities[i] = TileEntityFiller.parseJSON(read.tile_entities[i]);
                    break;
                case 2:
                    this._structure = read.structure.map(function (block) {
                        if (block[4]) {
                            var ter = new TileEntityRandomize();
                            ter.add(1, block[4]);
                            block[4] = ter;
                        }
                        return block;
                    });
                    if (read.te)
                        for (var i in read.te)
                            this._tileEntities[i] = new DefaultTileEntityFiller(read.te[i].slots, read.te[i].data);
                    if (read.chests) {
                        for (var tile in read.chests) {
                            var chest = read.chests[tile];
                            this._tileEntities[tile] = new DefaultTileEntityFiller();
                            for (var i in chest) {
                                var slot = chest[i];
                                this._tileEntities[tile]._slots[slot[0]] = slot[1];
                            }
                        }
                    }
                    break;
                case 1:
                    this._structure = read.struture.map(function (block) {
                        if (block[4]) {
                            var ter = new TileEntityRandomize();
                            ter.add(1, block[4]);
                            block[4] = ter;
                        }
                        return block;
                    });
                    if (read.chests) {
                        for (var tile in read.chests) {
                            var chest = read.chests[tile];
                            this._tileEntities[tile] = new DefaultTileEntityFiller();
                            for (var i in chest) {
                                var slot = chest[i];
                                this._tileEntities[tile]._slots[slot[0]] = slot[1];
                            }
                        }
                    }
                    break;
                default:
                    throw new Error("Unknown version \"" + read.version + "\".");
            }
        }
        else {
            this._structure = read;
        }
        if (version != Structure.versionSaver)
            this.writeInFile(FileName);
        Structure.structures[FileName] = this;
    };
    Structure.prototype.writeInFile = function (FileName) {
        var saveObject = {
            version: Structure.versionSaver,
            structure: this._structure
        };
        if (Object.keys(this._tileEntities).length)
            saveObject.tile_entities = this._tileEntities;
        FileTools.mkdir(__dir__ + "/" + Structure.dir);
        FileTools.WriteText(__dir__ + "/" + Structure.dir + "/" + FileName + ".struct", JSON.stringify(saveObject));
    };
    Structure.prototype.addBlock = function (x, y, z, id, data, tileEntityRandomize) {
        if (!Utility.isInt(x))
            throw new TypeError('"' + x + '" is not a integer.');
        if (!Utility.isInt(y))
            throw new TypeError('"' + y + '" is not a integer.');
        if (!Utility.isInt(z))
            throw new TypeError('"' + z + '" is not a integer.');
        if (!Utility.isInt(id))
            throw new TypeError('"' + id + '" is not a integer.');
        var block = [x, y, z];
        var blockInfo = id;
        if (data != undefined && data != 0) {
            if (!Utility.isInt(data))
                throw new TypeError('"' + data + '" is not a integer.');
            blockInfo = {
                id: blockInfo,
                data: data
            };
        }
        block.push(blockInfo);
        if (tileEntityRandomize != undefined) {
            if (typeof (tileEntityRandomize) == "string") {
                var _tileEntityRandomize = new TileEntityRandomize();
                _tileEntityRandomize.add(1, tileEntityRandomize);
                tileEntityRandomize = _tileEntityRandomize;
            }
            else if (!(tileEntityRandomize instanceof TileEntityRandomize)) {
                throw new TypeError("tileEntityRandomize must be TileEntityRandomize.");
            }
            block.push(tileEntityRandomize);
        }
        this._structure.push(block);
    };
    Structure.prototype.addTileEntity = function (name, tileEntityFiller) {
        if (typeof (name) != "string")
            throw new TypeError('"' + name + '" is not a string.');
        if (this._tileEntities.hasOwnProperty(name))
            throw new Error("TileEntity " + name + " already exists in the structure.");
        if (!(tileEntityFiller instanceof TileEntityFiller))
            throw new TypeError('tileEntityFiller is not a TileEntityFiller.');
        this._tileEntities[name] = tileEntityFiller;
    };
    Structure.prototype.get = function (x, y, z, rotates, blockSource) {
        if (blockSource == undefined)
            blockSource = BlockSource.getCurrentWorldGenRegion();
        if (rotates instanceof Rotate) {
            rotates = [rotates];
        }
        else if (Array.isArray(rotates)) {
            if (typeof rotates[0] == "number") {
                rotates = [new Rotate(rotates)];
            }
            else {
                for (var i in rotates)
                    if (Array.isArray(rotates[i]))
                        rotates[i] = new Rotate(rotates[i]);
            }
        }
        for (var i = 0; i < rotates.length; i++) {
            var rotate = rotates[i], k = 0, l = this._structure.length;
            for (; k < l; k++) {
                var blockInfo = this._structure[k];
                var deltaPos = rotate.getPosition(blockInfo[0], blockInfo[1], blockInfo[2]), id = blockInfo[3], data = 0;
                if (typeof (id) == "object") {
                    data = id.data;
                    id = id.id;
                }
                if (typeof (id) == "string")
                    id = BlockID[id] || 1;
                var block = _World.getBlock(x + deltaPos.x, y + deltaPos.y, z + deltaPos.z, blockSource);
                if (block.id != id || block.data != data)
                    break;
            }
            if (k == l)
                return i;
        }
        return -1;
    };
    Structure.prototype.build = function (x, y, z, rotates, random, blockSource) {
        random = Utility.getRandom(random);
        if (blockSource == undefined)
            blockSource = BlockSource.getCurrentWorldGenRegion();
        var rotate = Rotate.getRotate(rotates, random);
        for (var i = this._structure.length - 1; i >= 0; i--) {
            var blockInfo = this._structure[i];
            var deltaPos = rotate.getPosition(blockInfo[0], blockInfo[1], blockInfo[2]), id = blockInfo[3], data = 0;
            if (typeof (id) == "object") {
                data = id.data;
                id = id.id;
            }
            if (typeof (id) == "string")
                id = BlockID[id] || 1;
            _World.setBlock(x + deltaPos.x, y + deltaPos.y, z + deltaPos.z, id, data, blockSource);
            if (blockInfo[4] instanceof TileEntityRandomize) {
                var TE_name = blockInfo[4].get(random.nextFloat());
                if (TE_name) {
                    var TE_Filler = this._tileEntities[TE_name];
                    var TE = World.getContainer(x + deltaPos.x, y + deltaPos.y, z + deltaPos.z, blockSource);
                    if (TE instanceof ItemContainer)
                        TE = World.addTileEntity(x, y, z, blockSource);
                    TE_Filler.fill(TE, random);
                }
            }
        }
    };
    Structure.dir = "structures";
    Structure.structures = {};
    Structure.versionSaver = 3;
    return Structure;
}());
EXPORT("Structure", Structure);
