import '../index.css';
import React from "react";
import 'react-toastify/dist/ReactToastify.css';

export default class ReportDisplay extends React.Component {

    render() {
        return (
            <div className="logDisplay">
                <label><b>Analyse <i>{this.props.filename}</i></b></label><br></br>
                <label>Nombre de requêtes détéctées: {this.props.nbRequetes}</label><br></br>
                <label>Nombre de requêtes uniques: {this.props.uniques}</label><br></br>
                <label>Requête la plus répétée: <div className="requetes">{this.props.requeteMax}</div></label><br></br>
                <label>Nombre répétitions: {this.props.maxOccurence}</label><br></br>
                <label>Nombre de requêtes {'>'}1s: {this.props.plus1}</label><br></br>
                <label>Nombre de requêtes {'>'}2s: {this.props.plus2}</label><br></br>
                <label>Requête qui a pris le plus de temps:<div className="requetes">{this.props.requeteLongue}</div></label><br></br>
                <label>Temps pris: {this.props.queryTime} secondes</label><br></br>
                <label>{this.props.tempsTotal} entre l'exécution de la 1ère et la {this.props.nbRequetes}ème requête</label><br></br>
            </div>
        )
    }
}
