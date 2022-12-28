import '../index.css';
import React, { useState, useEffect } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { Button, Modal, Table, Card } from 'react-bootstrap';
import Loading from './Loading';

function QueryList(props) {

    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [detailRequete, setDetailRequete] = useState([0, 0, 0, 0]);
    const [requete, setRequete] = useState("");
    const handleClose = () => setShow(false);
    const handleShow = (query) => {
        setRequete(query);
        const requete = props.analyse[query];
        setDetailRequete(requete);
        setShow(true);
    };

    useEffect(() => {
        setLoading(false);
        setTimeout(() => setLoading(true), 1000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        loading ?
            <div>
                <ul>
                    {props.occurencecount.map(item => (
                        <li key={item.key} onClick={() => handleShow(item.key)}>{item.key}:{item.value}</li>
                    ))}
                </ul>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Détails Requête</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Card>
                            <Card.Body><div className="cardDisplay">{requete}</div></Card.Body>
                        </Card>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Min</th>
                                    <th>Max</th>
                                    <th>Moyenne</th>
                                    <th>Cumulé</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{detailRequete[0]}s</td>
                                    <td>{detailRequete[1]}s</td>
                                    <td>{detailRequete[2]}s</td>
                                    <td>{detailRequete[3]}s</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
            :
            <Loading />
    )
};

export default QueryList;