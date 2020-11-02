var Utility = {
	isInt:function(x){
		if(typeof(x) != "number")
			throw new TypeError('"'+x+'" is not a number.');

		return (x^0)==x;
	},

	checkSlot:function(slot){
		if(!Utility.isInt(slot.id) && id < 0)
			return false;
		
		if(slot.data !== undefined)
			if(!Utility.isInt(slot.data) && slot.data < 0)
				return false;

		if(slot.count !== undefined)
			if(!Utility.isInt(slot.count) && slot.count < 1)
				return false;
		
		return true;
    },
    
    random:function(min, max){
        if(min === undefined) min=0;
        if(max === undefined) max=min+1;
        
        return (max-min) * Math.random() + min;
    },
    randomI:function(min, max){
        if(min === undefined) min=0;
        if(max === undefined) max=min+10;

        return Math.ceil(Utility.random(min, max));
    },

    getSID:function(ID){
        return IDRegistry.getNameByID(ID) || ID;
    }
}

if(!Object.prototype.isEmpty)
    Object.prototype.isEmpty = function(){
        for(let i in this)
            return false;
            
        return true;
    }

if(!Translation.sprintf)
	Translation.sprintf = function(){
		var str = Translation.translate(arguments[0]);
		
		for(var i = 1; i < arguments.length; i++)
			str = str.replace("%s", arguments[i]);
		
		return str;
    };