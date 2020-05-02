const handleError = (message) => {
    $("#errorMessage").text(message);
    alert(message);
};

const redirect = (response) => {
    window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};

const Conversation = (props) => {
    return (
        <a href = {`/chat/${props.link}`}>
            <h3>
                {props.title}
            </h3>
        </a>
    )
}

const ConversationList = (props) => {
    if (props.convos.length === 0) {
        return <h3 className="emptyList">No Conversations yet</h3>
    }
    let nodes = props.convos.map(c => {
        return <Conversation title={c.title} link={c._id} />
    });
    return (
        <>
            {nodes}
        </>
    )
}

class AppNavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showChangePassword: false, changeCanShowPasswordEvent: new Event('changeCanShowPassword')};
        this.changeCanShowPassword = this.changeCanShowPassword.bind(this);
        addEventListener('changeCanShowPassword', this.changeCanShowPassword);
    }

    changeCanShowPassword(){
        console.log("Eureka");
        this.setState((state) => {
            return {showChangePassword: !state.showChangePassword};
        });
    }

    render() {
        return (
            <>
                <ReactBootstrap.Navbar bg="dark" variant="dark">
                    <ReactBootstrap.Navbar.Brand><div id="logo">Concierge</div></ReactBootstrap.Navbar.Brand>
                    <ReactBootstrap.Nav className="mr-auto">
                        <ReactBootstrap.Nav.Link className="navBtn" href="/logout">Log out</ReactBootstrap.Nav.Link>
                        <ReactBootstrap.Nav.Link className="navBtn" href="/changePassword" onClick={(e) => {e.preventDefault(); this.changeCanShowPassword(true);}}>Change Password</ReactBootstrap.Nav.Link>
                    </ReactBootstrap.Nav>
                </ReactBootstrap.Navbar>
                <ChangePassword canShow={this.state.showChangePassword} csrf={this.props.csrf} changeVisibility={this.state.changeCanShowPasswordEvent}/>
            </>
        );
    } 
}

class ChangePassword extends React.Component{
    constructor(props) {
        super(props);
        this.state = {csrf: props.csrf};
        // this.show = this.show.bind(this);
        // this.hide = this.hide.bind(this);
        this.changePassword = this.changePassword.bind(this);
    }

    // show() {
    //     this.setState({canShow: true});
    // }

    // hide() {
    //     this.setState({canShow: false});
    // }

    changePassword(e) {
        e.preventDefault();
        if ($("#oldPass").val() == '' || $("#newPass").val() == '' || $("#newPass2").val() == '') {
            alert("Must enter password twice");
            return;
        }
        if ($("#newPass").val() !== $("#newPass2").val()) {
            alert("Passwords must match");
            return;
        }
        let test = $("#changePasswordForm").serializeArray();
        sendAjax('POST', '/changePassword', test, (json) => {alert(json.message)})
    }

    render() {
        return (
            <>
                <Modal show={this.props.canShow} onHide={() => dispatchEvent(this.props.changeVisibility)}>
                    <Modal.Header closeButton>
                    <Modal.Title>New Conversation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form id="changePasswordForm" onSubmit={this.changePassword}>
                            <Form.Group controlId="oldPass">
                                <Form.Label>Old Password: </Form.Label>
                                <Form.Control type="text" name="oldPass"></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="newPass">
                                <Form.Label>New Password: </Form.Label>
                                <Form.Control type="text" name="newPass"></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="newPass2">
                                <Form.Label>Confirm New Password: </Form.Label>
                                <Form.Control type="text" name="newPass2"></Form.Control>
                            </Form.Group>
                            <Form.Control type="hidden" name="_csrf" value={this.state.csrf} />
                            <Button variant="primary" type="submit" onClick={() => dispatchEvent(this.props.changeVisibility)}>
                                Change Password
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </>
        )
    }

}


