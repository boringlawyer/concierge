const handleDomo = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'}, 350);

    if ($("#domoName").val() == '' || $("#domoAge").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("domoForm").attr("action"), $("#domoForm").serializeArray(), function() {
        loadDomosFromServer();
    });

    return false;
}

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={handleDomo}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeHolder="Domo Name"/>
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="text" name="age" placeHolder="Domo Age"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input type="hidden" name="domoId" value={props._id}/>
            <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
        </form>
    )
}

const handleEditDomo = (e, domoId) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'}, 350);

    if ($(`${"#editDomoForm_" + domoId} #domoName`).val() == '' || $(`${"#editDomoForm_" + domoId} #domoAge`).val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }
    let test = $(`${"#editDomoForm_" + domoId}`);
    let testg = test.serializeArray();
    sendAjax('POST', $(`${"#editDomoForm_" + domoId}`).attr("action"), $(`${"#editDomoForm_" + domoId}`).serializeArray(), loadDomosFromServer);

    return false;
}

const EditDomoForm = (props) => {
    return (
        <form id={"editDomoForm_" + props.domoId}
            // with help from https://stackoverflow.com/questions/44917513/passing-an-additional-parameter-with-an-onchange-event
            onSubmit={(e) => handleEditDomo(e, props.domoId)}
            name="editDomoForm"
            action="/editDomo"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">New Name: </label>
            <input id="domoName" type="text" name="name" placeHolder="Domo Name"/>
            <label htmlFor="age">New Age: </label>
            <input id="domoAge" type="text" name="age" placeHolder="Domo Age"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input type="hidden" name="_id" value={props.domoId}/>
            <input className="makeDomoSubmit" type="submit" value="Edit Domo"/>
        </form>
    )
}


class DomoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isBeingEdited: false};
    }



    render() {
        if (this.props.domos.length === 0) {
            return (
                <div className="domoList">
                    <h3 className="emptyDomo">No Domos yet</h3>
                </div>
            );
        }
    
        const domoNodes = this.props.domos.map(function(domo) {
            return (
                // <div key={domo._id} className="domo">
                //     <img src = "/assets/img/domoface.jpeg" alt = "Domo face" className="domoFace" />
                //     <h3 className="domoName">Name: {domo.name}</h3>
                //     <h3 className="domoAge">Age: {domo.age}</h3>
                //     <button onClick = {this.toggleIsBeingEdited}>Edit</button>
                // </div>
                <DomoItem _id={domo._id} name={domo.name} age={domo.age}/>
            );
        }, this);

    
        return (
            <div className="domoList">
                {domoNodes}
            </div>
        )
    }
};

class DomoItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isBeingEdited: false};
        this.toggleIsBeingEdited = this.toggleIsBeingEdited.bind(this);
    }

    toggleIsBeingEdited() {
        this.setState((state, props) =>( {
            isBeingEdited: !state.isBeingEdited
        }));
    }


    render() {
        return(
        <div>
            <div key={this.props._id} className="domo">
                <img src = "/assets/img/domoface.jpeg" alt = "Domo face" className="domoFace" />
                <h3 className="domoName">Name: {this.props.name}</h3>
                <h3 className="domoAge">Age: {this.props.age}</h3>
                <button onClick = {this.toggleIsBeingEdited}>Edit</button>
            </div>
            {this.state.isBeingEdited ? <EditDomoForm csrf={DomoItem.csrf || ''} domoId = {this.props._id}/> : ''}
        </div>
        )
    }
}

const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList domos = {data.domos} />, document.querySelector("#domos")
        );
    });
};

const setup = function(csrf) {
    DomoItem.csrf = csrf;
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <DomoList domos={[]} />, document.querySelector("#domos")
    );

    loadDomosFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});