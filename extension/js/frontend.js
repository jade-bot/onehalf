var port;
var listener = {
  mousemove: function(event) {
    post('mousemove', {x: event.clientX, y: event.clientY});
  },
  scroll: function(event) {
    post('scroll', {x: window.scrollX, y: window.scrollY});
  }
};
var action = {
  mousemove: function(origin,data) {
    console.log('mousemove',origin,data)
  },
  scroll: function(origin,data) {
    console.log('scroll',origin,data)
  }
};
function post(name, data) {
  port.postMessage({event: name, data: data});
}
function talk(currentPort) {
  port = currentPort;
  port.onMessage.addListener(function(message) {
    if (action[message.event]) {
      action[message.event](message.origin,message.data);
    }
  });
  for (var key in listener) {
    window.addEventListener(key, listener[key]);
  }
  port.onDisconnect.addListener(function() {
    for (var key in listener) {
      window.removeEventListener(key, listener[key]);
    }
  });
}

chrome.extension.onConnect.addListener(function(port) {
  console.assert(port.name == "one-half");
  talk(port);
});
