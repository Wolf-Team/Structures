if (__config__.getBool("test_addBlock")) {
    let struct = new Structure();

    struct.addBlock(0, 1, 0, 5, 2);
    struct.addBlock(1, 1, 0, 5, 2);
    struct.addBlock(-1, 1, 0, 5, 2);

    struct.addBlock(0, 2, 0, 5, 2);
    struct.addBlock(0, 3, 0, 5, 4);

    struct.addBlock(0, 4, 0, 54, 0, "chest1");

    struct.addTileEntity("chest1", new DefaultTileEntityFiller({
        0: { id: 5, count: 64 }
    }));

    Callback.addCallback("ItemUse", function (coords, item, block, isExternal, player) {
        var x = coords.x;
        var y = coords.y;
        var z = coords.z;
        let blockSource = BlockSource.getDefaultForActor(player);

        switch (item.id) {
            case 280:
                struct.build(x, y, z, Structure.ROTATE_Y, null, blockSource);
                Game.prevent();
                break;
        }

    });
}