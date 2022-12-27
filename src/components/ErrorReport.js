import '../index.css';
import React from "react";
import 'react-toastify/dist/ReactToastify.css';

export default class ErrorReport extends React.Component {

    render() {
        return (
            <div className="logDisplay">
                <label><b>Erreurs <i>{this.props.filename}</i></b></label><br></br>
            </div>
        )
    }
}
