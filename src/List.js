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
    const [listRapports, setListRapports] = useState([]);
    const [loaded, setLoaded] = useState(0);
    const [loading, setLoading] = useState(false);
    let history = useHistory();

    function homepage(){
        history.push('/');
      }

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
        var files = listFiles;
        axios.delete("http://localhost:8000/delete/"+i)
          .then(res => { // succès
          }).catch((err) => toast.error('échec de la suppression'));
        toast.success('Ficher supprimé');
        files.splice(files.indexOf(i),1);
        setListFiles(files);
        setTimeout(() => {  homepage(); }, 1000);
      }

      function onGenerateHandler(i) {
        var newReports = listRapports;
        newReports[listFiles.indexOf(i)] = 1;
        setListRapports(newReports);
        homepage();
      }

      function onShowHandler(i) {
        var newReports = listRapports;
        newReports[listFiles.indexOf(i)] = null;
        setListRapports(newReports);
        homepage();
      }

    return (
        loading ?
            <div className="tableHolder">
                {listFiles.length !== 0 ?
                    <Table striped hover responsive className="table">
                        <thead className="thead">
                            <tr>
                                <th className="thead-th">N°</th>
                                <th className="thead-th">LOG</th>
                                <th className="thead-th">Générer Rapport</th>
                                <th className="thead-th">Afficher Rapport</th>
                                <th className="thead-th">Supprimer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listFiles.map((i) => (
                                <tr key={i}>
                                    <td className="tbody-th">{listFiles.indexOf(i) + 1}</td>
                                    <td className="tbody-th">{i}</td>
                                    <td className="tbody-th"><Button variant="primary" onClick={(event) => onGenerateHandler(i)}>Générer</Button>{' '}</td>
                                    {listRapports[listFiles.indexOf(i)] == null ?
                                        <>
                                            <td className="tbody-th"></td>
                                        </>
                                        :
                                        <>
                                            <td className="tbody-th"><Button variant="info" onClick={(event) => onShowHandler(i)}>Afficher</Button>{' '}</td>
                                        </>
                                        
                                    }
                                    <td className="tbody-th"><Button variant="danger" onClick={(event) => onDeleteHandler(i)}>X</Button>{' '}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    :
                    <p>Il n'y a aucun fichier log, veuillez en <Button variant="info" href='/upload'>déposer</Button>{' '}</p>
                }

                <ToastContainer />
            </div> : <Loading />
    );
}

export default List;