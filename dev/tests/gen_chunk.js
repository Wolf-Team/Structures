if (__config__.getBool("test_gen_chun")) {
    let struct = new Structure("gen_chunk");

    Callback.addCallback("GenerateChunk", function (chunkX, chunkZ, random, dimensionId) {
        if (random.nextFloat() < .25) {

            var coords = GenerationUtils.randomCoords(chunkX, chunkZ);
            coords = GenerationUtils.findSurface(coords.x, 95, coords.z);
            if (coords.y < 52) return;

            let region = BlockSource.getCurrentWorldGenRegion();

            struct.build(coords.x, coords.y + 1, coords.z, Structure.ROTATE_Y, random, region);
        }
    });
}