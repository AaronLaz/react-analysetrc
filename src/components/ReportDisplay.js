import '../index.css';
import React, { useState, useEffect } from "react";
import 'react-toastify/dist/ReactToastify.css';
import Loading from './Loading';

function ReportDisplay(props) {

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(false);
        setTimeout(() => setLoading(true), 1000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        loading ?
            <div>
                <label>Nombre de requêtes détéctées: {props.nbRequetes}</label><br></br>
                <label>Nombre de requêtes uniques: {props.uniques}</label><br></br>
                <label>Requête la plus répétée: <div className="requetes">{props.requeteMax}</div></label><br></br>
                <label>Nombre répétitions: {props.maxOccurence}</label><br></br>
                <label>Nombre de requêtes {'>'}1s: {props.plus1}</label><br></br>
                <label>Nombre de requêtes {'>'}2s: {props.plus2}</label><br></br>
                <label>Requête qui a pris le plus de temps:<div className="requetes">{props.requeteLongue}</div></label><br></br>
                <label>Temps pris: {props.queryTime} secondes</label><br></br>
                <label>{props.tempsTotal} entre l'exécution de la 1ère et la {props.nbRequetes}ème requête</label><br></br>
            </div>
            :
            <Loading />
    )
}

export default ReportDisplay;
