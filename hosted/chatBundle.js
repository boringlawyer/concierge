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
  sendAjax('GET', '/getToken', null, function (result) {
    ReactDOM.render( /*#__PURE__*/React.createElement(Messages, {
      messages: messages
    }), document.querySelector("#messages"));
    ReactDOM.render( /*#__PURE__*/React.createElement(AppNavBar, {
      csrf: result.csrfToken
    }), document.querySelector("nav"));
  });
}); // referenced https://api.jquery.com/val/

socket.on('broadcastInput', function (input) {
  $("#".concat(input.id)).val(input.value);
}); // #sendMsg is the send button for text messages

$('#sendMsg').on('click', function () {
  socket.emit('message', {
    value: $('#msgText').val(),
    type: 'text'
  });
}); // this creates text input as a message

$('#sendTextInput').on('click', function () {
  socket.emit('message', {
    type: 'textInput',
    value: ''
  });
}); // this creates number input as a message

$('#sendNumberInput').on('click', function () {
  socket.emit('message', {
    type: 'numberInput',
    value: ''
  });
}); // this creates secret (like a password) input as a message

$('#sendSecretInput').on('click', function () {
  socket.emit('message', {
    type: 'secretInput',
    value: ''
  });
}); // if the server is down, and then is restarted when the chat page is open, it causes an error.
// This fix ensures that when the error is caught on the server, it tells the page to refresh

socket.on('refresh', function () {
  window.location.assign(window.location.href);
}); // this component renders all messages in a conversation

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
          return /*#__PURE__*/React.createElement("li", {
            id: m.id
          }, m.senderName, " said: ", m.value);
        } else if (m.type == "textInput") {
          return /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(Input, {
            prepend: "abc",
            placeholder: "Text Input",
            aria: "Text Input",
            messageId: m.id || m._id,
            inputValue: m.value
          }));
        } else if (m.type == "numberInput") {
          return /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(Input, {
            prepend: "#",
            placeholder: "Number Input",
            aria: "Number Input",
            as: "number",
            messageId: m.id || m._id,
            inputValue: m.value
          }));
        } else if (m.type == "secretInput") {
          return /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(Input, {
            prepend: "",
            placeholder: "Secret Input",
            aria: "Secret Input",
            as: "password",
            messageId: m.id || m._id,
            inputValue: m.value
          }));
        }
      }));
    }
  }]);

  return Messages;
}(React.Component); // this represents an input element that the admin can create


var Input = function Input(props) {
  return /*#__PURE__*/React.createElement(ReactBootstrap.InputGroup, null, /*#__PURE__*/React.createElement(ReactBootstrap.InputGroup.Prepend, null, /*#__PURE__*/React.createElement(ReactBootstrap.InputGroup.Text, null, props.prepend)), /*#__PURE__*/React.createElement(ReactBootstrap.FormControl, {
    placeholder: props.placeholder,
    "aria-label": props.aria,
    type: props.as || "text",
    id: props.messageId,
    defaultValue: props.inputValue
  }), /*#__PURE__*/React.createElement(ReactBootstrap.InputGroup.Append, null, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: function onClick() {
      socket.emit('saveInput', {
        id: props.messageId,
        value: $("#".concat(props.messageId)).val()
      });
    }
  }, "Save")));
};
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
}; // basically a header and a link for the title of the conversation


var Conversation = function Conversation(props) {
  return /*#__PURE__*/React.createElement("a", {
    href: "/chat/".concat(props.link)
  }, /*#__PURE__*/React.createElement("h3", null, props.title));
};

