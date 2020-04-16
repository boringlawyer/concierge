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
    let nodes = props.convos.map(c => {
        return <Conversation title={c.title} link={c._id} />
    });
    return (
        <>
            {nodes}
        </>
    )
}
