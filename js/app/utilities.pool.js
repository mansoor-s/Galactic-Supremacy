(function() {
    "use strict"
    var Pool = App.Utilities.Pool = function(instanceClass) {
        this.instanceClass = instanceClass;
        this.pool = [];
        this.inUse = [];
    }     
    Pool.prototype.useOne = function(){
        if( this.pool.length === 0){
            return this.createNew();
        }else{
            var returnedInstance = this.pool[this.pool.length-1]
            this.pool.splice(this.pool.length-1,1);
            this.inUse.push(returnedInstance);
            return returnedInstance;
        }
        
    }
    Pool.prototype.freeOne = function(instance){
        var index = this.inUse.indexOf(instance);
        if(index!=-1){
            this.inUse.splice(index, 1);
            this.pool.push(instance);
            instance.onReturnToPool();//todo not sure if this will be here
        } else{
            alert('error:the inUse doesnt have this instance'); 
        }
    }
    Pool.prototype.freeAll = function(){
        for(var i = 0;i<this.inUse.length;i++){
            this.pool.push(this.inUse[i]);
            this.inUse[i].onReturnToPool();//todo not sure if this will be here
        }   
        this.inUse = [];
    } 
    Pool.prototype.createNew = function(){
        var newInstance = new this.instanceClass();
        this.inUse.push(newInstance);
        return newInstance;
    }
 
})();
