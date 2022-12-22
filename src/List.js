import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Loading from "./Loading";
import 'bootstrap/dist/css/bootstrap.css';
import { useHistory } from 'react-router-dom';
import './index.css';

function List() {

    const [listFiles, setListFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    let history = useHistory();

    const sendGetRequest = async () => {
        try {
            const resp = await axios.get('http://localhost:8000/getfiles');
            setListFiles(resp.data);
        } catch (err) {
            toast.error(err);
        }
    };

    useEffect(() => {
        sendGetRequest();
        setTimeout(() => setLoading(true), 1000);
    }, []);

    function onDeleteHandler(i) {
        axios.delete("http://localhost:8000/delete/" + i)
            .then(res => { // succès
            }).catch((err) => toast.error('échec de la suppression'));
        toast.success('Ficher supprimé');
        setTimeout(() => { sendGetRequest(); }, 800);
    }

    function onShowReport(i) {
        history.push(`/report/${i}`);
    }

    function onDisplayHandler(i) {
        history.push(`/detail/${i}`);
    }

    return (
        loading ?
            <div className="tableHolder">
                {listFiles.length !== 0 ?
                    <Table hover responsive className="table">
                        <thead className="thead">
                            <tr>
                                <th className="thead-th">N°</th>
                                <th className="thead-th">LOG</th>
                                <th className="thead-th">Afficher Rapport</th>
                                <th className="thead-th">Supprimer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listFiles.map((i) => (
                                <tr key={i}>
                                    <td className="tbody-th">{listFiles.indexOf(i) + 1}</td>
                                    <td className="tbody-th"><Button variant="link" onClick={(event) => onDisplayHandler(i)}>{i}</Button>{' '}</td>
                                    <td className="tbody-th"><Button variant="primary" onClick={(event) => onShowReport(i)}>Accéder</Button>{' '}</td>
                                    <td className="tbody-th"><Button variant="danger" onClick={(event) => onDeleteHandler(i)}>X</Button>{' '}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    :
                    <div className="empty">Il n'y a aucun fichier log, veuillez <Button variant="info" href='/upload'>déposer</Button>{' '}</div>
                }

                <ToastContainer />
            </div> : <Loading />
    );
}

export default List;