// var ROOT = '/wp-content/themes/clean-slate/js/kitty_jump/public/'; // need to get rid of hard code
var ROOT = './';
var jumpKey = {};
var bgSound;
var gameSound;
var soundFx;
var gameDead;

var kitty_jump = (function(){
  var CANVAS_WIDTH = 650;
  var CANVAS_HEIGHT = 500;
  var FPS = 60;
  var currentGameState = 100;
  var previousGameState;
  var gamestates = {};
  var frames = 0;
  var myTimer;
  var context;
  var score = 0;
  var toRadian = Math.PI / 180;
  var toDegree = 180 / Math.PI;
  var kibble = [];
  var kibbles = [];
  var kibble_O = new Image();
  var kibble_X = new Image();
  var Okibble = true;
  var enemy = new Image();
  var enemies = [];
  var playerBullets = [];
  var gravity = 3; // 9.8m/s^2 / FPS = .16
  var powerBar = new Powerbar({x: 300, y: CANVAS_HEIGHT-30});
  var time = 0;
  var player = {
    startY: CANVAS_HEIGHT-100,
    startX: 30,
    x: 30,
    y: CANVAS_HEIGHT-100,
    yStep: 1,
    width: 57,
    height: 53,
    lives: {
      count: 9,
      image: new Image()
    },
    initialVelocityY: 2,
    velocityY: 2,
    time: 0,
    peakY: 0,
    image: new Image(),
    isJumping: false,
    isFalling: false,
    canJump: true,
    moveDistance: 0,
    draw: function(){
      if(this.isJumping){
        this.jump();
      }
      else if(this.isFalling) {
        this.fall();
      }
      this.move();
      context.drawImage(player.image, this.x, this.y);
    },
    shoot: function() {

      var bulletPosition = this.midpoint();
      playerBullets.push(Bullet({
        speed: 5,
        x: bulletPosition.x,
        y: bulletPosition.y
      }));
    },
    midpoint: function() {
      return {
        x: this.x + this.width/2,
        y: this.y + this.height/2
      };
    },
    explode: function(){
      player.lives.count--;
      if(player.lives.count == 0)currentGameState = 300;
    },
    jumpOn: function(){
      this.isJumping = true;
    },
    jump: function(){
      if(currentGameState !== 300){
        this.canJump = false;
        this.velocityY = this.velocityY - ((this.initialVelocityY * this.time) - ((1/2) * gravity * Math.pow(this.time, 2)));
        // this.velocityY = this.initialVelocityY;
        if(this.isJumping){
          if(this.y <= 0 || this.velocityY < 0 ){
            this.isJumping = false;
            this.isFalling = true;
            this.time = 1;
          }
          else {
            this.y -= (this.velocityY);
            this.time = this.time + .22;
          }
        }
      }
    },
    fall: function(){
      if(currentGameState !== 300){
        this.velocityY = gravity * this.time;
        this.y += (this.velocityY);
        if(this.y >= (this.startY) ){
          this.isFalling = false;
          this.isJumping = false;
          this.canJump = true;
          this.time = 0;
          this.y = this.startY;
        }
        else {
          this.time = this.time + .22;
        }
      }
    },
    move: function(){
      if(currentGameState !== 300){
        this.x += this.moveDistance;
      }
    },
    setMove: function(key){
      if(key === 'a'){
        this.moveDistance = -15;
      }
      else if(key === 'd'){
        this.moveDistance = 15;
      }
    }
  };

  gamestates = {
    "0" : function(){
      if(previousGameState != currentGameState){
        previousGameState = currentGameState;
        $('#pause').removeClass('invisible');
        gameSound.pause();
      }

      // if(keydown.o){
      //   currentGameState = 200;s
      //   $('#pause').addClass('invisible');
      // }
    },
    "100" : function(){
      if(previousGameState != currentGameState){
        previousGameState = currentGameState;
        $('#start').removeClass('invisible');
        if(!bgSound.muted){
          bgSound.play();
        }
      }

      // if(keydown.m){
      //   keydown.m = false;
      //   currentGameState = 150;
      // }
    },
    "150" : function(){
      if(previousGameState != currentGameState){
        previousGameState = currentGameState;
        bgSound.pause();
      }
      // if(keydown.m){
      //   keydown.m = false;
      //   currentGameState = 100;
      // }
    },
    "175" : function(){
      if(previousGameState != currentGameState){
        previousGameState = currentGameState;
        $('#start').addClass('invisible');
        $('#instructions').removeClass('invisible');
      }
      // if(keydown.m){
      //   keydown.m = false;
      //   currentGameState = 175;
      // }
    },
    "200" : function(){ // play game
      if(previousGameState != currentGameState){
        previousGameState = currentGameState;
      }
      bgSound.pause();
      if(!gameSound.muted){
        gameSound.play();
      }
      // if(keydown.p) {
      //   currentGameState = 0;
      // }
      // if(keydown.m){
      //   keydown.m = false;
      //   currentGameState = 400;
      // }
      // if(keydown.space) {
      //   if(frames%10===0)player.shoot();
      // }
      // if(keydown.w) {
      //   keydown.w = false;
      //   powerBar.start();
      // }
      // if(keyup.w){
      //   var velocity = powerBar.pause();
      //   player.isJumping = true;
      //   this.time = 0;
      //   this.startY = this.y;
      //   player.velocity = 1;
      // }
      // if(keydown.d) {
      //   player.x += 5;
      // }
      // if(keydown.a) {
      //   player.x -= 5;
      // }

      playerBullets.forEach(function(bullet) {
        bullet.update();
      });

      playerBullets = playerBullets.filter(function(bullet) {
        return bullet.active;
      });

      enemies.forEach(function(enemy) {
        enemy.update();
      });

      enemies = enemies.filter(function(enemy) {
        return enemy.active;
      });

      kibbles.forEach(function(kibble) {
        kibble.update();
      });

      kibbles = kibbles.filter(function(kibble) {
        return kibble.active;
      });

      handleCollisions();

      if(Math.random() < 0.05) {
        enemies.push(Enemy());
      }
      if(Math.random() < 0.05) {
        Okibble = !Okibble;
        kibbles.push(Kibble({kibble:Okibble}));
      }

    },
    "300" : function(){
      if(previousGameState != currentGameState){
        previousGameState = currentGameState;
        if(!gameSound.muted){
          gameSound.pause();
        }
        if(!gameDead.muted){
          gameDead.play();
        }

        $('#game-over').removeClass('invisible');
      }
    },
    "400" : function(){
      if(previousGameState != currentGameState){
        previousGameState = currentGameState;
        gameSound.pause();

      }
      gameSound.muted = true;
      soundFx.muted = true;
      /** PAUSED **/
      // if(keydown.p) {
      //   currentGameState = 0;
      // }
      /** MUTE **/
      // if(keydown.m){
      //   keydown.m = false;
      //   currentGameState = 200;
      // }
      /** ATTACK **/
      // if(keydown.space) {
      //   if(frames%10===0)player.shoot();
      // }
      /** MOVE UP**/
      // if(keydown.w) {
      //   player.y -= 5;
      // }
      /** MOVE DOWN **/
      // if(keydown.s) {
      //   player.y += 5;
      // }

      playerBullets.forEach(function(bullet) {
        bullet.update();
      });

      playerBullets = playerBullets.filter(function(bullet) {
        return bullet.active;
      });

      enemies.forEach(function(enemy) {
        enemy.update();
      });

      enemies = enemies.filter(function(enemy) {
        return enemy.active;
      });

      kibbles.forEach(function(kibble) {
        kibble.update();
      });

      kibbles = kibbles.filter(function(kibble) {
        return kibble.active;
      });

      handleCollisions();

      if(Math.random() < 0.1) {
        enemies.push(Enemy());
      }
      if(Math.random() < 0.1) {
        Okibble = !Okibble;
        kibbles.push(Kibble({kibble:Okibble}));
      }
    },
    "450": function(){
      if(previousGameState != currentGameState){
        gameSound.muted = !gameSound.muted;
        soundFx.muted = !soundFx.muted;
        bgSound.muted = !bgSound.muted;
        gameDead.muted = !gameDead.muted;
        // if(gameSound.muted){
        //   gameSound.pause();
        // }
        // else {
        //   gameSound.play();
        // }
        // if(soundFx.muted){
        //   soundFx.pause();
        // }
        // if(bgSound.muted){
        //   bgSound.pause();
        // }
        // else{
        //   bgSound.pause();
        // }
        // if(gameDead.muted){
        //   gameDead.pause();
        // }
        currentGameState = previousGameState;
      }
    }
  };

  function Bullet(I) {
    I.active = true;

    I.xVelocity = I.speed;
    I.yVelocity = 0;
    I.width = 8;
    I.height = 5;
    I.color = "#000";

    I.inBounds = function() {
      return I.x >= 0 && I.x <= CANVAS_WIDTH &&
      I.y >= 0 && I.y <= CANVAS_HEIGHT;
    };

    I.draw = function() {
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, this.width, this.height);
    };

    I.update = function() {
      I.x += I.xVelocity;
      I.y += I.yVelocity;

      I.active = I.active && I.inBounds();
    };

    I.explode = function() {
      this.active = false;
    };

    return I;
  }


  function Kibble(I) {
    I = I || {};
    I.isKibble = I.kibble;
    I.active = true;
    I.age = Math.floor(Math.random() * 128);

    I.color = "#A2B";

    I.x = CANVAS_WIDTH;
    I.y = (CANVAS_HEIGHT-150) - Math.random() * CANVAS_HEIGHT;
    I.xVelocity = 3 + (Math.random() - .5);
    I.yVelocity = 0;

    I.width = 25;
    I.height = 25;

    I.inBounds = function() {
      return I.x >= 0 && I.x <= CANVAS_WIDTH &&
      I.y >= 0 && I.y <= CANVAS_HEIGHT;
    };

    //I.sprite = Sprite("candy_sm");

    I.draw = function() {
      //console.log('draw');
      if(this.isKibble)context.drawImage(kibble_O, this.x, this.y);
      else context.drawImage(kibble_X, this.x, this.y);
    };

    I.update = function() {
      I.x -= I.xVelocity;
      I.y += I.yVelocity;

      //console.log("I X xVelocity" + I.xVelocity);
      I.age++;

      I.active = I.active && I.inBounds();
    };

    I.explode = function() {
      //Sound.play("explosion");

      this.active = false;
      // Extra Credit: Add an explosion graphic
    };

    return I;
  };

  function Enemy(I) {
    I = I || {};

    I.active = true;
    I.age = Math.floor(Math.random() * 20);

    I.color = "#A2B";

    I.x = CANVAS_WIDTH;
    I.y = (CANVAS_HEIGHT-150) - Math.random() * CANVAS_HEIGHT;
    I.xVelocity = 3 + (Math.random() - .5);
    // 	I.yVelocity = 0;

    I.width = 32;
    I.height = 32;

    I.inBounds = function() {
      return I.x >= 0 && I.x <= CANVAS_WIDTH &&
      I.y >= 0 && I.y <= CANVAS_HEIGHT;
    };

    //I.sprite = Sprite("candy_sm");

    I.draw = function() {
      //this.sprite.draw(context, this.x, this.y);
      context.drawImage(enemy, this.x, this.y);
    };

    I.update = function() {
      I.x -= I.xVelocity;
      // 	I.y += I.yVelocity;

      I.age++;

      I.active = I.active && I.inBounds();
    };

    I.explode = function() {
      this.active = false;
    };

    return I;
  };

  function collides(a, b) {
    return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
  }

  function handleCollisions() {
    kibbles.forEach(function(kibble) {
      if(collides(kibble, player)) {
        soundFx.play();
        score++;
        kibble.active = false;
        if(score%10===0 && player.lives.count > 0)player.lives.count++;
      }
    });
    playerBullets.forEach(function(bullet) {
      enemies.forEach(function(enemy) {
        if(collides(bullet, enemy)) {
          enemy.explode();
          bullet.active = false;
        }
      });

      kibbles.forEach(function(kibble){
        if(collides(bullet, kibble)) {
          kibble.active = false;
          bullet.active = false;
          score--;
          if(score< 0)
          {
            if(score*-1%10==0)player.lives.count--;
          }
        }
      });
    });

    enemies.forEach(function(enemy) {
      if(collides(enemy, player)) {
        enemy.explode();
        player.explode();
      }
    });

  }

  function setup(){

    var canvasElement = document.getElementById('game');
    context = canvasElement.getContext('2d');
    var div = document.getElementById('wrapper');
    var pause = document.getElementById('pause');
    var startScreen = document.getElementById('start');
    var gameover = document.getElementById('game-over');
    canvasElement.width = CANVAS_WIDTH;
    canvasElement.height = CANVAS_HEIGHT;
    gameover.setAttribute("style", "width:" + CANVAS_WIDTH + "px;height:" + CANVAS_HEIGHT + "px");
    pause.setAttribute("style", "width:" + CANVAS_WIDTH + "px;height:" + CANVAS_HEIGHT + "px");
    div.setAttribute("style", "width:" + CANVAS_WIDTH + "px;height:" + CANVAS_HEIGHT + "px");
    startScreen.setAttribute("style", "width:" + CANVAS_WIDTH + "px;height:" + CANVAS_HEIGHT + "px");
    $('#start').addClass('visibile');


    /* 	bgSound.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
  }, false); */
  //	bgSound.play();
  bgSound.volume = .1;
  gameSound.volume = .1;
  soundFx.volume = .05;
  gameDead.volume = .1;

  KeyHandler.keyMap = keyCodes;
  var jumpConfig = {
    key: 'w',
    action: function(){
      player.isJumping = true;
    },
    conditionBeforeFiringNextAction: checkIfPlayerShouldJump
  };
  var moveConfig = {
    key: 'a',
    action: function(){
      player.moveDistance = -15;
    },
    allowMultipleFire: true,
    releaseAction: function(){
      player.moveDistance = 0;
    }
  };
  KeyHandler.setKeyDownAction(jumpConfig);
  KeyHandler.setKeyDownAction(moveConfig);
  moveConfig.key = 'd';
  moveConfig.action = function(){
    player.moveDistance = 15;
  };
  KeyHandler.setKeyDownAction(moveConfig);

}
function checkIfPlayerShouldJump(){
  return player.canJump;
}

function update(){
  gamestates[currentGameState + ""]();
}
function draw(){
  context.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);


  player.draw();
  playerBullets.forEach(function(bullet) {
    bullet.draw();
  });
  enemies.forEach(function(enemy) {
    enemy.draw();
  });

  kibbles.forEach(function(kibble) {
    kibble.draw();
  });
  for(var x = 0; x < player.lives.count; x++){
    context.drawImage(player.lives.image, 10+(x*30), (CANVAS_HEIGHT-30));
  }

  context.fillText("SCORE: " + score, CANVAS_WIDTH-100, CANVAS_HEIGHT-20);
  // powerBar.draw(context);

}
function loop(){
  frames++;
  update();
  draw();
}

