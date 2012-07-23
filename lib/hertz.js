/*
 * hertz
 * https://github.com/felixlaumon/hertz
 *
 * Copyright (c) 2012 Felix Lau
 * Licensed under the MIT license.
 */

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
