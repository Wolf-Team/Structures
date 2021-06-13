declare var Random: typeof java.util.Random;
declare type Random = java.util.Random;
declare type Dict<T = any> = {
    [key: string]: T;
};
interface Slot {
    id: number | string;
    data?: number;
    count?: number;
}
declare namespace _World {
    function setBlock(x: number, y: number, z: number, id: number, data: number, blockSource?: BlockSource): void;
    function getBlock(x: number, y: number, z: number, blockSource?: BlockSource): BlockState;
}
declare namespace Utility {
    function getRandom(random: Random | null): Random;
    function isInt(x: number): boolean;
    function getSID(ID: number | string): string;
    function checkSlot(slot: any): boolean;
}
declare type ChanceTileEntity = {
    [chance: string]: string;
};
declare class TileEntityRandomize {
    private _tileEntitysName;
    static parse(tileEntitys: ChanceTileEntity): TileEntityRandomize;
    add(chance: number, nameTE: string): void;
    get(chance: Random | number): string | null;
    isEmpty(): boolean;
    private toJSON;
}
declare type MatrixRotate = [number, number, number, number, number, number, number, number, number];
declare type _MatrixRotate = MatrixRotate | Rotate;
declare class Rotate {
    private _rotates;
    constructor(rotates?: _MatrixRotate | _MatrixRotate[]);
    addRotate(matrix: _MatrixRotate): void;
    addRotates(rotates: _MatrixRotate[]): void;
    get(): MatrixRotate[];
    getPosition(x: number, y: number, z: number): Vector;
    static getRotate(rotates?: _MatrixRotate[], random?: Random): Rotate;
    static readonly ROTATE_NONE: MatrixRotate;
    static readonly ROTATE_90Y: MatrixRotate;
    static readonly ROTATE_180Y: MatrixRotate;
    static readonly ROTATE_270Y: MatrixRotate;
    static readonly ROTATE_90X: MatrixRotate;
    static readonly ROTATE_180X: MatrixRotate;
    static readonly ROTATE_270X: MatrixRotate;
    static readonly ROTATE_90Z: MatrixRotate;
    static readonly ROTATE_180Z: MatrixRotate;
    static readonly ROTATE_270Z: MatrixRotate;
    static readonly MIRROR_X: MatrixRotate;
    static readonly MIRROR_Y: MatrixRotate;
    static readonly MIRROR_Z: MatrixRotate;
    static readonly ROTATE_Y: MatrixRotate[];
    static readonly ROTATE_ALL: MatrixRotate[];
    static readonly ROTATE_RANDOM: MatrixRotate[];
}
interface ITileEntityFiller {
    type: string;
}
declare class TileEntityFiller implements ITileEntityFiller {
    private static _filler;
    static register(filler: typeof TileEntityFiller): void;
    static parseJSON(json: ITileEntityFiller): TileEntityFiller;
    type: string;
    fill(TE: ItemContainer | TileEntity | NativeTileEntity, random: Random): void;
    parseJSON(json: ITileEntityFiller): void;
    toJSON(): ITileEntityFiller;
}
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
    id: string | number;
    meta?: number;
    data?: number;
    rarity: number;
    count: number | {
        min: number;
        max: number;
    };
}
interface IAPOFiller extends ITileEntityFiller {
    items: APOItem[];
}
declare class APOFiller extends TileEntityFiller {
    readonly type: string;
    private _items;
    constructor(items?: APOItem[]);
    fill(TE: ItemContainer | TileEntity | NativeTileEntity, random: Random): void;
    parseJSON(json: IAPOFiller): void;
    toJSON(): IAPOFiller;
}
interface IDefaultTileEntityFiller extends ITileEntityFiller {
    slots: Dict<ItemInstance>;
    data: Dict<any>;
}
declare class DefaultTileEntityFiller extends TileEntityFiller {
    readonly type: string;
    _slots: Dict<ItemInstance>;
    private _data;
    constructor(slots?: any, data?: any);
    fill(TE: ItemContainer | TileEntity | NativeTileEntity, random: Random): void;
    parseJSON(json: IDefaultTileEntityFiller): void;
    toJSON(): IDefaultTileEntityFiller;
}
declare class Structure {
    static dir: string;
    private static structures;
    private static versionSaver;
    static get(file: string): Structure;
    private _structure;
    private _tileEntities;
    constructor(file?: string);
    clear(): void;
    readFromFile(FileName: string): void;
    writeInFile(FileName: string): void;
    addBlock(x: number, y: number, z: number, id: number, data: number, tileEntityRandomize: TileEntityRandomize): void;
    addTileEntity(name: string, tileEntityFiller: TileEntityFiller): void;
    get(x: number, y: number, z: number, rotates?: Rotate[], blockSource?: BlockSource): number;
    check: (x: number, y: number, z: number, rotates?: Rotate[], blockSource?: BlockSource) => boolean;
    build(x: number, y: number, z: number, rotates?: Rotate[], random?: Random, blockSource?: BlockSource): void;
    destroy: (x: number, y: number, z: number, rotates?: Rotate[], blockSource?: BlockSource) => void;
}
