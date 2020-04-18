const conversationId = location.href.split('/')[4]

const socket = io();

socket.on('loadMsgs', (messages) => {
    for (let m of messages) {
        $('#messages').append($('<li>').text(m));
    }
});

socket.on('updateMsgs', (message) => {
    $('#messages').append($('<li>').text(message));
})

$('#sendMsg').on('click', () => {
    socket.emit('message', $('#msgText').val());
    // $('#messages').append($('<li>').text($('#msgText').val()));
});

// if the server is down, and then is restarted when the chat page is open, it causes an error.
// This fix ensures that when the error is caught on the server, it tells the page to refresh
socket.on('refresh', () => {
    window.location.assign(window.location.href);
})
