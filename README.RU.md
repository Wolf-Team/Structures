# Structures 2.0
Structures - Библиотека, упрощающая работу со структурами.

[en](https://github.com/Wolf-Team/Structures/blob/main/README.md) | **ru**

## Начать
Перед началом работы, требуется импортировать библиотеку.
``` js
IMPORT("Structures", "*"); // Импортировать все модули
// Или
IMPORT("Structures", "Structure"); // Импортировать модулю структур
IMPORT("Structures", "Rotate"); // Импортировать модуль поворотов
IMPORT("Structures", "TileEntityRandomize"); // Импортировать модуль TileEntityRandomize
IMPORT("Structures", "TileEntityFiller"); // Импортировать модуль TileEntityFiller
IMPORT("Structures", "DefaultTileEntityFiller"); // Импортировать DefaultTileEntityFiller
IMPORT("Structures", "APOFiller"); // Импортировать заполнитель из APOCraft
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

## Структура файла структуры
```js
{
    "version":3,//int - версия структуры файла
    "structures":[], // Массив блоков формата [int x, int y, int z, ItemInstance item, TileEntityRandomize? radom_te]
    "tile_entities":{} // Список заполнителей TE
}
```

TileEntityRandomize является объектом формата *"Шанс":"Имя заполнителя"*. Шанс указывается от 0 до 1.
```js
{
    "1":"test_te"
}
```

Заполнители TE имеют формат *"Имя заполнителя":{Данные заполнителя}*
```js
"test_te":{ // Заполнитель TE с именем test_te
    "type":"default_filler",// Тип заполнителя (ОБЯЗАТЕЛЬНО)
    ... // Данные заполнителя
}
```

## Стандартные заполнители
### DefaultTileEntityFiller
DefaultTileEntityFiller заполняет TileEntity указаным содержимым. Поддерживает как нативные, так и кастомные TileEntity. В файле имеет следующий формат:
```js
{
    "type":"default_filler",
    "slots":{},//Объект формата "Имя слота":ItemInstance.
    "data":{} //Данные TileEntity
}
```
### APOFiller
APOFiller перекочевал прямиком из [A.P.O. Craft](https://github.com/mineprogramming/APO_craft). Поддерживает только нативные TileEntity. В файле имеет следующий формат:
```js
{
    "type":"apo_filler",
    "items":[// Массив предметов, которые могут быть сгенерированы внутри TileEntity
        {
            "id": 5, // int - ID предмета
            "data": 1, // int - data предмета
            "rarity": 1, // float - Шанс генерации предмета, от 0 до 1
            "count": 4 // int | {"min":int, "max":int} - Количество генерируемого предмета. Если количество задано в виде объекта, то оно генерируется случайным образом.
        },
    ]
}
```
### Кастомные заполнители
```js
function CustomTileEntityFiller(){
};
//Регистрация заполнителя (Обязательно)
TileEntityFiller.register("custom_filler", CustomTileEntityFiller);

/**
 * Заполнение TileEntity
 * @param TE - NativeTileEntity | TileEntity
 * @param random - java.lang.Random
 */
CustomTileEntityFiller.prototype.fill = function(TE, random){}
/**
 * Чтение заполнителя из файла
 * @param json - object from File
 */
CustomTileEntityFiller.prototype.parseJSON = function(json){}
/**
 * Запись заполнителя в файл
 */
CustomTileEntityFiller.prototype.toJSON = function(){
    //Получить JSON от родительского заполнителя. (Обязательно)
    let json = CustomTileEntityFiller.superclass.toJSON.apply(this);
    //Здесь добавить свои данные
    return json;
}
```

## Старые версии:
* [StructuresAPI v1.4](https://github.com/Wolf-Team/Libraries/blob/master/StructuresAPI.js)
* [StructuresAPI v1.3](https://github.com/Wolf-Team/Libraries/blob/dcae52f5e030cb0b10ad2f3fee35c74542857890/StructuresAPI.js)
* [StructuresAPI v1.2](https://github.com/Wolf-Team/Libraries/blob/e76e8ba4721eb8b6b42e29bf521578f1cf7b20ee/StructuresAPI.js)
* [StructuresAPI v1.1](https://github.com/Wolf-Team/Libraries/blob/da4e232f4253e7e6efff1f42776ad52546efa7d8/StructuresAPI.js)
* [StructuresAPI v1.0](https://github.com/Wolf-Team/Libraries/blob/37c31935a31605579a6295a65cabd062eaf77adb/StructuresAPI.js)