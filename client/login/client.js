// help from https://getbootstrap.com/docs/4.4/components/forms/
// submits data from the login form to the server
const handleLogin = (e) => {
    e.preventDefault();
    if ($("#user").val() == '' || $("#pass").val() == '') {
        handleError("Username or password is empty");
        return false;
    }

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serializeArray(), redirect);

    return false;
}
// submits data from the signup form to the server
const handleSignup = (e) => {
    e.preventDefault();
    if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("All fields are required");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serializeArray(), redirect);

    return false;
}

const LoginWindow = (props) => {
    return (
        <form id="loginForm" name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm"
        >
            <div className="form-group row">
                <label htmlFor="username">Username: </label>
                <input className="form-control" id="user" type="text" name="username" placeholder="username"></input>
            </div>
            <div className="form-group row">
                <label htmlFor="pass">Password: </label>
                <input className="form-control" id="pass" type="password" name="pass" placeholder="password"></input>
            </div>
            <input type="hidden" name="_csrf" value={props.csrf}></input>
            <input className="formSubmit btn btn-primary" type="submit" value="Sign in" />
        </form>
    );
};
// with help from https://react-bootstrap.netlify.app/components/navbar
const LoginNavBar = (props) => {
    return (
        <ReactBootstrap.Navbar bg="dark" variant="dark">
            <ReactBootstrap.Navbar.Brand><div id="logo">Concierge</div></ReactBootstrap.Navbar.Brand>
        </ReactBootstrap.Navbar>

    )
}

const SignupWindow = (props) => {
    return (
        <form id="signupForm"
            name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
        >
            <div className="form-group row">
                <label htmlFor="username">Username: </label>
                <input className="form-control" id="user" type="text" name="username" placeholder="username"></input>
            </div>
            <div className="form-group row">
                <label htmlFor="pass">Password: </label>
                <input className="form-control" id="pass" type="password" name="pass" placeholder="password"></input>
            </div>
            <div className="form-group row">
                <label htmlFor="pass2"></label>
                <input className="form-control" id="pass2" type="password" name="pass2" placeholder="retype password"></input>
            </div>
                <input type="hidden" name="_csrf" value={props.csrf}></input>
                <input type="hidden" name="isAdmin" value={props.isAdmin}></input>
                <input className="formSubmit btn btn-primary" type="submit" value={props.isAdmin ? "Sign up as admin" : "Sign up"} />
        </form>
    );
};


const createLoginWindow = (csrf) => {
    ReactDOM.render(<LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const createSignupWindow = (csrf, isAdmin) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} isAdmin={isAdmin}/>,
        document.querySelector("#content")
    );
};

const setup = (csrf) => {
    ReactDOM.render(<LoginNavBar></LoginNavBar>, document.querySelector("#navbar"));
    // https://www.w3schools.com/css/css_attribute_selectors.asp
    const loginButton = document.querySelector('[href="/login"]');
    const signupButton = document.querySelector('[href="/signup"]');
    const adminSignupButton = document.querySelector('[href="/adminSignup"]');

    // hooks up the three buttons to change the form

    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSignupWindow(csrf, false);
        return false;
    });

    adminSignupButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSignupWindow(csrf, true);
        return false;
    });

    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    createLoginWindow(csrf); // default view
}

const getToken = () => {
    sendAjax('GET', '/getToken', null, result => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});