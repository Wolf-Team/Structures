var TileEntityRandomize = function(){
    this._tileEntitysName = {};
}
TileEntityRandomize.parse = function(obj){
    if(typeof(obj) != "object")
        throw new TypeError("obj is not a object.");
    
    let ter = new TileEntityRandomize();
    
    for(let i in obj)
        ter.add(i, obj[i]);

    return ter;
}

TileEntityRandomize.prototype.add = function(chance, nameTileEntity){
    if(typeof(chance) != "number")
        throw new TypeError('"'+x+'" is not a number.');

    if(chance <= 0 || chance > 1)
        throw new Error("Chance must be > 0 AND <= 1.");

    if(this._tileEntitysName.hasOwnProperty(chance))
        throw new Error("Chance "+chance+" already register");
    
    if(typeof(nameTileEntity) != "string")
        throw new TypeError('"'+nameTileEntity+'" is not a string.');

    this._tileEntitysName[chance] = nameTileEntity;
}
TileEntityRandomize.prototype.get = function(chance){
    if(this.isEmpty())
        throw new Error("TileEntityRandomize empty.");

    if(typeof(chance) != "number")
        throw new TypeError('"'+x+'" is not a number.');

    if(chance <= 0 || chance > 1)
        throw new Error("Chance must be > 0 AND <= 1.");

    for(let maxChance in this._tileEntitysName)
        if(chance <= parseFloat(maxChance))
            return this._tileEntitysName[maxChance];
            
    return null;
}
TileEntityRandomize.prototype.isEmpty = function(){
    return this._tileEntitysName.isEmpty();
}