function TileEntityFiller(){}

TileEntityFiller.__filler = {};
TileEntityFiller.register = function(type, filler){
    if(TileEntityFiller.__filler.hasOwnProperty(type))
        throw new Error();

    Utility.extends(filler, TileEntityFiller);
    TileEntityFiller.__filler[type] = filler;
    filler.prototype.type = type;
}
TileEntityFiller.parseJSON = function(json){
    if(!TileEntityFiller.__filler.hasOwnProperty(json.type))
        throw new Error("Not found TileEntityFiller " + json.type);
    
    let filler = new TileEntityFiller.__filler[json.type]();
    filler.parseJSON(json);
    return filler;
}

TileEntityFiller.prototype.type = null;
TileEntityFiller.prototype.fill = function(TE, random){}
TileEntityFiller.prototype.parseJSON = function(json){}
TileEntityFiller.prototype.toJSON = function(){
    return {type:this.type};
}

EXPORT("TileEntityFiller", TileEntityFiller);