/* TODO
* add timer
*/

class Structure {
    public static dir: string = "structures";

    private static structures: Dict<Structure> = {};
    private static versionSaver: number = 3;

    public static get(file: string): Structure {
        if (Structure.structures.hasOwnProperty(file))
            return Structure.structures[file];
        else
            return new Structure(file);
    }

    private _structure: any[] = [];
    private _tileEntities: Dict<TileEntityFiller> = {};

    constructor(file?: string) {
        this.clear();
        if (file != undefined)
            this.readFromFile(file);
    }

    public clear() {
        this._structure = [];
        this._tileEntities = {};
    }

    public readFromFile(FileName: string) {
        let path = __dir__ + "/" + Structure.dir + "/" + FileName + ".struct";
        if (!FileTools.isExists(path))
            throw new Error("File \"" + FileName + ".struct\" not found.");

        let version = 0;
        let read = JSON.parse(FileTools.ReadText(path));

        if (read.version) {
            version = read.version;
            switch (read.version) {
                case 3:
                    this._structure = read.structure.map(function (i) {
                        if (i[4])
                            i[4] = TileEntityRandomize.parse(i[4]);

                        return i;
                    });
                    for (let i in read.tile_entities)
                        this._tileEntities[i] = TileEntityFiller.parseJSON(read.tile_entities[i]);

                    break;
                case 2:
                    this._structure = read.structure.map(function (block) {
                        if (block[4]) {
                            let ter = new TileEntityRandomize();
                            ter.add(1, block[4]);
                            block[4] = ter;
                        }
                        return block;
                    });
                    if (read.te)
                        for (let i in read.te)
                            this._tileEntities[i] = new DefaultTileEntityFiller(read.te[i].slots, read.te[i].data);


                    if (read.chests) {
                        for (let tile in read.chests) {
                            let chest = read.chests[tile]
                            this._tileEntities[tile] = new DefaultTileEntityFiller();
                            for (let i in chest) {
                                let slot = chest[i];
                                (<DefaultTileEntityFiller>this._tileEntities[tile])._slots[slot[0]] = slot[1];
                            }
                        }
                    }

                    break;
                case 1:
                    this._structure = read.struture.map(function (block) {
                        if (block[4]) {
                            let ter = new TileEntityRandomize();
                            ter.add(1, block[4]);
                            block[4] = ter;
                        }
                        return block;
                    });
                    if (read.chests) {
                        for (let tile in read.chests) {
                            let chest = read.chests[tile]
                            this._tileEntities[tile] = new DefaultTileEntityFiller();
                            for (let i in chest) {
                                let slot = chest[i];
                                (<DefaultTileEntityFiller>this._tileEntities[tile])._slots[slot[0]] = slot[1];
                            }
                        }
                    }
                    break;
                default:
                    throw new Error("Unknown version \"" + read.version + "\".");
            }
        } else {
            this._structure = read;
        }

        if (version != Structure.versionSaver)
            this.writeInFile(FileName);

        Structure.structures[FileName] = this;
    }

    public writeInFile(FileName: string) {
        let saveObject: Dict = {
            version: Structure.versionSaver,
            structure: this._structure
        };

        if (Object.keys(this._tileEntities).length)
            saveObject.tile_entities = this._tileEntities;

        FileTools.mkdir(__dir__ + "/" + Structure.dir);
        FileTools.WriteText(__dir__ + "/" + Structure.dir + "/" + FileName + ".struct", JSON.stringify(saveObject));
    }

    public addBlock(x: number, y: number, z: number, id: number, data: number, tileEntityRandomize: TileEntityRandomize) {
        if (!Utility.isInt(x))
            throw new TypeError('"' + x + '" is not a integer.');
        if (!Utility.isInt(y))
            throw new TypeError('"' + y + '" is not a integer.');
        if (!Utility.isInt(z))
            throw new TypeError('"' + z + '" is not a integer.');

        if (!Utility.isInt(id))
            throw new TypeError('"' + id + '" is not a integer.');

        let block: any = [x, y, z];

        let blockInfo: any = id;
        if (data != undefined && data != 0) {
            if (!Utility.isInt(data))
                throw new TypeError('"' + data + '" is not a integer.');

            blockInfo = {
                id: blockInfo,
                data: data
            }
        }

        block.push(blockInfo);

        if (tileEntityRandomize != undefined) {
            if (typeof (tileEntityRandomize) == "string") {
                let _tileEntityRandomize = new TileEntityRandomize();
                _tileEntityRandomize.add(1, tileEntityRandomize);
                tileEntityRandomize = _tileEntityRandomize;
            } else if (!(tileEntityRandomize instanceof TileEntityRandomize)) {
                throw new TypeError("tileEntityRandomize must be TileEntityRandomize.");
            }

            block.push(tileEntityRandomize);
        }

        this._structure.push(block);
    }

