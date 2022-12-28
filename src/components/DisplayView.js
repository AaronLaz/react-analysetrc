import '../index.css';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory, useParams } from 'react-router-dom';
import Loading from './Loading';
import { Button } from 'react-bootstrap';

function DisplayView() {

    const [loading, setLoading] = useState(false);
    const [log, setLog] = useState("");
    var params = useParams();
    const history = useHistory();

    useEffect(() => {
        const sendGetRequest = async () => {
            try {
                const resp = await axios.get(`http://localhost:8000/detail/${params.file}`).catch(function (error) {
                    console.log('Error', error.message);
                    history.push("/error");
                });;
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

    function handleClick() {
        history.push(`/report/${params.file}`);
    }


    return (
        loading ?
            <div>
                <Button variant="primary" onClick={handleClick}>Accéder au rapport</Button>{' '}
                <div className="logDisplay">
                    <label><b>{params.file}</b></label><br></br>
                    {log}
                </div>
            </div>
            :
            <Loading />
    );
}

export default DisplayView;
