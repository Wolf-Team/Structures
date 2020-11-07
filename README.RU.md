# StructuresAPI
StructuresAPI - Библиотека, упрощающая работу со структурами.

## Начать
Перед началом работы, требуется импортировать библиотеку.
``` js
IMPORT("StructuresAPI", "*"); // Импортировать все модули
// Или
IMPORT("StructuresAPI", "Structure"); // Импортировать модулю структур
IMPORT("StructuresAPI", "Rotate"); // Импортировать модуль поворотов
IMPORT("StructuresAPI", "TileEntityRandomize"); // Импортировать модуль TileEntityRandomize
IMPORT("StructuresAPI", "TileEntityFiller"); // Импортировать модуль TileEntityFiller
IMPORT("StructuresAPI", "DefaultTileEntityFiller"); // Импортировать модуль DefaultTileEntityFiller
```

## Сохранение структур в файл
Создайте структуру с помощью конструктора Structure
```js
let struct = new Structure();
```
Затем добавьте в структуру данные методами addBlock и addTileEntity
```js
struct.addBlock(1, 1, 0, 5, 2);
struct.addBlock(0, 2, 0, 5, 2);
struct.addBlock(0, 3, 0, 5, 4);
struct.addBlock(0, 4, 0, 54, 0, "chest1");

struct.addTileEntity("chest1", new DefaultTileEntityFiller({
    0:{ id:5, count:64 }
}));
```
Вызовите метод writeInFile
```js
struct.writeInFile("structName");
```

## Установка структуры в мир
Для установки структуры в мире используется метод build(x, y, z, rotates, random?, region?), где:
* int x - координата X
* int y - координата Y
* int z - координата Z
* Rotate|Array<Rotate> rotates - Поворот или массив поворотов. Из массива поворот будет выбран случайным образом
* java.util.Random random - Объект рандома для получения случайных значений
* BlockSource region
```js
Callback.addCallback("ItemUse", function(coords, item, block, isExteral, player){
    let region = BlockSourse.getDefaultForActor(player);
    struct.build(coords.x,
                 coords.y,
                 coords.z, Structure.ROTATE_NONE, null, region);
})
```


## Старые версии:
* [StructuresAPI v1.4](https://github.com/Wolf-Team/Libraries/blob/master/StructuresAPI.js)
* [StructuresAPI v1.3](https://github.com/Wolf-Team/Libraries/blob/dcae52f5e030cb0b10ad2f3fee35c74542857890/StructuresAPI.js)
* [StructuresAPI v1.2](https://github.com/Wolf-Team/Libraries/blob/e76e8ba4721eb8b6b42e29bf521578f1cf7b20ee/StructuresAPI.js)
* [StructuresAPI v1.1](https://github.com/Wolf-Team/Libraries/blob/da4e232f4253e7e6efff1f42776ad52546efa7d8/StructuresAPI.js)
* [StructuresAPI v1.0](https://github.com/Wolf-Team/Libraries/blob/37c31935a31605579a6295a65cabd062eaf77adb/StructuresAPI.js)