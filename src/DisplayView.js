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

    useEffect(() => {
        const sendGetRequest = async () => {
            try {
                const resp = await axios.get(`http://localhost:8000/detail/${filename.file}`);
                var get = String(resp.data);
                setLog(get);
            } catch (err) {
                toast.error(err);
            }
        };
        sendGetRequest();
        setTimeout(() => setLoading(true), 1000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        loading ?
            <div className="container">
                <label>{filename.file}</label><br></br>
                <div className="logDisplay">
                    {log}
                </div>
            </div>
            :
            <Loading />
    );
}

export default DisplayView;
