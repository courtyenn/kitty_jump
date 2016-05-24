var keyState = [];

function handleKeyPress(event){
  //console.log(event.keyCode);
  if(keyState[event.keyCode] != null){
    var theState = keyState[event.keyCode];
    theState.wasPressed = theState.pressed;
    theState.pressed = true;
    if(!theState.wasPressed){
      // console.log(event.keyCode);
      theState.pressAction();
    }
  }else{
    keyState[event.keyCode] =
    {
      pressed: true,
      wasPressed: false,
      pressAction: pressAction,
      releaseAction: releaseAction
    }
  }
}

function handleKeyRelease(event){
  if(keyState[event.keyCode] != null){
    var theState = keyState[event.keyCode];
    theState.pressed = false;
    theState.wasPressed = false;
    if(!theState.pressed){
      theState.releaseAction();
    }
  }else{
    keyState[event.keyCode] =
    {
      pressed: false,
      wasPressed: true,
      pressAction: pressAction,
      releaseAction: releaseAction
    }
  }
}

function setPressAction(keyCode, action){
  if(keyState[keyCode] != null){
    keyState[keyCode].pressAction = action;
  }else{
    keyState[keyCode] =
    {
      pressed: false,
      wasPressed: true,
      pressAction: action,
      releaseAction: releaseAction
    }
  }
}

function setReleaseAction(keyCode, action){
  if(keyState[keyCode] != null){
    keyState[keyCode].releaseAction = action;
  }else{
    keyState[keyCode] =
    {
      pressed: false,
      wasPressed: true,
      pressAction: pressAction,
      releaseAction: action
    }
  }
}

function getStringState(keyCode){
  var result = "not pressed";
  if(keyState[keyCode] != null){
    if(keyState[keyCode].pressed){
      result = "pressed";
    }
  }

  return result;
}

function getKeyState(keyCode){
  var result = false;
  if(keyState[keyCode] != null){
    if(keyState[keyCode].pressed){
      result = true;
    }
  }

  return result;
}
