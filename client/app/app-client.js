const Conversation = (props) => {
    return (
        <a href = {`/chat/${props.link}`}>
            <h3>
                {props.title}
            </h3>
        </a>
    )
}


class NewConversation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {canShow: false, csrf: props.csrf};
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.handleNewConversation = this.handleNewConversation.bind(this);
        
    }
    
    show() {
        this.setState({canShow: true});
    }

    hide() {
        this.setState({canShow: false});
    }

    handleNewConversation (e){
        e.preventDefault();
        if ($("#convoTitle").val() == '') {
            alert("Must enter a title");
            return;
        }
        let test = $("#newConvoForm").serializeArray();
        sendAjax('POST', '/createConversation', test, loadConversations)
    }

    render() {
        return (
            <>
                <Button variant = "primary" onClick={this.show}>+</Button>
                <Modal show={this.state.canShow} onHide={this.hide}>
                    <Modal.Header closeButton>
                    <Modal.Title>New Conversation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form id="newConvoForm" onSubmit={this.handleNewConversation}>
                            <Form.Group controlId="convoTitle">
                                <Form.Label>Title: </Form.Label>
                                <Form.Control type="text" name="title"></Form.Control>
                                <Form.Control type="hidden" name="_csrf" value={this.state.csrf} />
                                <Button variant="primary" type="submit">
                                    Create
                                </Button>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                </Modal>
            </>
        )
    }
}

const ConversationList = (props) => {
        if (props.convos.length === 0) {
            return (
                <div className="convoList">
                    <h3 className="emptyList">No Conversations yet</h3>
                    <NewConversation csrf={props.csrf}/>
                </div>
            );
        }
    
        const convoNodes = props.convos.map(function(c) {
            return (
                <Conversation title = {c.title} link = {c._id}/>
            );
        }, this);

    
        return (
            <div className="convoList">
                {convoNodes}
                <NewConversation csrf={props.csrf}/>
            </div>
        )
};

const loadConversations = (csrf) => {
    sendAjax('GET', '/getConversations', null, (data) => {
        ReactDOM.render(
            <ConversationList convos={data.convos} csrf={csrf}/>, document.querySelector("#convos")
        );
    });
};

const setup = function(csrf) {

    loadConversations(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});