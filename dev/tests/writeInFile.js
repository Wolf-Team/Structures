let struct = new Structure();

struct.addBlock(0, 1, 0, 5, 2);
struct.addBlock(1, 1, 0, 5, 2);
struct.addBlock(-1, 1, 0, 5, 2);

struct.addBlock(0, 2, 0, 5, 2);
struct.addBlock(0, 3, 0, 5, 4);

struct.addBlock(0, 4, 0, 54, 0, "chest1");

struct.addTileEntity("chest1", {
    0:{ id:5, count:64 }
});

struct.writeInFile("test3");