var KeyHandler = new function(){
  this.keyMap = {};
  this.actionInProgress = false;
  this.setKeyDownAction = function(key, action, conditionBeforeFiringNextAction){
    if(this.keyMap[key] !== null){
      this.keyMap[key] = {
        keyDownAction: action,
        pressed: false,
        wasPressed: false
      };
      if(conditionBeforeFiringNextAction){
        this.keyMap[key].condition = conditionBeforeFiringNextAction;
      }
    }
  };

  this.handleKeyDown = function(event){
    var key = String.fromCharCode(event.keyCode).toLowerCase();
    if(this.keyMap[key] && this.keyMap[key].keyDownAction){
      if(!this.keyMap[key].pressed){
        if(this.keyMap[key].condition()){
          this.keyMap[key].keyDownAction();
          this.keyMap[key].wasPressed = false;
          this.keyMap[key].pressed = true;
        }
        else if(typeof this.keyMap[key].condition === 'undefined'){
          this.keyMap[key].keyDownAction();
          this.keyMap[key].wasPressed = false;
          this.keyMap[key].pressed = true;
        }

      }
    }
  };

  this.handleKeyRelease = function(key){
    var key = String.fromCharCode(event.keyCode).toLowerCase();
    if(this.keyMap[key] && this.keyMap[key].pressed){
      this.keyMap[key].wasPressed = true;
      this.keyMap[key].pressed = false;
    }
  }

  this.completeAction = function(){
    this.actionInProgress = false;
  }
}

document.addEventListener('keydown', KeyHandler.handleKeyDown.bind(KeyHandler));
document.addEventListener('keyup', KeyHandler.handleKeyRelease.bind(KeyHandler));
