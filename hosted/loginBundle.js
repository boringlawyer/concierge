"use strict";

// help from https://getbootstrap.com/docs/4.4/components/forms/
var handleLogin = function handleLogin(e) {
  e.preventDefault();

  if ($("#user").val() == '' || $("#pass").val() == '') {
    handleError("Username or password is empty");
    return false;
  }

  console.log($("input[name=_csrf]").val());
  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serializeArray(), redirect);
  return false;
};

var handleSignup = function handleSignup(e) {
  e.preventDefault();

  if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("All fields are required");
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serializeArray(), redirect);
  return false;
};

var LoginWindow = function LoginWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "loginForm",
    name: "loginForm",
    onSubmit: handleLogin,
    action: "/login",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group row"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "username"
  }, "Username: "), /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    id: "user",
    type: "text",
    name: "username",
    placeholder: "username"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group row"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "password"
  })), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit form-control",
    type: "submit",
    value: "Sign in"
  }));
}; // with help from https://react-bootstrap.netlify.app/components/navbar


var LoginNavBar = function LoginNavBar(props) {
  return /*#__PURE__*/React.createElement(ReactBootstrap.Navbar, {
    bg: "dark",
    variant: "dark"
  }, /*#__PURE__*/React.createElement(ReactBootstrap.Navbar.Brand, null, "Concierge"), /*#__PURE__*/React.createElement(ReactBootstrap.Nav, {
    className: "mr-auto"
  }, /*#__PURE__*/React.createElement(ReactBootstrap.Nav.Link, {
    id: "loginButton"
  }, /*#__PURE__*/React.createElement("a", {
    className: "navlink",
    href: "/login"
  }, "Login")), /*#__PURE__*/React.createElement(ReactBootstrap.Nav.Link, {
    id: "signupButton"
  }, /*#__PURE__*/React.createElement("a", {
    className: "navlink",
    href: "/signup"
  }, "Signup")), /*#__PURE__*/React.createElement(ReactBootstrap.Nav.Link, {
    id: "adminSignupButton"
  }, /*#__PURE__*/React.createElement("a", {
    className: "navlink",
    href: "/adminSignup"
  }, "Signup as Admin"))));
};

var SignupWindow = function SignupWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "signupForm",
    name: "signupForm",
    onSubmit: handleSignup,
    action: "/signup",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group row"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "username"
  }, "Username: "), /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    id: "user",
    type: "text",
    name: "username",
    placeholder: "username"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group row"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "password"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group row"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass2"
  }), /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    id: "pass2",
    type: "password",
    name: "pass2",
    placeholder: "retype password"
  })), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "isAdmin",
    value: props.isAdmin
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit form-control",
    type: "submit",
    value: "Sign in"
  }));
};

var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(LoginWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
};

var createSignupWindow = function createSignupWindow(csrf, isAdmin) {
  ReactDOM.render( /*#__PURE__*/React.createElement(SignupWindow, {
    csrf: csrf,
    isAdmin: isAdmin
  }), document.querySelector("#content"));
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(LoginNavBar, null), document.querySelector("#navbar")); // https://www.w3schools.com/css/css_attribute_selectors.asp

  var loginButton = document.querySelector('[href="/login"]');
  var signupButton = document.querySelector('[href="/signup"]');
  var adminSignupButton = document.querySelector('[href="/adminSignup"]');
  signupButton.addEventListener("click", function (e) {
    e.preventDefault();
    createSignupWindow(csrf, false);
    return false;
  });
  adminSignupButton.addEventListener("click", function (e) {
    e.preventDefault();
    createSignupWindow(csrf, true);
    return false;
  });
  loginButton.addEventListener("click", function (e) {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });
  createLoginWindow(csrf); // default view
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
