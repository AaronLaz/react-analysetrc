import './index.css';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import Loading from './Loading';
import { useHistory } from 'react-router-dom';

function DisplayView() {

    const [loading, setLoading] = useState(false);
    const [log, setLog] = useState("");
    let history = useHistory();
    var filename = useParams();

    useEffect(() => {
        sendGetRequest();
        setTimeout(() => setLoading(true), 1000);
    }, []);

    const sendGetRequest = async () => {
        try {
            const resp = await axios.get(`http://localhost:8000/detail/${filename.file}`);
            var format = String(resp.data);
            setLog(format);
        } catch (err) {
            toast.error(err);
        }
    };
    return (
        loading ?
            <div className="container">
                <label>{filename.file}</label>
                <div className="logDisplay">
                    {log}
                </div>
            </div>
            :
            <Loading />
    );
}

export default DisplayView;
