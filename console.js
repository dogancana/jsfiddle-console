(function () {
  var _console = window.console;
  var _methods = {
    log: window.console.log,
    error: window.console.error,
    info: window.console.info,
    debug: window.console.debug,
    clear: window.console.clear,
    warn: window.console.warn,
  };
  var _consoleWrapper;
  var _output;
  var _style = `
    #console {
      position: fixed;
      right: 0;
      top: 0;
      bottom: 0;
      left: 50%;
      width: 50%;
      z-index: 666;
      background-color: #20262e;
      color: #cfd0d2;
      opacity: .9;
      min-height: 100vh;
      font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
      font-size: 12px;
      transition: all .3 ease-out;
    }
    #console > h3 {
      font-weight: normal;
      width: 100%;
      padding-left: 20px;
      border-bottom: 1px solid #cfd0d2;
    }
    .console-wrapper {
      display: flex;
      flex-direction: column;
      width: 100%;
      margin: 10px;
    }
    .console-wrapper > code {
      margin: 2px;
      white-space: pre;
    }
  `;

  setup();

  function setup() {
    _output = document.createElement('div');
    _output.id = 'console';
    _output.innerHTML = `
      <h3>Console</h3>
      <div class='console-wrapper'></div>
    `
    _consoleWrapper = _output.getElementsByClassName('console-wrapper')[0];
    append(_output)
    injectStyles(_style)
  }

  function injectStyles(rule) {
    var style = document.createElement('style');
    style.innerHTML = rule
    var ref = document.querySelector('script');
    ref.parentNode.insertBefore(style, ref);
  }

  function append(message, target) {
    if (document.body) {
      (target || document.body).append(message);
    }
    else {
      setTimeout(append, 100, message, target);
    }
  }

  function clear() {
    if (document.body) {
      document.body.innerHtml = null;
    }
    _methods.clear.call(_console);
  };

  function message(text, color, $message) {
    $message = document.createElement('code');
    if (color) $message.style.color = color;
    $message.innerText = text;
    return $message;
  }

  function write(key, color) {
    return function () {
      Function.prototype.apply.call(_methods[key], _console, arguments);
      append(message(Array.prototype.slice.call([...arguments].map(stringify)).join(' '), color), _consoleWrapper);

      function stringify (d) {
        try {
          var str = (JSON.stringify(d, null, 2))
          return str.substring(1, str.length-1)
        } catch (e) {
          return d
        }
      }
    };
  }

  window.console.clear = clear;
  window.console.error = write('error', '#ff0000');
  window.console.log = write('log');
  window.console.info = write('info');
  window.console.debug = write('debug');
  window.console.warn = write('warn', '#9F6000')

  function errorHandler(e) {
    e.preventDefault();
    console.error(e.message);
    return true;
  }

  if (window.attachEvent) {
    window.attachEvent('onerror', errorHandler);
  }
  else {
    window.addEventListener('error', errorHandler, true);
  }
})();