function init(){
  player.lives.count = 9;
  player.y = player.startY;
  player.x = player.startX;
  player.canJump = true;
  player.isJumping = false;
  player.isFalling = false;
  score = 0;
  enemies = [];
  kibbles = [];
  currentGameState = 200;
}

return {
  playGame : function playGame(root){
    if(root){
      ROOT = root.ROOT;
    }
    player.image.src = ROOT+"images/kitty_cat.png";
    enemy.src = ROOT+"images/candy_sm.png";
    player.lives.image.src = ROOT+"images/life.png";
    kibble_O.src = ROOT+"images/kibble_O.png";
    kibble_X.src = ROOT+"images/kibble_X.png";
    bgSound = new Audio(ROOT+'sound/meowmix.mp3');
    gameSound = new Audio(ROOT+'sound/monkeyspinning.mp3');
    soundFx = new Audio(ROOT+'sound/catmeow.mp3');
    gameDead = new Audio(ROOT+'sound/catscream.mp3');
    $('.start-game').on('click', function(event){
      if(currentGameState == 300){
        $('#game-over').addClass('invisible');
      }
      event.preventDefault();
      currentGameState = 200;
      $('#start').addClass('invisible');
      $('#instructions').addClass('invisible');
      $('#game').removeClass('invisible');
      bgSound.muted = true;
      init();
    });
    $('.main-menu').on('click', function(event){
      event.preventDefault();
      currentGameState = 100;
      $('#start').removeClass('invisible');
      $('#game-over').addClass('invisible');
      $('#instructions').addClass('invisible');
      $('#game').addClass('invisible');
    });
    $('#mute').on('click', function(event){
      event.preventDefault();
      currentGameState = 450;
    });
    $('.go-to-main-menu').on('click', function(event){
      event.preventDefault();
      currentGameState = 100;
    });
    $('.go-to-instructions').on('click', function(event){
      event.preventDefault();
      currentGameState = 175;
      $('#start').addClass('invisible');
      $('#instructions').removeClass('invisible');
      $('#game').addClass('invisible');
    });
    setup();
    myTimer = setInterval(function(){
      loop();
    }, 1000/FPS);
  }
}
})();
