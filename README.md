# hertz

Drop-in wrapper to measure frame rate with requestAnimationFrame. Almost zero configuration. Useful for measuring the responsiveness of animation that is triggered by input events or a run loop.

![](http://f.cl.ly/items/2B34301C0O0A2y2b1H2D/Screen%20Shot%202012-07-23%20at%2012.28.04%20PM.png)

Hertz displays frame rate with [Stats.js](https://github.com/mrdoob/stats.js) with a nice graph. It uses requestAnimationFrame polyfill so it fallbacks to `setInterval` if there isn't support for requestAnimationFrame.

Hertz is particularly useful for measuring reponsiveness of animation and transition that is triggered by a loop or input events.

## Limitation

There are mainly two types of animation: CSS Transition & Animation, and animation with a setInterval loop or input events. Hertz unfortunately cannot measure the former but only the later. This is because CSS transition is hardware accelerated and it runs on another thread, which is outside the scope of the Javascript engine.

Hertz actually measures the difference between two successive `requestAnimationFrame` callbacks and approximates the FPS. For example, if a web page has function call that takes very long time to execute, the time difference between two successive `requestAnimationFrame` callback will be large and the callback for handling the mouse and touch inputs will be dropped, resulting in a low FPS and choppiness. (Bear in mind that Javascript is single threaded and cannot process two callbacks at the same time)

[More infomration about this](http://lists.webkit.org/pipermail/webkit-dev/2011-April/016502.html)

## Getting Started

Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/felixlaumon/hertz/master/dist/hertz.min.js
[max]: https://raw.github.com/felixlaumon/hertz/master/dist/hertz.js

In your web page:

```html
<script src="dist/hertz.min.js"></script>
<script>
hertz.init();
</script>
```

## Documentation

### hertz.init()
Starts the FPS counter

### hertz.stop()
Stop the FPS counter

### hertz.setPosition(left, top)
Set the position of counter. Defaults to left-top corner (i.e. left = 0, top = 0)

### hertz.remove()
Remove the FPS counter

## Examples
Refer to /examples/demo.html

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

_Also, please don't edit files in the "dist" subdirectory as they are generated via grunt. You'll find source code in the "lib" subdirectory!_

## Todos
- console.profile support for finding out reasons behind dropped frames?
- Unit test

## License
Copyright (c) 2012 Felix Lau felix@onswipe.com
Licensed under the MIT license.

__stat.js__
https://github.com/mrdoob/stats.js
Copyright (c) 2009-2012 Mr.doob
Licensed under the MIT license.

__requestAnimationFrame polyfill__
http://paulirish.com/2011/requestanimationframe-for-smart-animating/
https://gist.github.com/1579671
Paul Irish
