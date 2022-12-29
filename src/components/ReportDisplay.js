import '../index.css';
import React, {useEffect} from "react";
import 'react-toastify/dist/ReactToastify.css';
import Loading from './Loading';

export default class ReportDisplay extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          loading : false,
        }
      }

      componentDidMount = () => {
        setTimeout(() => this.setState({loading:true}), 1000);
      }

    render(){
        return (
        this.state.loading ? 
        <div>
            <div className="hiddenTitle">
                <label><b>Analyse <i>{this.props.filename} {"\n"}</i></b></label>
            </div>
            <label>Nombre de requêtes détéctées: {this.props.nbRequetes} {"\n"}</label>
            <label>Nombre de requêtes uniques: {this.props.uniques} {"\n"}</label>
            <label>Requête la plus répétée: <div className="requetes">{this.props.requeteMax} {"\n"}</div></label>
            <label>Nombre répétitions: {this.props.maxOccurence} {"\n"}</label>
            <label>Nombre de requêtes {'>'}1s: {this.props.plus1} {"\n"}</label>
            <label>Nombre de requêtes {'>'}2s: {this.props.plus2} {"\n"}</label>
            <label>Requête qui a pris le plus de temps:<div className="requetes">{this.props.requeteLongue} {"\n"}</div></label>
            <label>Temps pris: {this.props.queryTime} secondes {"\n"}</label>
            <label>{this.props.tempsTotal} entre l'exécution de la 1ère et la {this.props.nbRequetes} ème requête {"\n"} </label>
        </div>
        :
        <Loading />
    )
    }
    
}