var ConversationList = function ConversationList(props) {
  if (props.convos.length === 0) {
    return /*#__PURE__*/React.createElement("h3", {
      className: "emptyList"
    }, "No Conversations yet");
  }

  var nodes = props.convos.map(function (c) {
    return /*#__PURE__*/React.createElement(Conversation, {
      title: c.title,
      link: c._id
    });
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, nodes);
};

var AppNavBar = /*#__PURE__*/function (_React$Component) {
  _inherits(AppNavBar, _React$Component);

  var _super = _createSuper(AppNavBar);

  function AppNavBar(props) {
    var _this;

    _classCallCheck(this, AppNavBar);

    _this = _super.call(this, props);
    _this.state = {
      showChangePassword: false,
      changeCanShowPasswordEvent: new Event('changeCanShowPassword')
    };
    _this.changeCanShowPassword = _this.changeCanShowPassword.bind(_assertThisInitialized(_this));
    addEventListener('changeCanShowPassword', _this.changeCanShowPassword);
    return _this;
  }

  _createClass(AppNavBar, [{
    key: "changeCanShowPassword",
    value: function changeCanShowPassword() {
      console.log("Eureka");
      this.setState(function (state) {
        return {
          showChangePassword: !state.showChangePassword
        };
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ReactBootstrap.Navbar, {
        bg: "dark",
        variant: "dark"
      }, /*#__PURE__*/React.createElement(ReactBootstrap.Navbar.Brand, null, /*#__PURE__*/React.createElement("div", {
        id: "logo"
      }, "Concierge")), /*#__PURE__*/React.createElement(ReactBootstrap.Nav, {
        className: "mr-auto"
      }, /*#__PURE__*/React.createElement(ReactBootstrap.Nav.Link, {
        className: "navBtn",
        href: "/logout"
      }, "Log out"), /*#__PURE__*/React.createElement(ReactBootstrap.Nav.Link, {
        className: "navBtn",
        href: "/changePassword",
        onClick: function onClick(e) {
          e.preventDefault();

          _this2.changeCanShowPassword(true);
        }
      }, "Change Password"))), /*#__PURE__*/React.createElement(ChangePassword, {
        canShow: this.state.showChangePassword,
        csrf: this.props.csrf,
        changeVisibility: this.state.changeCanShowPasswordEvent
      }));
    }
  }]);

  return AppNavBar;
}(React.Component);

var ChangePassword = /*#__PURE__*/function (_React$Component2) {
  _inherits(ChangePassword, _React$Component2);

  var _super2 = _createSuper(ChangePassword);

  function ChangePassword(props) {
    var _this3;

    _classCallCheck(this, ChangePassword);

    _this3 = _super2.call(this, props);
    _this3.state = {
      csrf: props.csrf
    };
    _this3.changePassword = _this3.changePassword.bind(_assertThisInitialized(_this3));
    return _this3;
  } // submits the new password, along with the old password for verification, to the server


  _createClass(ChangePassword, [{
    key: "changePassword",
    value: function changePassword(e) {
      e.preventDefault();

      if ($("#oldPass").val() == '' || $("#newPass").val() == '' || $("#newPass2").val() == '') {
        alert("Must enter password twice");
        return;
      }

      if ($("#newPass").val() !== $("#newPass2").val()) {
        alert("Passwords must match");
        return;
      }

      var test = $("#changePasswordForm").serializeArray();
      sendAjax('POST', '/changePassword', test, function (json) {
        alert(json.message);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Modal, {
        show: this.props.canShow,
        onHide: function onHide() {
          return dispatchEvent(_this4.props.changeVisibility);
        }
      }, /*#__PURE__*/React.createElement(Modal.Header, {
        closeButton: true
      }, /*#__PURE__*/React.createElement(Modal.Title, null, "New Conversation")), /*#__PURE__*/React.createElement(Modal.Body, null, /*#__PURE__*/React.createElement(Form, {
        id: "changePasswordForm",
        onSubmit: this.changePassword
      }, /*#__PURE__*/React.createElement(Form.Group, {
        controlId: "oldPass"
      }, /*#__PURE__*/React.createElement(Form.Label, null, "Old Password: "), /*#__PURE__*/React.createElement(Form.Control, {
        type: "password",
        name: "oldPass"
      })), /*#__PURE__*/React.createElement(Form.Group, {
        controlId: "newPass"
      }, /*#__PURE__*/React.createElement(Form.Label, null, "New Password: "), /*#__PURE__*/React.createElement(Form.Control, {
        type: "password",
        name: "newPass"
      })), /*#__PURE__*/React.createElement(Form.Group, {
        controlId: "newPass2"
      }, /*#__PURE__*/React.createElement(Form.Label, null, "Confirm New Password: "), /*#__PURE__*/React.createElement(Form.Control, {
        type: "password",
        name: "newPass2"
      })), /*#__PURE__*/React.createElement(Form.Control, {
        type: "hidden",
        name: "_csrf",
        value: this.state.csrf
      }), /*#__PURE__*/React.createElement(Button, {
        variant: "primary",
        type: "submit",
        onClick: function onClick() {
          return dispatchEvent(_this4.props.changeVisibility);
        }
      }, "Change Password")))));
    }
  }]);

  return ChangePassword;
}(React.Component);
