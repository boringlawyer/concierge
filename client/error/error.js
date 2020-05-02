$(document).ready(function() {
    getToken();
})

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        ReactDOM.render(<AppNavBar csrf={result.csrf} />, document.querySelector('nav'));
    });
};
