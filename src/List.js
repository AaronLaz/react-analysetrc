import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import Table from 'react-bootstrap/Table';

function List() {

    const [listFiles, setListFiles] = useState([]);
    const [listRapports, setListRapports] = useState([]);

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
    }, []);

    return (
        <div>
            <Table striped bordered hover className="table">
                <thead className="thead">
                    <tr>
                        <th className="thead-th">N°</th>
                        <th className="thead-th">LOG</th>
                        <th className="thead-th">AFFICHER</th>
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
                        </tr>
                    ))}
                </tbody>
            </Table>
            <ToastContainer />
        </div>
    );
}

export default List;