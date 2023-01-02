import '../index.css';
import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory, useParams } from 'react-router-dom';
import Loading from './Loading';
import { useReactToPrint } from 'react-to-print';
import Button from 'react-bootstrap/Button';
import ReportDisplay from './ReportDisplay';
import QueryList from './QueryList';

function Report() {

    const [loading, setLoading] = useState(false);
    var params = useParams();
    const [requetes, setRequetes] = useState([]);
    const [uniques, setUniques] = useState([]);
    const [occurences, setOccurences] = useState([]);
    const [plus1, setPlus1] = useState(0);
    const [plus2, setPlus2] = useState(0);
    const [maxOccurence, setMaxOccurence] = useState(0);
    const [requeteMax, setRequeteMax] = useState("");
    const [requeteLongue, setRequeteLongue] = useState("");
    const [queryTime, setQueryTime] = useState([]);
    const [date, setDate] = useState([]);
    const [tempsTotal, setTempsTotal] = useState();
    const [analyse, setAnalyse] = useState([]);
    const [showList, setShowList] = useState(false);

    const history = useHistory();

    useEffect(() => {
        async function initValues() {
            // Récupération contenu log
            try {
                const resp = await axios.get(`http://localhost:8000/detail/${params.file}`).catch(function (error) {
                    console.log('Error', error.message);
                    history.push("/error");
                })
                var format = String(resp.data);
                // Séparation de chaque requête
                format = explode(format, "SET", format, true);

                // Initialisation des variables
                var content = [];
                var temp1 = 0;
                var temp2 = 0;
                var tempRequetes = [];
                var tempUniques = [];
                var tempOccurences = [];
                var tempTemporelle = [];
                var tempTemporelleIndex = [];
                var tempCalculs = [];
                var tempDates = [];
                var tempDates_by_query = [];

                // Extraction des requêtes en enlevant les éléments non nécessaires
                for (var i = 0; i < format.length; i++) {
                    content[i] = explodeBasic(format[i], ";");
                    content[i][2] = explode(content[i][2], "#", content[i][2], false);
                    // Extraction du temps et la date d'exécution de la requête
                    var query_time = extractQueryTime(content[i][2][2]);
                    var query_date = extractDate(content[i][2][0]);
                    // Pour le compte des requêtes de plus de 1 et 2 secondes
                    if (query_time > 1) {
                        if (query_time > 2) {
                            temp2++;
                        }
                        temp1++;
                    }
                    // Extrait requêtes
                    var query_ext = content[i][1].trimStart();
                    // Ajout requête
                    tempRequetes.push(query_ext);
                    // Ajout temps d'exécution
                    tempTemporelle.push(query_time);
                    // Temps d'exécution avec index, pour garder l'index initial après triage
                    tempTemporelleIndex.push({ key: i, value: query_time });
                    // Ajout date
                    tempDates.push({ key: i, value: ({ query_ext, query_date }) });

                }
                // Requêtes Uniques
                for (let l = 0; l < tempRequetes.length; l++) {
                    let query = tempRequetes[l];
                    let temp_query = tempDates.find(obj => obj.key === l);
                    if (!tempUniques.includes(query)) {
                        tempUniques.push(query);
                        tempCalculs[query] = Array.from({ length: 4 }, () => tempTemporelle[l]);
                    }
                    // Si la requête est déjà existant, ajoute au compteur, sinon ajoute la requête avec un compte de 1
                    // eslint-disable-next-line
                    if (tempOccurences.findIndex(item => item.key === query) !== -1) {
                        tempOccurences[tempOccurences.findIndex(item => item.key === query)].value += 1;
                        tempDates_by_query[query].push(temp_query.value.query_date);
                    } else {
                        tempOccurences.push({ key: query, value: 1 });
                        tempDates_by_query[query] = [temp_query.value.query_date];
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

                    //moyen
                    let index = tempOccurences.findIndex(item => item.key === query);
                    if (index !== -1) {
                        tempCalculs[query][2] = tempCalculs[query][3] / tempOccurences[index].value;
                    }
                }

                // Triage requêtes par nombre de paramètres ou longeur
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

                // Requête qui se produit le plus, avec son nombre d'occurences
                const sortedQueries = tempOccurences.sort((a, b) => b.value - a.value);
                const mostFrequentQuery = sortedQueries[0].key;
                const mostFrequentQueryCount = sortedQueries[0].value;

                // trier les temps d'exécution
                tempTemporelleIndex.sort((a, b) => b.value - a.value);


                setMaxOccurence(mostFrequentQueryCount);
                setRequeteMax(mostFrequentQuery);
                setPlus1(temp1);
                setPlus2(temp2);
                setRequetes(tempRequetes);
                setUniques(tempUniques);
                setOccurences(sortedQueries);
                setQueryTime(tempTemporelleIndex[0].value);
                setRequeteLongue(tempRequetes[tempTemporelleIndex[0].key]);
                const first_query = tempDates.find(obj => obj.key === 0); // 1ère requete
                const last_query = tempDates.find(obj => obj.key === tempDates.length - 1); // dernière requete
                setTempsTotal(timeConverter(difference(first_query.value.query_date, last_query.value.query_date)));
                setAnalyse(tempCalculs);
                setDate(tempDates_by_query);
            } catch (err) {
                toast.error(err);
            }
        };
        initValues();
        setTimeout(() => setLoading(true), 2000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* Fonction pour imprimer le contenu d'un composant
    Le composant doit être un composant traditionel (extends React.component)
    Passer dans les props du composant ref={componentRef}
    */
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        pageStyle: `{ size: 2.5in 4in }`, // taille A4
        content: () => componentRef.current,
    });

    // Accéder à la page contenu du log
    function handleClick() {
        history.push(`/detail/${params.file}`);
    }

    // Switch pour afficher la liste des requêtes
    function queryList() {
        setShowList(!showList);
    }

    return (
        loading ?
            <div>
                <Button variant="primary" onClick={handleClick}>Accéder au log</Button>{' '}
                <Button variant="primary" onClick={queryList}>{showList ? "Afficher rapport" : "Afficher liste des requêtes"}</Button>{' '}
                {showList ?
                    <></>
                    :
                    <Button variant="info" onClick={handlePrint} className='printButton'>Imprimer</Button>
                }
                <div className='logDisplay'>
                    <label><b>Analyse <i>{params.file}</i></b></label>
                    {showList ?
                        <QueryList occurencecount={occurences} analyse={analyse} date={date} />
                        :
                        <ReportDisplay filename={params.file} nbRequetes={requetes.length} uniques={uniques.length} requeteMax={requeteMax} maxOccurence={maxOccurence} plus1={plus1} plus2={plus2}
                            requeteLongue={requeteLongue} queryTime={queryTime} tempsTotal={tempsTotal} ref={componentRef} />
                    }
                </div>
            </div>
            :
            <Loading />
    );
}

export default Report;

// Pour séparer les requêtes (equivalent de explode() de php)
export const explode = function (content, separator, limit, replace) {
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

// Fonction auxiliare pour ne pas rajouter l'élément enlevé
export const explodeBasic = function (content, separator) {
    var array = content.split(separator);
    if (content !== undefined && array.length >= content) {
        array.push(array.splice(content - 1).join(separator));
    }
    return array;
}

// Extraire le temps d'exécution d'une requête
export function extractQueryTime(str) {
    const match = str.match(/Query_time: (\d+\.\d+)/);
    if (match) {
        return parseFloat(match[1]);
    }
    return 0;
}

// Extraire la date d'exécution d'une requête
export function extractDate(str) {
    const inputString = str;

    // Utilise la méthode slice() pour extraire la partie de la string contenant la date ISO 
    const isoDateString = inputString.slice(7).replace(/\s/g, "");

    // Utilise la méthode Date.parse() pour parser le string de date ISO 
    const isoDate = Date.parse(isoDateString);

    // Création d'un nouveau objet date à partir du timestamp obtenu
    const date = new Date(isoDate);

    return date;
}

// Calculer la différence entre 2 dates en ms
export function difference(date1, date2) {
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

// Convertir le temps(ms) en jours, heures, minutes et secondes
export function timeConverter(timeDifference) {
    var affichage = "";
    // Calculer le nombre de jours entre les deux dates
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    if (days !== 0) {
        affichage = `${days} jour(s) ` + affichage;
    }

    // Calculer le nombre de heures entre les deux dates
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (hours !== 0) {
        affichage += `${hours} heure(s) `;
    }

    // Calculer le nombre de minutes entre les deux dates
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    if (minutes !== 0) {
        affichage += `${minutes} minute(s) `;
    }

    // Calculer le nombre de secondes entre les deux dates
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    affichage += `${seconds} seconde(s) `;

    return affichage;
}
