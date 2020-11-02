Structure.ROTATE_NONE = [
	1,0,0,
	0,1,0,
	0,0,1
];
	
Structure.ROTATE_90Y = [
	0,0,-1,
	0,1,0,
	1,0,0
];
Structure.ROTATE_180Y = [
	-1,0,0,
	0,1,0,
	0,0,-1
];
Structure.ROTATE_270Y = [
	0,0,1,
	0,1,0,
	-1,0,0
];
	
Structure.ROTATE_90X = [
	1,0,0,
	0,0,-1,
	0,1,0
];
Structure.ROTATE_180X = [
	1,0,0,
	0,-1,0,
	0,0,-1
];
Structure.ROTATE_270X = [
	1,0,0,
	0,0,1,
	0,-1,0
];
	
Structure.ROTATE_90Z = [
	0,-1,0,
	1,0,0,
	0,0,1
];
Structure.ROTATE_180Z = [
	-1,0,0,
	0,-1,0,
	0,0,1
];
Structure.ROTATE_270Z = [
	0,1,0,
	-1,0,0,
	0,0,1
];

Structure.ROTATE_RANDOM = [
	Structure.ROTATE_180X,
	Structure.ROTATE_180Y,
	Structure.ROTATE_180Z,
	Structure.ROTATE_270X,
	Structure.ROTATE_270Y,
	Structure.ROTATE_270Z,
	Structure.ROTATE_90X,
	Structure.ROTATE_90Y,
	Structure.ROTATE_90Z,
	Structure.ROTATE_NONE
];
Structure.ROTATE_ALL = Structure.ROTATE_RANDOM;
Structure.ROTATE_Y = [
	Structure.ROTATE_NONE,
	Structure.ROTATE_90Y,
	Structure.ROTATE_180Y,
	Structure.ROTATE_270Y
];

Structure.MIRROR_X = [
	-1,0,0,
	0,1,0,
	0,0,1
];
Structure.MIRROR_Y = [
	1,0,0,
	0,-1,0,
	0,0,1
];
Structure.MIRROR_Z = [
	1,0,0,
	0,1,0,
	0,0,-1
];

Structure.PROGRESSIVELY = true;
Structure.NOT_PROGRESSIVELY = false;

Structure.get = function(name, alerted) {
	if(StructuresDB.structures.hasOwnProperty(name))
		return StructuresDB.structures[name];
	else
		return new Structure(name, alerted);
}
Structure.init = function(folderName){
	if(typeof folderName != "string" && !(folderName instanceof java.lang.String))
		throw "folderName is not string.";
		
	StructuresDB.folderName = folderName;
}
Structure.setInWorld = function(name, x, y, z, rotate, progressively, time){
	Structure.get(name).set(x, y, z, rotate, progressively, time);
}
Structure.destroyInWorld = function(name, x, y, z, rotate, progressively, time){
	Structure.get(name).destroy(x, y, z, rotate, progressively, time);
}