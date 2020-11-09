var Utility = {
    random:new Random(),
    getRandom:function(random){
        if(!(random instanceof Random))
            random = new Random();

        return random;
    },
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

    getSID:function(ID){
        return IDRegistry.getNameByID(ID) || ID;
	},
	
	extends: function(Child, Parent){
        var F = function(){};
        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.prototype.constructor = Child;
        
        //Child.prototype.superclass =
        Child.superclass = Parent.prototype;
    }
}