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
        <div className='content'>
            <div className="hiddenTitle">
                <div><b>Analyse <i>{this.props.filename}</i></b></div>
            </div>
            <div>Nombre de requêtes détéctées: {this.props.nbRequetes}</div>
            <div>Nombre de requêtes uniques: {this.props.uniques}</div>
            <div>Requête la plus répétée: <div className="requetes">{this.props.requeteMax}</div></div>
            <div>Nombre répétitions: {this.props.maxOccurence}</div>
            <div>Nombre de requêtes {'>'}1s: {this.props.plus1}</div>
            <div>Nombre de requêtes {'>'}2s: {this.props.plus2}</div>
            <div>Requête qui a pris le plus de temps:<div className="requetes">{this.props.requeteLongue}</div></div>
            <div>Temps pris: {this.props.queryTime} secondes</div>
            <div>{this.props.tempsTotal} entre l'exécution de la 1ère et la {this.props.nbRequetes} ème requête</div>
        </div>
        :
        <Loading />
    )
    }
    
}

