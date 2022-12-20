import './index.css';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import Loading from './Loading';

function Report() {

    const [loading, setLoading] = useState(false);
    var filename = useParams();
    const [requetes, setRequetes] = useState([]);
    const [uniques, setUniques] = useState([]);
    const [occurences, setOccurences] = useState([]);
    const [plus1, setPlus1] = useState(0);
    const [plus2, setPlus2] = useState(0);
    const [maxOccurence, setMaxOccurence] = useState(0);
    const [requeteMax, setRequeteMax] = useState("");
    const [requeteLongue, setRequeteLongue] = useState("");
    const [queryTime, setQueryTime] = useState([]);
    const [dates, setDates] = useState([]);
    const [tempsTotal, setTempsTotal] = useState();
    const [analyse,setAnalyse] = useState([]);

    useEffect(() => {
        const sendGetRequest = async () => {
            try {
                const resp = await axios.get(`http://localhost:8000/detail/${filename.file}`);
                var format = String(resp.data);
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
                var tempDates = [];

                for (var i = 0; i < format.length; i++) {
                    content[i] = explodeBasic(format[i], ";");
                    content[i][2] = explode(content[i][2], "#", content[i][2], false);
                    // var query_time = parseFloat(test[i][2][2].split(" ")[2]);
                    var query_time = extractQueryTime(content[i][2][2]);
                    var query_date = extractDate(content[i][2][0]);
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
                    tempDates.push(query_date);

                }
                // Requêtes Uniques
                for (var l = 0; l < tempRequetes.length; l++) {
                    var query = tempRequetes[l];
                    if (!tempUniques.includes(query)) {
                        tempUniques.push(query);
                        // eslint-disable-next-line
                        tempCalculs[query] = Array.from({ length: 4 }, () => tempTemporelle[l]);
                    }
                    if (!tempOccurences[query]) {
                        tempOccurences[query] = 1;
                    } else {
                        tempOccurences[query] += 1;
                    }
                    // Temps d'exécution de chaque requête: min,max,moyen,cumulé
                    // min
                    if (tempTemporelle[l] < tempCalculs[query][0]) {
                        tempCalculs[query][0] = tempTemporelle[l];
                    }
                    // max
                    if (tempTemporelle[l] > tempCalculs[query][1]) {
                        tempCalculs[query][1] = tempTemporelle[l];
                    }
                    // cumul
                    tempCalculs[query][3] += tempTemporelle[l];
                    // moyen
                }
                // TODO
                tempCalculs.forEach((query => {
                    query[2] = tempTemporelle[query][3] / tempOccurences[query];
                }))
                

                tempUniques.sort((a, b) => {
                    let numParamsA = 0;
                    let numParamsB = 0;

                    // Vérifier si la clause "WHERE" est présent
                    if (a.split("WHERE").length > 1) {
                        numParamsA = a.split("WHERE")[1].split("AND").length;
                    }
                    if (b.split("WHERE").length > 1) {
                        numParamsB = b.split("WHERE")[1].split("AND").length;
                    }

                    // Trier en premier par le nb de paramères dans la clause "WHERE"
                    if (numParamsA !== numParamsB) {
                        return numParamsA - numParamsB;
                    }

                    // si le nb de params est égale, trier par la longeur de la requête
                    return a.length - b.length;
                });

                // console.log(tempRequetes[tempOccurences.indexOf(Math.max(...occurences))]);

                // Requête qui se produit le plus, avec son nombre d'occurences
                const sortedQueries = Object.entries(tempOccurences).sort((a, b) => b[1] - a[1]);
                const mostFrequentQuery = sortedQueries[0][0];
                const mostFrequentQueryCount = sortedQueries[0][1];
                setMaxOccurence(mostFrequentQueryCount);
                setRequeteMax(mostFrequentQuery);
                setPlus1(temp1);
                setPlus2(temp2);
                setRequetes(tempRequetes);
                setUniques(tempUniques);
                setOccurences(tempOccurences);
                setQueryTime(maxTime);
                setRequeteLongue(tempRequetes[maxI]);
                setDates(tempDates);
                setTempsTotal(timeConverter(difference(tempDates[0], tempDates[tempDates.length - 1])));
                setAnalyse(tempCalculs);
                console.log(tempCalculs);
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

    function extractDate(str) {
        const inputString = str;

        // Utilise la méthode slice() pour extraire la partie de la string contenant la date ISO 
        const isoDateString = inputString.slice(7).replace(/\s/g, "");

        // Utilise la méthode Date.parse() pour parser le string de date ISO 
        const isoDate = Date.parse(isoDateString);

        // Création d'un nouveau objet date à partir du timestamp obtenu
        const date = new Date(isoDate);

        return date;
    }

    function difference(date1, date2) {
        // Definir la date de début et fin
        const startDate = date1;
        const endDate = date2;

        // Utilise la méthode getTime() pour récupérer le nombre de millisecondes depuis l'epoch Unix pour chaque date
        const startTime = startDate.getTime();
        const endTime = endDate.getTime();

        // Calculer la différence en millisecondes entre les deux dates
        const timeDifference = endTime - startTime;

        return timeDifference;
    }

    function timeConverter(timeDifference) {
        // Calculer le nombre de jours entre les deux dates
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        // Calculer le nombre de heures entre les deux dates
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        // Calculer le nombre de minutes entre les deux dates
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

        // Calculer le nombre de secondes entre les deux dates
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        return `${days} jour(s), ${hours} heure(s), ${minutes} minute(s), et ${seconds} second(s)`;
    }


    return (
        loading ?
            <div className="logDisplay">
                <label>Analyse {filename.file}</label><br></br>
                <label>Nombre de requêtes détéctées: {requetes.length}</label><br></br>
                <label>Nombre de requêtes uniques: {uniques.length}</label><br></br>
                <label>Requête la plus répétée: {requeteMax}</label><br></br>
                <label>Nombre répétitions: {maxOccurence}</label><br></br>
                <label>Nombre de requêtes {'>'}1s: {plus1}</label><br></br>
                <label>Nombre de requêtes {'>'}2s: {plus2}</label><br></br>
                <label>Requête qui a pris le plus de temps:{requeteLongue}</label><br></br>
                <label>Temps pris: {queryTime} secondes</label><br></br>
                <label>{tempsTotal} entre l'exécution de la 1ère et la {requetes.length}ème requête</label><br></br>
            </div>
            :
            <Loading />
    );
}

export default Report;
