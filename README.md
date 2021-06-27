# Structures 2.1
Structures - A library that simplifies working with structures.

**en** | [ru](https://github.com/Wolf-Team/Structures/blob/main/README.RU.md)

## Get Start
Before starting work, you need to import the library.
``` js
IMPORT("Structures", "*"); // Import all modules
// Or
IMPORT("Structures", "Structure"); // Import module of structures
IMPORT("Structures", "Rotate"); // Import module of turns
IMPORT("Structures", "TileEntityRandomize"); // Import module TileEntityRandomize
IMPORT("Structures", "TileEntityFiller"); // Import module TileEntityFiller
IMPORT("Structures", "DefaultTileEntityFiller"); // Import DefaultTileEntityFiller
IMPORT("Structures", "APOFiller"); // Import filler from APOCraft
```

## Save structure in file
Create a structure using the Structure constructor
```js
let struct = new Structure();
```
Then add data to the structure with the addBlock and addTileEntity methods
```js
struct.addBlock(1, 1, 0, 5, 2);
struct.addBlock(0, 2, 0, 5, 2);
struct.addBlock(0, 3, 0, 5, 4);
struct.addBlock(0, 4, 0, 54, 0, "chest1");

struct.addTileEntity("chest1", new DefaultTileEntityFiller({
    0:{ id:5, count:64 }
}));
```
Invoke writeInFile method
```js
struct.writeInFile("structName");
```

## Putting structure into the world
To set the structure in the world, use the build (x, y, z, rotates, random ?, region?) Method, where:
* int x - X coordinate
* int y - Y coordinate
* int z - Z coordinate
* Rotate | Array <Rotate> rotates - Rotation or array of rotations. Rotation will be randomly selected from the array
* java.util.Random random - A random object to get random values
* BlockSource region
```js
Callback.addCallback("ItemUse", function(coords, item, block, isExteral, player){
    let region = BlockSourse.getDefaultForActor(player);
    struct.build(coords.x,
                 coords.y,
                 coords.z, Structure.ROTATE_NONE, null, region);
})
```

## Structure file structure
```js
{
    "version":3,//int - file structure version
    "structures":[], // An array of blocks of the format [int x, int y, int z, ItemInstance item, TileEntityRandomize? radom_te]
    "tile_entities":{} // List of TE filler
}
```

TileEntityRandomize is an object of the format *"Chance":"Filler Name"*. The chance is indicated from 0 to 1.
```js
{
    "1":"test_te"
}
```

TE fillers have the format *"Filler Name": {Filler Data}*
```js
"test_te":{ // TE filler named test_te
    "type":"default_filler", // Filler type (REQUIRED)
    ... // Filler data
}
```

## Standard fillers
### DefaultTileEntityFiller
DefaultTileEntityFiller fill the TileEntity with the specified content. Supports native and custom TileEntity. The file has the following format:
```js
{
    "type":"default_filler",
    "slots":{},//Object of format "Slot name": ItemInstance.
    "data":{} //TileEntity data
}
```
### APOFiller
APOFiller migrated straight from [A.P.O. Craft](https://github.com/mineprogramming/APO_craft). Supports only native TileEntity. The file has the following format:
```js
{
    "type":"apo_filler",
    "items":[// Array of items that can be generated inside TileEntity
        {
            "id": 5, // int - item ID
            "data": 1, // int - item data
            "rarity": 1, // float - Item Generation Chance, from 0 to 1
            "count": 4 // int | {"min":int, "max":int} - The amount of generated item. If the quantity is specified as an object, then it is generated randomly.
        },
    ]
}
```
### Custom filler
```ts
class CustomTileEntityFiller extends TileEntityFiller{
    /**
     * Filling TileEntity
     */
    public fill(TE:ItemContainer | TileEntity | NativeTileEntity, random:java.lang.Random): void {}

    /**
     * Read from file
     */
    public parseJSON(json:ITileEntityFiller): void {}
    
    /**
     * Write in file
     */
    public toJSON(): ITileEntityFiller {
        //Get JSON from parent filler. (Required)
        let json = super.toJSON();
        //Here adding your data
        return json;
    }
}
//Register filler (Required)
TileEntityFiller.register("custom_filler", CustomTileEntityFiller);
```

```js
IMPORT("extends", "__extends");

function CustomTileEntityFiller(){
    TileEntityFiller.call(this)
};
__extends(CustomTileEntityFiller, TileEntityFiller);

/**
 * Filling TileEntity
 */
CustomTileEntityFiller.prototype.fill = function(TE, random){}
/**
 * Read from file
 */
CustomTileEntityFiller.prototype.parseJSON = function(json){}
/**
 * Write in file
 */
CustomTileEntityFiller.prototype.toJSON = function(){
    //Get JSON from parent filler. (Required)
    let json = TileEntityFiller.prototype.toJSON.call(this);
    //Here adding your data
    return json;
}

//Register filler (Required)
TileEntityFiller.register("custom_filler", CustomTileEntityFiller);
```

## Older versions:
* [StructuresAPI v2.0](https://github.com/Wolf-Team/Structures/tree/r2.0)
* [StructuresAPI v1.4](https://github.com/Wolf-Team/Libraries/blob/master/StructuresAPI.js)
* [StructuresAPI v1.3](https://github.com/Wolf-Team/Libraries/blob/dcae52f5e030cb0b10ad2f3fee35c74542857890/StructuresAPI.js)
* [StructuresAPI v1.2](https://github.com/Wolf-Team/Libraries/blob/e76e8ba4721eb8b6b42e29bf521578f1cf7b20ee/StructuresAPI.js)
* [StructuresAPI v1.1](https://github.com/Wolf-Team/Libraries/blob/da4e232f4253e7e6efff1f42776ad52546efa7d8/StructuresAPI.js)
* [StructuresAPI v1.0](https://github.com/Wolf-Team/Libraries/blob/37c31935a31605579a6295a65cabd062eaf77adb/StructuresAPI.js)