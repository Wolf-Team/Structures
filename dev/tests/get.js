if (__config__.getBool("test_get")) {
    let struct = new Structure("test3");
    Callback.addCallback("ItemUse", function (coords, item, block, isExternal, player) {
        var x = coords.x;
        var y = coords.y;
        var z = coords.z;
        let blockSource = BlockSource.getDefaultForActor(player);

        switch (item.id) {
            case 283:
                struct.build(x, y, z, Structure.ROTATE_Y, null, blockSource);
                Game.prevent();
                break;
            case 284:
                alert(struct.get(x, y, z, Structure.ROTATE_Y, blockSource));
                break;
        }
    });
}