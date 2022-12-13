import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Loading from "./Loading";
import 'bootstrap/dist/css/bootstrap.css';
import { useHistory } from 'react-router-dom';

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
        var filename = listFiles[i];
        axios.delete("http://localhost:8000/delete/"+filename, {
          onUploadProgress: ProgressEvent => {
            setLoaded(ProgressEvent.loaded / ProgressEvent.total * 100)
          },
        })
          .then(res => { // affichage résultat
            toast.success('ficher supprimé');
            setTimeout(() => {  homepage(); }, 4000);
          }).catch((err) => toast.error('échec de la suppression'));
          listFiles.splice(i,1);
          homepage();
      }

    return (
        loading ?
            <div>
                {listFiles.length !== 0 ?
                    <Table striped hover responsive className="table">
                        <thead className="thead">
                            <tr>
                                <th className="thead-th">N°</th>
                                <th className="thead-th">LOG</th>
                                <th className="thead-th">AFFICHER</th>
                                <th className="thead-th">SUPPRIMER</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listFiles.map((i) => (
                                <tr key={i}>
                                    <td className="mercurial-thead-th">{listFiles.indexOf(i) + 1}</td>
                                    <td className="mercurial-thead-th">{i}</td>
                                    {listRapports[listFiles.indexOf(i)] == null ?
                                        <td className="mercurial-tbody-th">Génerer rapport</td>
                                        :
                                        <td className="mercurial-tbody-th">Afficher rapport</td>
                                    }
                                    <td className="mercurial-thead-th"><Button variant="danger" onClick={(event) => onDeleteHandler(i)}>X</Button>{' '}</td>
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