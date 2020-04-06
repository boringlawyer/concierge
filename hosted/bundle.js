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

var handleDomo = function handleDomo(e) {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#domoName").val() == '' || $("#domoAge").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax('POST', $("domoForm").attr("action"), $("#domoForm").serializeArray(), function () {
    loadDomosFromServer();
  });
  return false;
};

var DomoForm = function DomoForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "domoForm",
    onSubmit: handleDomo,
    name: "domoForm",
    action: "/maker",
    method: "POST",
    className: "domoForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Name: "), /*#__PURE__*/React.createElement("input", {
    id: "domoName",
    type: "text",
    name: "name",
    placeHolder: "Domo Name"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "age"
  }, "Age: "), /*#__PURE__*/React.createElement("input", {
    id: "domoAge",
    type: "text",
    name: "age",
    placeHolder: "Domo Age"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "domoId",
    value: props._id
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeDomoSubmit",
    type: "submit",
    value: "Make Domo"
  }));
};

var handleEditDomo = function handleEditDomo(e, domoId) {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("".concat("#editDomoForm_" + domoId, " #domoName")).val() == '' || $("".concat("#editDomoForm_" + domoId, " #domoAge")).val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  var test = $("".concat("#editDomoForm_" + domoId));
  var testg = test.serializeArray();
  sendAjax('POST', $("".concat("#editDomoForm_" + domoId)).attr("action"), $("".concat("#editDomoForm_" + domoId)).serializeArray(), loadDomosFromServer);
  return false;
};

var EditDomoForm = function EditDomoForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "editDomoForm_" + props.domoId // with help from https://stackoverflow.com/questions/44917513/passing-an-additional-parameter-with-an-onchange-event
    ,
    onSubmit: function onSubmit(e) {
      return handleEditDomo(e, props.domoId);
    },
    name: "editDomoForm",
    action: "/editDomo",
    method: "POST",
    className: "domoForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "New Name: "), /*#__PURE__*/React.createElement("input", {
    id: "domoName",
    type: "text",
    name: "name",
    placeHolder: "Domo Name"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "age"
  }, "New Age: "), /*#__PURE__*/React.createElement("input", {
    id: "domoAge",
    type: "text",
    name: "age",
    placeHolder: "Domo Age"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_id",
    value: props.domoId
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeDomoSubmit",
    type: "submit",
    value: "Edit Domo"
  }));
};

var DomoList = /*#__PURE__*/function (_React$Component) {
  _inherits(DomoList, _React$Component);

  var _super = _createSuper(DomoList);

  function DomoList(props) {
    var _this;

    _classCallCheck(this, DomoList);

    _this = _super.call(this, props);
    _this.state = {
      isBeingEdited: false
    };
    return _this;
  }

  _createClass(DomoList, [{
    key: "render",
    value: function render() {
      if (this.props.domos.length === 0) {
        return /*#__PURE__*/React.createElement("div", {
          className: "domoList"
        }, /*#__PURE__*/React.createElement("h3", {
          className: "emptyDomo"
        }, "No Domos yet"));
      }

      var domoNodes = this.props.domos.map(function (domo) {
        return (
          /*#__PURE__*/
          // <div key={domo._id} className="domo">
          //     <img src = "/assets/img/domoface.jpeg" alt = "Domo face" className="domoFace" />
          //     <h3 className="domoName">Name: {domo.name}</h3>
          //     <h3 className="domoAge">Age: {domo.age}</h3>
          //     <button onClick = {this.toggleIsBeingEdited}>Edit</button>
          // </div>
          React.createElement(DomoItem, {
            _id: domo._id,
            name: domo.name,
            age: domo.age
          })
        );
      }, this);
      return /*#__PURE__*/React.createElement("div", {
        className: "domoList"
      }, domoNodes);
    }
  }]);

  return DomoList;
}(React.Component);

;

var DomoItem = /*#__PURE__*/function (_React$Component2) {
  _inherits(DomoItem, _React$Component2);

  var _super2 = _createSuper(DomoItem);

  function DomoItem(props) {
    var _this2;

    _classCallCheck(this, DomoItem);

    _this2 = _super2.call(this, props);
    _this2.state = {
      isBeingEdited: false
    };
    _this2.toggleIsBeingEdited = _this2.toggleIsBeingEdited.bind(_assertThisInitialized(_this2));
    return _this2;
  }

  _createClass(DomoItem, [{
    key: "toggleIsBeingEdited",
    value: function toggleIsBeingEdited() {
      this.setState(function (state, props) {
        return {
          isBeingEdited: !state.isBeingEdited
        };
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        key: this.props._id,
        className: "domo"
      }, /*#__PURE__*/React.createElement("img", {
        src: "/assets/img/domoface.jpeg",
        alt: "Domo face",
        className: "domoFace"
      }), /*#__PURE__*/React.createElement("h3", {
        className: "domoName"
      }, "Name: ", this.props.name), /*#__PURE__*/React.createElement("h3", {
        className: "domoAge"
      }, "Age: ", this.props.age), /*#__PURE__*/React.createElement("button", {
        onClick: this.toggleIsBeingEdited
      }, "Edit")), this.state.isBeingEdited ? /*#__PURE__*/React.createElement(EditDomoForm, {
        csrf: DomoItem.csrf || '',
        domoId: this.props._id
      }) : '');
    }
  }]);

  return DomoItem;
}(React.Component);

var loadDomosFromServer = function loadDomosFromServer() {
  sendAjax('GET', '/getDomos', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
      domos: data.domos
    }), document.querySelector("#domos"));
  });
};

var setup = function setup(csrf) {
  DomoItem.csrf = csrf;
  ReactDOM.render( /*#__PURE__*/React.createElement(DomoForm, {
    csrf: csrf
  }), document.querySelector("#makeDomo"));
  ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
    domos: []
  }), document.querySelector("#domos"));
  loadDomosFromServer();
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
  $("#domoMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("domoMessage").animate({
    width: 'hide'
  }, 350);
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
