# StructuresAPI
StructuresAPI - A library that simplifies working with structures.

**en** | [ru](https://github.com/Wolf-Team/StructuresAPI/blob/main/README.RU.md)

## Get Start
Before starting work, you need to import the library.
``` js
IMPORT("StructuresAPI", "*"); // Import all modules
// Or
IMPORT("StructuresAPI", "Structure"); // Import module of structures
IMPORT("StructuresAPI", "Rotate"); // Import module of turns
IMPORT("StructuresAPI", "TileEntityRandomize"); // Import module TileEntityRandomize
IMPORT("StructuresAPI", "TileEntityFiller"); // Import module TileEntityFiller
IMPORT("StructuresAPI", "DefaultTileEntityFiller"); // Import DefaultTileEntityFiller
IMPORT("StructuresAPI", "APOFiller"); // Import filler from APOCraft
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
APOFiller migrated straight from [A.P.O. Craft] (https://github.com/mineprogramming/APO_craft). Supports only native TileEntity. The file has the following format:
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
### Custom placeholders
Not found info, oops :(

## Older versions:
* [StructuresAPI v1.4](https://github.com/Wolf-Team/Libraries/blob/master/StructuresAPI.js)
* [StructuresAPI v1.3](https://github.com/Wolf-Team/Libraries/blob/dcae52f5e030cb0b10ad2f3fee35c74542857890/StructuresAPI.js)
* [StructuresAPI v1.2](https://github.com/Wolf-Team/Libraries/blob/e76e8ba4721eb8b6b42e29bf521578f1cf7b20ee/StructuresAPI.js)
* [StructuresAPI v1.1](https://github.com/Wolf-Team/Libraries/blob/da4e232f4253e7e6efff1f42776ad52546efa7d8/StructuresAPI.js)
* [StructuresAPI v1.0](https://github.com/Wolf-Team/Libraries/blob/37c31935a31605579a6295a65cabd062eaf77adb/StructuresAPI.js)