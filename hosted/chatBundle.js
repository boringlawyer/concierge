"use strict";

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var conversationId = location.href.split('/')[4];
var socket = io();
socket.on('loadMsgs', function (messages) {
  var _iterator = _createForOfIteratorHelper(messages),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var m = _step.value;
      $('#messages').append($('<li>').text(m));
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
});
socket.on('updateMsgs', function (message) {
  $('#messages').append($('<li>').text(message));
});
$('#sendMsg').on('click', function () {
  socket.emit('message', $('#msgText').val()); // $('#messages').append($('<li>').text($('#msgText').val()));
}); // if the server is down, and then is restarted when the chat page is open, it causes an error.
// This fix ensures that when the error is caught on the server, it tells the page to refresh

socket.on('refresh', function () {
  window.location.assign(window.location.href);
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  alert(message);
};

var redirect = function redirect(response) {
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};

var Conversation = function Conversation(props) {
  return /*#__PURE__*/React.createElement("a", {
    href: "/chat/".concat(props.link)
  }, /*#__PURE__*/React.createElement("h3", null, props.title));
};

var ConversationList = function ConversationList(props) {
  var nodes = props.convos.map(function (c) {
    return /*#__PURE__*/React.createElement(Conversation, {
      title: c.title,
      link: c._id
    });
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, nodes);
};
