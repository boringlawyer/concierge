$(document).ready(function() {
    getToken();
});

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

const setup = function(csrf) {
    loadUsers(csrf);
};

const User = (props) => {
    return (
        <>
            <h1>{props.name}'s Conversations</h1>
            <ConversationList convos={props.conversations} />
        </>
    )
}

const UserList = (props) =>  {
    let users = props.userData.map(u => {
        return <User name={u.name} conversations={u.conversations}/>
    });
    return (
        <>
            {users}
        </>
    )
}

const loadUsers = (csrf) => {
    sendAjax('GET', '/getUsers', null, (data) => {
        ReactDOM.render(
            <UserList userData={data} csrf={csrf}/>, document.querySelector("#users")
        );
        ReactDOM.render(<AppNavBar csrf={csrf} />, document.querySelector('nav'));
    });

}