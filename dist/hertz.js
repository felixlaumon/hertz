/*! hertz - v0.1.0 - 2012-07-23
* https://github.com/felixlaumon/hertz
* Copyright (c) 2012 Felix Lau; Licensed MIT */

(function(exports) {

exports.hertz = {
  init: function() {
    this.Stats = exports.stats;
    this._initPolyfill();
    this.setUpStats();
    this.start();
  },
  _initPolyfill: function() {
    // requestAnimationFrame PolyFill
    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

    // requestAnimationFrame polyfill by Erik Möller
    // fixes from Paul Irish and Tino Zijdel
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !this.requestAnimationFrame; ++x) {
      this.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
      this.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] ||
                                    window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!this.requestAnimationFrame) {
      this.requestAnimationFrame = function(callback, element) {
        var currTime = Date.now();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }

    if (!this.cancelAnimationFrame) {
      this.cancelAnimationFrame = function(id) {
        window.clearTimeout(id);
      };
    }
  },
  setUpStats: function(top, left) {
    this.stats = new this.Stats();
    this.setPosition(top, left);
    document.body.appendChild(this.stats.domElement);
  },
  setPosition: function(top, left) {
    top = (top || '0') + 'px';
    left = (left || '0') + 'px';
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.top = top;
    this.stats.domElement.style.left = left;
  },
  start: function() {
    var _this = this;
    // copy requestAnimationFrame to local scope to prevent type error
    var requestAnimationFrame = _this.requestAnimationFrame;
    var logFPS = function (time) {
      _this._loopId = requestAnimationFrame(logFPS);
      _this.stats.update();
    };
    logFPS();
  },
  stop: function() {
    // copy cancelAnimationFrame to local scope to prevent type error
    var cancelAnimationFrame = this.cancelAnimationFrame;
    cancelAnimationFrame(this._loopId);
  },
  remove: function() {
    document.body.removeChild(this.stats.domElement);
  }
};

}(typeof exports === 'object' && exports || this));

/**
 * @author mrdoob / http://mrdoob.com/
 */

(function(exports) {

var Stats = function () {

  var startTime = Date.now(), prevTime = startTime;
  var ms = 0, msMin = 1000, msMax = 0;
  var fps = 0, fpsMin = 1000, fpsMax = 0;
  var frames = 0, mode = 0;
  var bar;

  var container = document.createElement( 'div' );
  container.id = 'stats';
  container.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); setMode( ++ mode % 2 ); }, false );
  container.style.cssText = 'width:80px;opacity:0.9;cursor:pointer';

  var fpsDiv = document.createElement( 'div' );
  fpsDiv.id = 'fps';
  fpsDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#002';
  container.appendChild( fpsDiv );

  var fpsText = document.createElement( 'div' );
  fpsText.id = 'fpsText';
  fpsText.style.cssText = 'color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
  fpsText.innerHTML = 'FPS';
  fpsDiv.appendChild( fpsText );

  var fpsGraph = document.createElement( 'div' );
  fpsGraph.id = 'fpsGraph';
  fpsGraph.style.cssText = 'position:relative;width:74px;height:30px;background-color:#0ff';
  fpsDiv.appendChild( fpsGraph );

  while ( fpsGraph.children.length < 74 ) {

    bar = document.createElement( 'span' );
    bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#113';
    fpsGraph.appendChild( bar );

  }

  var msDiv = document.createElement( 'div' );
  msDiv.id = 'ms';
  msDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#020;display:none';
  container.appendChild( msDiv );

  var msText = document.createElement( 'div' );
  msText.id = 'msText';
  msText.style.cssText = 'color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
  msText.innerHTML = 'MS';
  msDiv.appendChild( msText );

  var msGraph = document.createElement( 'div' );
  msGraph.id = 'msGraph';
  msGraph.style.cssText = 'position:relative;width:74px;height:30px;background-color:#0f0';
  msDiv.appendChild( msGraph );

  while ( msGraph.children.length < 74 ) {

    bar = document.createElement( 'span' );
    bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#131';
    msGraph.appendChild( bar );

  }

  var setMode = function ( value ) {

    mode = value;

    switch ( mode ) {

      case 0:
        fpsDiv.style.display = 'block';
        msDiv.style.display = 'none';
        break;
      case 1:
        fpsDiv.style.display = 'none';
        msDiv.style.display = 'block';
        break;
    }

  };

  var updateGraph = function ( dom, value ) {

    var child = dom.appendChild( dom.firstChild );
    child.style.height = value + 'px';

  };

  return {

    domElement: container,

    setMode: setMode,

    begin: function () {

      startTime = Date.now();

    },

    end: function () {

      var time = Date.now();

      ms = time - startTime;
      msMin = Math.min( msMin, ms );
      msMax = Math.max( msMax, ms );

      msText.textContent = ms + ' MS (' + msMin + '-' + msMax + ')';
      updateGraph( msGraph, Math.min( 30, 30 - ( ms / 200 ) * 30 ) );

      frames ++;

      if ( time > prevTime + 1000 ) {

        fps = Math.round( ( frames * 1000 ) / ( time - prevTime ) );
        fpsMin = Math.min( fpsMin, fps );
        fpsMax = Math.max( fpsMax, fps );

        fpsText.textContent = fps + ' FPS (' + fpsMin + '-' + fpsMax + ')';
        updateGraph( fpsGraph, Math.min( 30, 30 - ( fps / 100 ) * 30 ) );

        prevTime = time;
        frames = 0;

      }

      return time;

    },

    update: function () {

      startTime = this.end();

    }

  };

};

exports.stats = Stats;

}(typeof exports === 'object' && exports || this));
