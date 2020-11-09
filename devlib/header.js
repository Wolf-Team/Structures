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