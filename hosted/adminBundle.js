"use strict";

$(document).ready(function () {
  getToken();
});

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

var setup = function setup(csrf) {
  loadUsers(csrf);
};

var User = function User(props) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", null, props.name, "'s Conversations"), /*#__PURE__*/React.createElement(ConversationList, {
    convos: props.conversations
  }));
};

var UserList = function UserList(props) {
  var users = props.userData.map(function (u) {
    return /*#__PURE__*/React.createElement(User, {
      name: u.name,
      conversations: u.conversations
    });
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, users);
};

var loadUsers = function loadUsers(csrf) {
  sendAjax('GET', '/getUsers', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(UserList, {
      userData: data,
      csrf: csrf
    }), document.querySelector("#users"));
  });
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
