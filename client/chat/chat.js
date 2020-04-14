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