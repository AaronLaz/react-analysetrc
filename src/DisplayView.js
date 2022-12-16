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
    const [requetes, setRequetes] = useState([]);
    const [uniques, setUniques] = useState([]);
    const [occurences, setOccurences] = useState([]);
    const [plus1, setPlus1] = useState(0);
    const [plus2, setPlus2] = useState(0);
    const [maxOccurence,setMaxOccurence] = useState(0);
    const [requeteMax,setRequeteMax] = useState("");
    const [queryTime,setQueryTime] = useState([]);

    useEffect(() => {
        const sendGetRequest = async () => {
            try {
                const resp = await axios.get(`http://localhost:8000/detail/${filename.file}`);
                var format = String(resp.data);
                setLog(format);
                format = explode(format, "SET", format, true);
                var content = [];
                var temp1 = 0;
                var temp2 = 0;
                var tempRequetes = [];
                var tempUniques = [];
                var tempOccurences = [];
                var maxI = 0;
                var maxTime = 0;
                var tempTemporelle = [];
                var tempCalculs = [];

                for (var i = 0; i < format.length; i++) {
                    content[i] = explodeBasic(format[i], ";");
                    content[i][2] = explode(content[i][2], "#", content[i][2], false);
                    // var query_time = parseFloat(test[i][2][2].split(" ")[2]);
                    var query_time = extractQueryTime(content[i][2][2])
                    // Query_time
                    if (query_time > 1) {
                        if (query_time > 2) {
                            temp2++;
                        }
                        temp1++;
                    }
                    // Trouver la requête qui a pris le plus de temps
                    if (query_time > maxTime) {
                        maxI = i;
                        maxTime = query_time;
                    }
                    // Extrait requêtes
                    tempRequetes.push(content[i][1]);
                    tempTemporelle.push(query_time);

                }
                // Requêtes Uniques
                for(var i = 0; i < tempRequetes.length; i++){
                    var query = tempRequetes[i];
                    if (!tempUniques.includes(query)) {
                        tempUniques.push(query);
                        tempCalculs[query] = Array.from({ length: 4 }, () => tempTemporelle[i]);;
                    }
                    if (!tempOccurences[query]) {
                        tempOccurences[query] = 1;
                    } else {
                        tempOccurences[query] += 1;
                    }
                    // Temps d'exécution de chaque requête: min,max,moyen,cumulé
                    // min
                    if (tempTemporelle[i] < tempCalculs[query][0]){
                        tempCalculs[query][0] = tempTemporelle[i];
                    }
                    // max
                    if (tempTemporelle[i] > tempCalculs[query][1]){
                        tempCalculs[query][1] = tempTemporelle[i];
                    }
                    // cumul
                    tempCalculs[query][3] += tempTemporelle[i];
                    // moyen
                }
                // TODO
                tempCalculs.forEach((query => {
                    tempCalculs[query][2]  = tempTemporelle[query][3] / tempOccurences[query];
                    console.log(tempCalculs[query]);
                }))
                setPlus1(temp1);
                setPlus2(temp2);
                setRequetes(tempRequetes);
                setUniques(tempUniques);
                setOccurences(tempOccurences);

                tempUniques.sort((a, b) => {
                    let numParamsA = 0;
                    let numParamsB = 0;

                    // Check if the "WHERE" clause is present
                    if (a.split("WHERE").length > 1) {
                        numParamsA = a.split("WHERE")[1].split("AND").length;
                    }
                    if (b.split("WHERE").length > 1) {
                        numParamsB = b.split("WHERE")[1].split("AND").length;
                    }

                    // Sort first by the number of parameters in the "WHERE" clause
                    if (numParamsA !== numParamsB) {
                        return numParamsA - numParamsB;
                    }

                    // If the number of parameters is the same, sort by string length
                    return a.length - b.length;
                });

                // console.log(tempRequetes[tempOccurences.indexOf(Math.max(...occurences))]);

                // Requête qui se produit le plus, avec son nombre d'occurences
                const sortedQueries = Object.entries(tempOccurences).sort((a, b) => b[1] - a[1]);
                const mostFrequentQuery = sortedQueries[0][0];
                const mostFrequentQueryCount = sortedQueries[0][1];
                setMaxOccurence(mostFrequentQueryCount);
                setRequeteMax(mostFrequentQuery);
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

    function extractQueryTime(str) {
        const match = str.match(/Query_time: (\d+\.\d+)/);
        if (match) {
            return parseFloat(match[1]);
        }
        return 0;
    }


    return (
        loading ?
            <div className="container">
                <label>Analyse {filename.file}</label><br></br>
                <label>Nombre de requêtes détéctées: {requetes.length}</label><br></br>
                <label>Nombre de requêtes uniques: {uniques.length}</label><br></br>
                <label>Nombre maximale de répétitions: {maxOccurence}</label><br></br>
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
