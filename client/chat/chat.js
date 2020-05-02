const conversationId = location.href.split('/')[4]

const socket = io();

socket.on('loadMsgs', (messages) => {
    // for (let m of messages) {
    //     $('#messages').append($('<li>').text(m));
    // }
    sendAjax('GET', '/getToken', null, (result) => {
        ReactDOM.render(<Messages messages={messages}/>, document.querySelector("#messages"))
        ReactDOM.render(<AppNavBar csrf={result.csrfToken}/>, document.querySelector("nav"));    
    });
});

// referenced https://api.jquery.com/val/
socket.on('broadcastInput', (input) => {
    $(`#${input.id}`).val(input.value);
})

// socket.on('updateMsgs', (message) => {
//     $('#messages').append($('<li>').text(message));
// })

$('#sendMsg').on('click', () => {
    socket.emit('message', {
        value: $('#msgText').val(),
        type: 'text'
    });
    // $('#messages').append($('<li>').text($('#msgText').val()));
});

$('#sendTextInput').on('click', () => {
    socket.emit('message', {
        type: 'textInput',
        value: ''
    });
});

$('#sendNumberInput').on('click', () => {
    socket.emit('message', {
        type: 'numberInput',
        value: ''
    });
});

$('#sendSecretInput').on('click', () => {
    socket.emit('message', {
        type: 'secretInput',
        value: ''
    });
});

// if the server is down, and then is restarted when the chat page is open, it causes an error.
// This fix ensures that when the error is caught on the server, it tells the page to refresh
socket.on('refresh', () => {
    window.location.assign(window.location.href);
})

class Messages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {messages: props.messages};
        socket.on('updateMsgs', (message) => {
            this.setState((state) => {
                state.messages.push(message);
                return {messages: state.messages}
            })
        })
    }
// thanks to https://react-bootstrap.netlify.app/components/input-group/ and https://react-bootstrap.netlify.app/components/forms/
    render() {
        return (
            <ul>
                {this.state.messages.map((m) => {
                    if (m.type == "text") {
                    return (<li id={m.id}>{m.senderName} said: {m.value}</li>);
                    }
                    else if (m.type == "textInput") {
                        return (<li>
                            <Input prepend="abc" placeholder="Text Input" aria="Text Input" messageId={m.id || m._id} inputValue={m.value}></Input>
                        </li>)
                    }
                    else if (m.type == "numberInput") {
                        return (
                            <li>
                                <Input prepend="#" placeholder="Number Input" aria="Number Input" as="number" messageId={m.id || m._id} inputValue={m.value}></Input>
                            </li>
                        )
                    }
                    else if (m.type == "secretInput") {
                        return (
                            <li>
                                <Input prepend="" placeholder="Secret Input" aria="Secret Input" as="password" messageId={m.id || m._id} inputValue={m.value}></Input>
                            </li>
                        )
                    }
                })}
            </ul>
        )
    }
}

const Input = (props) => {
    return (
        <ReactBootstrap.InputGroup>
            <ReactBootstrap.InputGroup.Prepend>
                <ReactBootstrap.InputGroup.Text>{props.prepend}</ReactBootstrap.InputGroup.Text>
            </ReactBootstrap.InputGroup.Prepend>
            <ReactBootstrap.FormControl
            placeholder={props.placeholder}
            aria-label={props.aria}
            type={props.as || "text"}
            id={props.messageId}
            defaultValue={props.inputValue}
            />
            <ReactBootstrap.InputGroup.Append>
                <Button variant="primary" onClick={() => {socket.emit('saveInput', {id: props.messageId, value: $(`#${props.messageId}`).val()} )}}>
                    Save
                </Button>
            </ReactBootstrap.InputGroup.Append>
        </ReactBootstrap.InputGroup>
    )
}