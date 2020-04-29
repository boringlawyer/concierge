const conversationId = location.href.split('/')[4]

const socket = io();

socket.on('loadMsgs', (messages) => {
    // for (let m of messages) {
    //     $('#messages').append($('<li>').text(m));
    // }
    ReactDOM.render(<Messages messages={messages}/>, document.querySelector("#messages"))
});

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
        type: 'textInput'
    });
});

$('#sendNumberInput').on('click', () => {
    socket.emit('message', {
        type: 'numberInput'
    });
});

$('#sendSecretInput').on('click', () => {
    socket.emit('message', {
        type: 'secretInput'
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
                    return (<li>{m.senderName} said: {m.value}</li>);
                    }
                    else if (m.type == "textInput") {
                        return (<li>
                            <Input prepend="abc" placeholder="Text Input" aria="Text Input"></Input>
                        </li>)
                    }
                    else if (m.type == "numberInput") {
                        return (
                            <li>
                                <Input prepend="#" placeholder="Number Input" aria="Number Input" as="number"></Input>
                            </li>
                        )
                    }
                    else if (m.type == "secretInput") {
                        return (
                            <li>
                                <Input prepend="" placeholder="Secret Input" aria="Secret Input" as="password"></Input>
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
            />
        </ReactBootstrap.InputGroup>
    )
}