var KeyHandler = new function(){
  this.keyMap = {};
  this.actionInProgress = false;
  this.setKeyDownAction = function(key, action){
    if(this.keyMap[key] !== null){
      this.keyMap[key].keyDownAction = action;
    }
  };

  this.handleKeyDown = function(event){
    var key = String.fromCharCode(event.keyCode).toLowerCase();
    if(this.keyMap[key] && this.keyMap[key].keyDownAction && this.actionInProgress === false){
      this.actionInProgress = true;
      this.keyMap[key].keyDownAction();
      this.actionInProgress = false;
    }
  };

  this.completeAction = function(){
    this.actionInProgress = false;
  }
}

document.addEventListener('keydown', KeyHandler.handleKeyDown.bind(KeyHandler));
