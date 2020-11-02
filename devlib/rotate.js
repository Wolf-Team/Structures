var Rotate = function(r){
	this._rotates = [];

	if(r){
		if(r instanceof Array && (r[0] instanceof Array || r[0] instanceof Rotate)){
			this.addRotates(r);
		}else{
			this.addRotate(r);
		}
	}
}
Rotate.prototype.addRotate = function(matrix){
	if(!matrix instanceof Array && !matrix instanceof Rotate)
		throw "is not matrix";
	
	if(matrix instanceof Rotate)
		return this.addRotates(matrix.get());
	
	if(matrix.length != 9) throw "Not 9 number";
	
	for(let i = 0; i < 9; i++)
		if(Math.abs(matrix[i]) > 1)
			throw "Not normal matrix";
	
	this._rotates.push(matrix);
}
Rotate.prototype.addRotates = function(rotates){
	if(!rotates instanceof Array) throw "is not array";
	
	for(let i = 0; i < rotates.length; i++)
		this.addRotate(rotates[i]);
}
Rotate.prototype.get = function(){
	return this._rotates;
}
Rotate.prototype.getPosition = function(x,y,z){
    for(var j = 0, l = this._rotates.length; j < l; j++){
        let dx = x * this._rotates[j][0] + y * this._rotates[j][1] + z * this._rotates[j][2];
        let dy = x * this._rotates[j][3] + y * this._rotates[j][4] + z * this._rotates[j][5];
        let dz = x * this._rotates[j][6] + y * this._rotates[j][7] + z * this._rotates[j][8];
        x = dx;
        y = dy;
        z = dz;
    }
    return {x:x, y:y, z:z};
}
//Syns
Rotate.prototype.add = Rotate.prototype.addRotate;
Rotate.prototype.adds = Rotate.prototype.addRotates;

Rotate.getRotate = function(rotates, random){
	random = Utility.getRandom(random);

    if(rotates == undefined)
        return new Rotate(Structure.ROTATE_NONE);

    if(rotates instanceof Array && (rotates[0] instanceof Array || rotates[0] instanceof Rotate))
        rotates = rotates[random.nextInt(rotates.length)];
    
	return (rotates instanceof Rotate) ? rotates : new Rotate(rotates);
}

EXPORT("Rotate", Rotate);