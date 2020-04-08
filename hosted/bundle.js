"use strict";

var _this2 = void 0;

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

var Conversation = function Conversation(props) {
  return /*#__PURE__*/React.createElement("h3", null, props.title);
};

var NewConversation = /*#__PURE__*/function (_React$Component) {
  _inherits(NewConversation, _React$Component);

  var _super = _createSuper(NewConversation);

  function NewConversation(props) {
    var _this;

    _classCallCheck(this, NewConversation);

    _this = _super.call(this, props);
    _this.state = {
      canShow: false,
      csrf: props.csrf
    };
    _this.show = _this.show.bind(_assertThisInitialized(_this));
    _this.hide = _this.hide.bind(_assertThisInitialized(_this));
    _this.handleNewConversation = _this.handleNewConversation.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(NewConversation, [{
    key: "show",
    value: function show() {
      this.setState({
        canShow: true
      });
    }
  }, {
    key: "hide",
    value: function hide() {
      this.setState({
        canShow: false
      });
    }
  }, {
    key: "handleNewConversation",
    value: function handleNewConversation(e) {
      e.preventDefault();

      if ($("#convoTitle").val() == '') {
        alert("Must enter a title");
        return;
      }

      var test = $("#newConvoForm").serializeArray();
      sendAjax('POST', '/createConversation', test, loadConversations);
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "primary",
        onClick: this.show
      }, "+"), /*#__PURE__*/React.createElement(Modal, {
        show: this.state.canShow,
        onHide: this.hide
      }, /*#__PURE__*/React.createElement(Modal.Header, {
        closeButton: true
      }, /*#__PURE__*/React.createElement(Modal.Title, null, "New Conversation")), /*#__PURE__*/React.createElement(Modal.Body, null, /*#__PURE__*/React.createElement(Form, {
        id: "newConvoForm",
        onSubmit: this.handleNewConversation
      }, /*#__PURE__*/React.createElement(Form.Group, {
        controlId: "convoTitle"
      }, /*#__PURE__*/React.createElement(Form.Label, null, "Title: "), /*#__PURE__*/React.createElement(Form.Control, {
        type: "text",
        name: "title"
      }), /*#__PURE__*/React.createElement(Form.Control, {
        type: "hidden",
        name: "_csrf",
        value: this.state.csrf
      }), /*#__PURE__*/React.createElement(Button, {
        variant: "primary",
        type: "submit"
      }, "Create"))))));
    }
  }]);

  return NewConversation;
}(React.Component);

var ConversationList = function ConversationList(props) {
  if (props.convos.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "convoList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyList"
    }, "No Conversations yet"), /*#__PURE__*/React.createElement(NewConversation, {
      csrf: props.csrf
    }));
  }

  var convoNodes = props.convos.map(function (c) {
    return (
      /*#__PURE__*/
      // <div key={domo._id} className="domo">
      //     <img src = "/assets/img/domoface.jpeg" alt = "Domo face" className="domoFace" />
      //     <h3 className="domoName">Name: {domo.name}</h3>
      //     <h3 className="domoAge">Age: {domo.age}</h3>
      //     <button onClick = {this.toggleIsBeingEdited}>Edit</button>
      // </div>
      React.createElement(Conversation, {
        title: c.title
      })
    );
  }, _this2);
  return /*#__PURE__*/React.createElement("div", {
    className: "convoList"
  }, convoNodes, /*#__PURE__*/React.createElement(NewConversation, {
    csrf: props.csrf
  }));
};

var loadConversations = function loadConversations(csrf) {
  sendAjax('GET', '/getConversations', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(ConversationList, {
      convos: data.convos,
      csrf: csrf
    }), document.querySelector("#convos"));
  });
};

var setup = function setup(csrf) {
  loadConversations(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
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