    public addTileEntity(name: string, tileEntityFiller: TileEntityFiller) {
        if (typeof (name) != "string")
            throw new TypeError('"' + name + '" is not a string.');

        if (this._tileEntities.hasOwnProperty(name))
            throw new Error("TileEntity " + name + " already exists in the structure.");

        if (!(tileEntityFiller instanceof TileEntityFiller))
            throw new TypeError('tileEntityFiller is not a TileEntityFiller.');

        this._tileEntities[name] = tileEntityFiller;
    }

    public get(x: number, y: number, z: number, rotates?: Rotate[], blockSource?: BlockSource): number {
        if (blockSource == undefined)
            blockSource = BlockSource.getCurrentWorldGenRegion();

        if (rotates instanceof Rotate) {
            rotates = [rotates];
        } else if (Array.isArray(rotates)) {
            if (typeof rotates[0] == "number") {
                rotates = [new Rotate(rotates)];
            } else {
                for (let i in rotates)
                    if (Array.isArray(rotates[i]))
                        rotates[i] = new Rotate(rotates[i]);
            }
        }

        for (let i = 0; i < rotates.length; i++) {
            let rotate = rotates[i],
                k = 0,
                l = this._structure.length;

            for (; k < l; k++) {
                let blockInfo = this._structure[k];
                let deltaPos = rotate.getPosition(blockInfo[0], blockInfo[1], blockInfo[2]),
                    id = blockInfo[3],
                    data = 0;

                if (typeof (id) == "object") {
                    data = id.data;
                    id = id.id;
                }
                if (typeof (id) == "string")
                    id = BlockID[id] || 1;


                let block = _World.getBlock(x + deltaPos.x, y + deltaPos.y, z + deltaPos.z, blockSource);
                if (block.id != id || block.data != data) break;
            }

            if (k == l)
                return i;
        }

        return -1;
    }

    public check = function (x: number, y: number, z: number, rotates?: Rotate[], blockSource?: BlockSource): boolean {
        return this.get(x, y, z, rotates, blockSource) != -1;
    }

    public build(x: number, y: number, z: number, rotates?: Rotate[], random?: Random, blockSource?: BlockSource) {
        random = Utility.getRandom(random);
        if (blockSource == undefined)
            blockSource = BlockSource.getCurrentWorldGenRegion();

        let rotate = Rotate.getRotate(rotates, random);

        for (let i = this._structure.length - 1; i >= 0; i--) {
            let blockInfo = this._structure[i];
            let deltaPos = rotate.getPosition(blockInfo[0], blockInfo[1], blockInfo[2]),
                id = blockInfo[3],
                data = 0;

            if (typeof (id) == "object") {
                data = id.data;
                id = id.id;
            }
            if (typeof (id) == "string")
                id = BlockID[id] || 1;

            _World.setBlock(x + deltaPos.x, y + deltaPos.y, z + deltaPos.z, id, data, blockSource);

            if (blockInfo[4] instanceof TileEntityRandomize) {
                let TE_name = blockInfo[4].get(random.nextFloat());
                if (TE_name) {
                    let TE_Filler = this._tileEntities[TE_name];
                    let TE: any = World.getContainer(x + deltaPos.x, y + deltaPos.y, z + deltaPos.z, blockSource);
                    if (TE instanceof ItemContainer)
                        TE = World.addTileEntity(x, y, z, blockSource);
                    TE_Filler.fill(TE, random);
                }
            }
        }
    }

    public destroy = function (x: number, y: number, z: number, rotates?: Rotate[], blockSource?: BlockSource) {
        let i = this.get(x, y, z, rotates, blockSource);

        if (blockSource == undefined)
            blockSource = BlockSource.getCurrentWorldGenRegion();

        let rotate = rotates[i];

        for (let i = this._structure.length - 1; i >= 0; i--) {
            let blockInfo = this._structure[i];
            let deltaPos = rotate.getPosition(blockInfo[0], blockInfo[1], blockInfo[2]);

            _World.setBlock(x + deltaPos.x, y + deltaPos.y, z + deltaPos.z, 0, 0, blockSource);
        }
    }
}

EXPORT("Structure", Structure);