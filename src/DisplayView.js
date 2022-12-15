import './index.css';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import Loading from './Loading';

function DisplayView() {

    const [loading, setLoading] = useState(false);
    const [log, setLog] = useState("");
    var filename = useParams();
    const [traitement, setTraitement] = useState([]);
    const [requetes, setRequetes] = useState([]);
    const [occurences, setOccurences] = useState([]);
    const [plus1, setPlus1] = useState(0);
    const [plus2, setPlus2] = useState(0);

    useEffect(() => {
        const sendGetRequest = async () => {
            try {
                const resp = await axios.get(`http://localhost:8000/detail/${filename.file}`);
                var format = String(resp.data);
                setLog(format);
                format = explode(format, "SET", format, true);
                var test = [];
                var temp1 = 0;
                var temp2 = 0;
                var tempRequetes = [];
                var tempOccurences = [];

                for (var i = 0; i < format.length; i++) {
                    test[i] = explodeBasic(format[i], ";");
                    test[i][2] = explode(test[i][2], "#", test[i][2], false)
                    // console.log(test[i]);
                    var query_time = parseFloat(test[i][2][2].split(" ")[2]);
                    // Query_time
                    if (query_time > 1) {
                        if (query_time > 2) {
                            temp2++;
                        }
                        temp1++;
                        // console.log("Temps requête n°" + i + " : " + query_time + "s");
                    }
                    // Extrait requêtes
                    // Nouvelle requete
                    if(tempRequetes.indexOf(test[i][1]) === -1) {
                        tempRequetes.push(test[i][1]);
                        tempOccurences.push(1);
                    }
                    // Déjà existant
                    else{
                        var index = tempRequetes.indexOf(test[i][1]);
                        tempOccurences[index]+=1;
                    }
                }
                setPlus1(temp1);
                setPlus2(temp2);
                setRequetes(tempRequetes);
                setOccurences(tempOccurences);
                setTraitement(test);
                console.log(tempRequetes[tempOccurences.indexOf(Math.max(...occurences))]);
            } catch (err) {
                toast.error(err);
            }
        };
        sendGetRequest();
        setTimeout(() => setLoading(true), 1000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // Pour séparer les requêtes (equivalent de explode() de php)
    const explode = function (content, separator, limit, replace) {
        var array = content.split(separator);
        // Supprime la 1ère élément car vide
        array.shift();
        if (replace) {
            // Rajouter chaîne enlevée après le split()
            for (var i = 0; i < array.length; i++) {
                array.splice(i, 1, separator + array[i]);
            }
        }
        if (limit !== undefined && array.length >= limit) {
            array.push(array.splice(limit - 1).join(separator));
        }
        return array;
    };

    const explodeBasic = function (content, separator) {
        var array = content.split(separator);
        if (content !== undefined && array.length >= content) {
            array.push(array.splice(content - 1).join(separator));
        }
        return array;
    }


    return (
        loading ?
            <div className="container">
                <label>Analyse {filename.file}</label><br></br>
                <label>Nombre de requêtes détéctées: {traitement.length}</label><br></br>
                <label>Nombre de requêtes uniques: {requetes.length}</label><br></br>
                <label>Nombre maximale de répétitions: {Math.max(...occurences)}</label><br></br>
                <label>Nombre de requêtes {'>'}1s: {plus1}</label><br></br>
                <label>Nombre de requêtes {'>'}2s: {plus2}</label><br></br>
                <div className="logDisplay">
                    {log}
                </div>
            </div>
            :
            <Loading />
    );
}

export default DisplayView;
