$(function() {
  window.keydown = {};
  window.keyup = {};

  function keyName(event) {
    return jQuery.hotkeys.specialKeys[event.which] ||
      String.fromCharCode(event.which).toLowerCase();
  }

  $(document).bind("keydown", function(event) {
    keydown[keyName(event)] = true;
	 keyup[keyName(event)] = false;
  });

  $(document).bind("keyup", function(event) {
    keydown[keyName(event)] = false;
	 keyup[keyName(event)] = true;
  });
});
