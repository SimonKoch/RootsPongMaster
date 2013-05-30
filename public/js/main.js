(function() {
  var BALL_ACCELERATION, BALL_FRICTION, BALL_TERMINAL_VELOCITY, BAT_ACCELERATION, BAT_FRICTION, BAT_TERMINAL_VELOCITY, Ball, Bat, Entity, LEFT, RIGHT, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BAT_ACCELERATION = 0.40;

  BAT_TERMINAL_VELOCITY = 5;

  BAT_FRICTION = 0.10;

  BALL_ACCELERATION = 5;

  BALL_TERMINAL_VELOCITY = 5;

  BALL_FRICTION = 0;

  LEFT = 0;

  RIGHT = 1;

  Entity = (function() {
    Entity.prototype.x = 0;

    Entity.prototype.y = 0;

    Entity.prototype.vx = 0;

    Entity.prototype.vy = 0;

    function Entity(context, maxX, maxY, minX, minY, offsetX, offsetY, a, tv, f) {
      this.context = context;
      this.maxX = maxX;
      this.maxY = maxY;
      this.minX = minX;
      this.minY = minY;
      this.offsetX = offsetX;
      this.offsetY = offsetY;
      this.a = a;
      this.tv = tv;
      this.f = f;
    }

    Entity.prototype.update = function() {
      if (this.vx > 0) {
        this.vx -= this.f;
      }
      if (this.vx < 0) {
        this.vx += this.f;
      }
      if (this.vy > 0) {
        this.vy -= this.f;
      }
      if (this.vy < 0) {
        this.vy += this.f;
      }
      if (this.vx > this.tv) {
        this.vx = this.tv;
      }
      if (this.vx < -this.tv) {
        this.vx = -this.tv;
      }
      if (this.vy > this.tv) {
        this.vy = this.tv;
      }
      if (this.vy < -this.tv) {
        this.vy = -this.tv;
      }
      this.x += this.vx;
      this.y += this.vy;
      return this.checkBoundary();
    };

    Entity.prototype.checkBoundary = function() {
      if (this.x + this.w > this.maxX) {
        this.x = this.maxX - this.w;
      }
      if (this.x < this.minX) {
        this.x = this.minX;
      }
      if (this.y + this.h > this.maxY) {
        this.y = this.maxY - this.h;
      }
      if (this.y < this.minY) {
        return this.y = this.minY;
      }
    };

    Entity.prototype.draw = function() {
      this.context.fillStyle = 'rgba(0,0,0,0.8)';
      return this.context.fillRect(this.x + this.offsetX, this.y + this.offsetY, this.w, this.h);
    };

    Entity.prototype.accelX = function() {
      return this.vx += this.a;
    };

    Entity.prototype.accelY = function() {
      return this.vy += this.a;
    };

    Entity.prototype.decelX = function() {
      return this.vx -= this.a;
    };

    Entity.prototype.decelY = function() {
      return this.vy -= this.a;
    };

    return Entity;

  })();

  Bat = (function(_super) {
    __extends(Bat, _super);

    function Bat() {
      _ref = Bat.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Bat.prototype.w = 40;

    Bat.prototype.h = 175;

    return Bat;

  })(Entity);

  Ball = (function(_super) {
    __extends(Ball, _super);

    function Ball() {
      _ref1 = Ball.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    Ball.prototype.w = 40;

    Ball.prototype.h = 40;

    Ball.prototype.x = 200;

    Ball.prototype.y = 200;

    Ball.prototype.winner = null;

    Ball.prototype.checkWinner = function() {
      return this.winner;
    };

    Ball.prototype.checkBoundary = function() {
      if (this.x + this.w > this.maxX) {
        this.winner = 1;
      }
      if (this.x < this.minX) {
        this.winner = 2;
      }
      if (this.y + this.h > this.maxY || this.y < this.minY) {
        return this.vy = -this.vy;
      }
    };

    Ball.prototype.checkCollision = function(e, bat) {
      var ex, ey, x, y;

      x = this.x + this.offsetX;
      y = this.y + this.offsetY;
      ex = e.x + e.offsetX;
      ey = e.y + e.offsetY;
      if (y >= ey && y <= ey + e.h) {
        if (bat === LEFT && x < ex + e.w) {
          this.x += BAT_TERMINAL_VELOCITY / 2;
          this.vx = -this.vx;
        }
        if (bat === RIGHT && x + this.w > ex) {
          this.x -= BAT_TERMINAL_VELOCITY / 2;
          return this.vx = -this.vx;
        }
      }
    };

    Ball.prototype.draw = function() {
      this.context.fillStyle = 'rgba(0,0,0,0.8)';
      return this.context.fillRect(this.x + this.offsetX, this.y + this.offsetY, this.w, this.h);
    };

    return Ball;

  })(Entity);

  window.PongApp = (function() {
    function PongApp() {}

    PongApp.prototype.main = function() {
      this.createCanvas();
      this.addKeyObservers();
      return this.startNewGame();
    };

    PongApp.prototype.startNewGame = function() {
      this.entities = [];
      this.entities.push(new Bat(this.context, this.canvas.width, this.canvas.height, 0, 0, 30, 0, BAT_ACCELERATION, BAT_TERMINAL_VELOCITY, BAT_FRICTION));
      this.entities.push(new Bat(this.context, this.canvas.width, this.canvas.height, 0, 0, this.canvas.width - 70, 0, BAT_ACCELERATION, BAT_TERMINAL_VELOCITY, BAT_FRICTION));
      this.entities.push(new Ball(this.context, this.canvas.width, this.canvas.height, 0, 0, 0, 0, BALL_ACCELERATION, BALL_TERMINAL_VELOCITY, BALL_FRICTION));
      this.entities[2].vx = 5;
      this.entities[2].vy = 5;
      return this.runLoop();
    };

    PongApp.prototype.runLoop = function() {
      var _this = this;

      return setTimeout(function() {
        var player;

        if (_this.aPressed) {
          _this.entities[0].decelY();
        }
        if (_this.zPressed) {
          _this.entities[0].accelY();
        }
        if (_this.upPressed) {
          _this.entities[1].decelY();
        }
        if (_this.downPressed) {
          _this.entities[1].accelY();
        }
        _this.entities.forEach(function(e) {
          return e.update();
        });
        _this.entities[2].checkCollision(_this.entities[0], LEFT);
        _this.entities[2].checkCollision(_this.entities[1], RIGHT);
        player = _this.entities[2].checkWinner();
        if (player) {
          _this.terminateRunLoop = true;
          if (!_this.score) {
            _this.score = [0, 0];
          }
          _this.score[player - 1]++;
          _this.notifyCurrentUser("Player " + player + " wins! Score: " + _this.score[0] + " - " + _this.score[1] + ". New game starting in 3 seconds.");
          setTimeout(function() {
            _this.notifyCurrentUser('');
            _this.terminateRunLoop = false;
            return _this.startNewGame();
          }, 3000);
        }
        _this.clearCanvas();
        _this.entities.forEach(function(e) {
          return e.draw();
        });
        if (!_this.terminateRunLoop) {
          return _this.runLoop();
        }
      }, 10);
    };

    PongApp.prototype.notifyCurrentUser = function(message) {
      return document.getElementById('message').innerHTML = message;
    };

    PongApp.prototype.cleanup = function() {
      this.terminateRunLoop = true;
      return this.clearCanvas();
    };

    PongApp.prototype.createCanvas = function() {
      this.canvas = document.getElementById('canvas');
      this.context = this.canvas.getContext('2d');
      this.canvas.width = document.width;
      return this.canvas.height = document.height;
    };

    PongApp.prototype.clearCanvas = function() {
      return this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    PongApp.prototype.addKeyObservers = function() {
      var _this = this;

      document.addEventListener('keydown', function(e) {
        switch (e.keyCode) {
          case 40:
            return _this.downPressed = true;
          case 38:
            return _this.upPressed = true;
          case 90:
            return _this.zPressed = true;
          case 65:
            return _this.aPressed = true;
        }
      }, false);
      return document.addEventListener('keyup', function(e) {
        switch (e.keyCode) {
          case 27:
            return _this.cleanup();
          case 40:
            return _this.downPressed = false;
          case 38:
            return _this.upPressed = false;
          case 90:
            return _this.zPressed = false;
          case 65:
            return _this.aPressed = false;
        }
      }, false);
    };

    return PongApp;

  })();

}).call(this);

(function() {
  require.config({
    paths: {
      jquery: '//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.0/jquery.min'
    }
  });

  require(['jquery'], function($) {
    var pong;

    pong = new PongApp;
    return pong.main();
  });

}).call(this);
