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

    useEffect(() => {
        const sendGetRequest = async () => {
            try {
                const resp = await axios.get(`http://localhost:8000/detail/${filename.file}`);
                var format = String(resp.data);
                setLog(format);
                format = explode(format, "SET", format);
                setTraitement(format);
                console.log(format);
                console.log(format.length);
            } catch (err) {
                toast.error(err);
            }
        };
        sendGetRequest();
        setTimeout(() => setLoading(true), 1000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // Pour séparer les requêtes (equivalent de explode() de php)
    const explode = function (content, separator, limit) {
        var array = content.split(separator);
        // Supprime la 1ère élément car vide
        array.shift();
        // Rajouter chaîne enlevée après le split()
        for (var i = 0; i < array.length; i++) {
            array.splice(i, 1, separator + array[i]);
        }
        if (limit !== undefined && array.length >= limit) {
            array.push(array.splice(limit - 1).join(separator));
        }
        return array;
    };


    return (
        loading ?
            <div className="container">
                <label>{filename.file}</label><br></br>
                <label>Nombre de requêtes détéctées: {traitement.length}</label>
                <div className="logDisplay">
                    {log}
                </div>
            </div>
            :
            <Loading />
    );
}

export default DisplayView;
