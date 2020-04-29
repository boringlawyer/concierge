"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var conversationId = location.href.split('/')[4];
var socket = io();
socket.on('loadMsgs', function (messages) {
  // for (let m of messages) {
  //     $('#messages').append($('<li>').text(m));
  // }
  ReactDOM.render( /*#__PURE__*/React.createElement(Messages, {
    messages: messages
  }), document.querySelector("#messages"));
}); // socket.on('updateMsgs', (message) => {
//     $('#messages').append($('<li>').text(message));
// })

$('#sendMsg').on('click', function () {
  socket.emit('message', {
    value: $('#msgText').val(),
    type: 'text'
  }); // $('#messages').append($('<li>').text($('#msgText').val()));
});
$('#sendTextInput').on('click', function () {
  socket.emit('message', {
    type: 'textInput'
  });
});
$('#sendNumberInput').on('click', function () {
  socket.emit('message', {
    type: 'numberInput'
  });
});
$('#sendSecretInput').on('click', function () {
  socket.emit('message', {
    type: 'secretInput'
  });
}); // if the server is down, and then is restarted when the chat page is open, it causes an error.
// This fix ensures that when the error is caught on the server, it tells the page to refresh

socket.on('refresh', function () {
  window.location.assign(window.location.href);
});

var Messages = /*#__PURE__*/function (_React$Component) {
  _inherits(Messages, _React$Component);

  var _super = _createSuper(Messages);

  function Messages(props) {
    var _this;

    _classCallCheck(this, Messages);

    _this = _super.call(this, props);
    _this.state = {
      messages: props.messages
    };
    socket.on('updateMsgs', function (message) {
      _this.setState(function (state) {
        state.messages.push(message);
        return {
          messages: state.messages
        };
      });
    });
    return _this;
  } // thanks to https://react-bootstrap.netlify.app/components/input-group/ and https://react-bootstrap.netlify.app/components/forms/


  _createClass(Messages, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("ul", null, this.state.messages.map(function (m) {
        if (m.type == "text") {
          return /*#__PURE__*/React.createElement("li", null, m.senderName, " said: ", m.value);
        } else if (m.type == "textInput") {
          return /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(Input, {
            prepend: "abc",
            placeholder: "Text Input",
            aria: "Text Input"
          }));
        } else if (m.type == "numberInput") {
          return /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(Input, {
            prepend: "#",
            placeholder: "Number Input",
            aria: "Number Input",
            as: "number"
          }));
        } else if (m.type == "secretInput") {
          return /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(Input, {
            prepend: "",
            placeholder: "Secret Input",
            aria: "Secret Input",
            as: "password"
          }));
        }
      }));
    }
  }]);

  return Messages;
}(React.Component);

var Input = function Input(props) {
  return /*#__PURE__*/React.createElement(ReactBootstrap.InputGroup, null, /*#__PURE__*/React.createElement(ReactBootstrap.InputGroup.Prepend, null, /*#__PURE__*/React.createElement(ReactBootstrap.InputGroup.Text, null, props.prepend)), /*#__PURE__*/React.createElement(ReactBootstrap.FormControl, {
    placeholder: props.placeholder,
    "aria-label": props.aria,
    type: props.as || "text"
  }));
};
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
