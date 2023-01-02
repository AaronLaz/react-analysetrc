import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Loading from "./Loading";
import 'bootstrap/dist/css/bootstrap.css';
import { useHistory } from 'react-router-dom';
import '../index.css';

function List() {

    const [listFiles, setListFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    let history = useHistory();

    // Récupérer la liste des logs disponible
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

    // Suppression d'un fichier log
    function onDeleteHandler(i) {
        axios.delete(`http://localhost:8000/delete/${i}`)
            .then(res => { // succès
            }).catch((err) => toast.error('échec de la suppression'));
        toast.success('Ficher supprimé');
        setTimeout(() => { sendGetRequest(); }, 800);
    }

    // Navigation page rapport pour le log
    function onShowReport(i) {
        history.push(`/report/${i}`);
    }

    // Navigation page contenu pour le log
    function onDisplayHandler(i) {
        history.push(`/detail/${i}`);
    }

    return (
        loading ?
            <div className="tableHolder">
                {listFiles.length !== 0 ?
                    <>
                        <h3 className="text-secondary">Liste des fichiers logs à disposition</h3>
                        <Table hover striped responsive className="table">
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
                    </>
                    :
                    <div className="empty">
                        <div className="text-center">
                            <h3 className="display-1 fw-bold">Aucun fichier disponible</h3>
                            <p className="fs-3"> <span className="text-danger">Oups!</span></p>
                            <p className="lead">
                                Il n'y a pas de fichier log disponible, veuillez en déposer
                            </p>
                            <a href="/upload" className="btn btn-primary">Déposer un fichier log</a>
                        </div>
                    </div>
                }

                <ToastContainer />
            </div> : <Loading />
    );
}

export default List;