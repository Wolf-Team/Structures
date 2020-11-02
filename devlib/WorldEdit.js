if(JSON.parse(FileTools.ReadText(__dir__+"build.config")).defaultConfig.buildType == "develop"){
	ModAPI.addAPICallback("WorldEdit", function(WorldEdit){
		var g_center = null;
		
		Callback.addCallback("ItemUse", function(c,i){
			if(i.id == 268){
				g_center = c;
				Game.message(Translation.translate("The zero point of the structure is set."));
			}
			if(i.id == 271){
				g_center = null;
			}
		});
		Callback.addCallback("DestroyBlockStart", function() {
			if(Player.getCarriedItem().id == 271){
				g_center = null;
			}
		});
		
		WorldEdit.addCommand({
			name:"/save",
			description:"Save structure.",
			args:"<file_name> [-a] [-x] [-y] [-z]",
			selectedArea:true,
			event:function(args){
				var pos = WorldEdit.getPosition();
				let chest = 0, te = 0;
				
				let struct = Structure.get(args[0], false);
				struct.clear();
				
				var center_x = args.indexOf("-x")!=-1 ? args[args.indexOf("-x") + 1] : g_center!= null? g_center.x : pos.pos1.x;
				var center_y = args.indexOf("-y")!=-1 ? args[args.indexOf("-y") + 1] : g_center!= null? g_center.y : pos.pos1.y;
				var center_z = args.indexOf("-z")!=-1 ? args[args.indexOf("-z") + 1] : g_center!= null? g_center.z : pos.pos1.z;
				
				for(x = pos.pos1.x; x <= pos.pos2.x; x++)
					for(y = pos.pos1.y; y <= pos.pos2.y; y++)
						for(z = pos.pos1.z; z <= pos.pos2.z; z++){
							var block = World.getBlock(x,y,z);
							if(args.indexOf("-a") == -1 && block.id == 0) continue;
							
							let TE = World.getTileEntity(x,y,z);
							
							if([54, 61, 62, 154].indexOf(block.id) != -1){
								struct.addBlock(x - center_x, y - center_y, z - center_z, block, "chest_" + chest);
								struct.addChest("chest_"+chest, World.getContainer(x, y, z));
								chest++;
							} else if(TE){
								struct.addBlock(x - center_x, y - center_y, z - center_z, block, "TE_" + te);
								struct.addTileEntity("TE_" + te, TE);
								te++;
							}else{
								struct.addBlock(x - center_x, y - center_y, z - center_z, block);
							}

						}
				
				struct.save();
				Game.message(Translation.sprintf("Saved to %s", StructuresDB.dir+"/"+args[0]+".struct"));
			}
		});
	});
}