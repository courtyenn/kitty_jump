var KeyHandler = new function(){
  this.keyMap = {};
  this.actionInProgress = false;
  this.setKeyDownAction = function(config){
    var key = config.key;
    var action = config.action;
    var condition = config.conditionBeforeFiringNextAction;
    var allowMultipleFire = config.allowMultipleFire || false;
    if(this.keyMap[key] !== null){
      this.keyMap[key] = {
        keyDownAction: action,
        pressed: false,
        wasPressed: false,
        allowMultipleFire: allowMultipleFire
      };
      if(condition){
        this.keyMap[key].condition = condition;
      }
    }
  };

  this.handleKeyDown = function(event){
    var key = String.fromCharCode(event.keyCode).toLowerCase();
    if(this.keyMap[key] && this.keyMap[key].keyDownAction){
      if(!this.keyMap[key].pressed && this.keyMap[key].allowMultipleFire === false){
        if(this.keyMap[key].condition && this.keyMap[key].condition()){
          this.keyMap[key].keyDownAction();
          this.keyMap[key].wasPressed = false;
          this.keyMap[key].pressed = true;
        }
      }
      else if(this.keyMap[key].allowMultipleFire === true){
        this.keyMap[key].keyDownAction();
        this.keyMap[key].wasPressed = false;
        this.keyMap[key].pressed = false;
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
