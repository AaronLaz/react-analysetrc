import '../index.css';
import React, { useState, useEffect } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { Button, Modal, Table, Card, Form } from 'react-bootstrap';
import Loading from './Loading';
import { difference, timeConverter } from './Report';

function QueryList(props) {

    const [loading, setLoading] = useState(false);
    const [listeRequetes, setListeRequetes] = useState(props.occurencecount);
    const [show, setShow] = useState(false);
    const [detailRequete, setDetailRequete] = useState([0, 0, 0, 0]);
    const [requete, setRequete] = useState("");
    const [date, setDate] = useState([]);
    const [temps, setTemps] = useState();
    const [option, setOption] = useState('occurence_desc');

    // Fermeture modal
    const handleClose = () => setShow(false);

    // Affichage modal (popup) détails de la requête
    const handleShow = (query) => {
        // Récupération requête à afficher
        setRequete(query);
        const requete = props.analyse[query];
        setDetailRequete(requete);
        // Récupération valeurs date et temps d'exécution de la requête
        const date_requete = props.date[query];
        setDate(date_requete);
        setTemps(timeConverter(difference(date_requete[0], date_requete[date_requete.length - 1])));
        // Affichage modal
        setShow(true);
    };

    // TODO: FIX
    const sortUniqueQueries = (requetes, desc) => {
        let liste = requetes;
        let temp;
        // Triage requêtes par nombre de paramètres ou longeur
        liste.sort((a, b) => {
            let numParamsA = 0;
            let numParamsB = 0;

            // Vérifier si la clause "WHERE" est présent
            if (a.key.split("WHERE").length > 1) {
                numParamsA = a.key.split("WHERE")[1].split("AND").length;
            }
            if (b.key.split("WHERE").length > 1) {
                numParamsB = b.key.split("WHERE")[1].split("AND").length;
            }

            if (desc) {
                // Trier en premier par le nb de paramères dans la clause "WHERE"
                if (numParamsA !== numParamsB) {
                    temp = numParamsA - numParamsB;
                }
                else {
                    // si le nb de params est égale, trier par la longeur de la requête
                    temp = a.key.length - b.key.length;
                }
            } else {
                // Trier en premier par le nb de paramères dans la clause "WHERE"
                if (numParamsA !== numParamsB) {
                    temp = numParamsB - numParamsA;
                }
                else {
                    // si le nb de params est égale, trier par la longeur de la requête
                    temp = a.key.length - b.key.length;
                }
            }
            return temp;
        });
        return temp;
    }


    function handleChange(event) {
        setOption(event.target.value);
        let liste = props.occurencecount;
        let temp;
        switch (event.target.value) {
            case "occurence_asc":
                temp = liste.slice().sort((a, b) => a.value - b.value);
                break;
            case "occurence_desc":
                temp = liste;
                break;
            case "params_desc":
                temp = sortUniqueQueries(liste, true);
                break;
            case "params_asc":
                temp = sortUniqueQueries(liste, false);
                break;
            default:
                console.log('default');
        }
        setListeRequetes(temp);
        setLoading(false);
        setTimeout(() => setLoading(true), 1000);
    }

    useEffect(() => {
        setLoading(false);
        setTimeout(() => setLoading(true), 1000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        loading ?
            <div>
                <h3>Liste des requêtes</h3>
                <Form.Group className="mb-3">
                    <Form.Label>Tri de la liste</Form.Label>
                    <Form.Select value={option} onChange={handleChange}>
                        <option value="occurence_desc">Occurences desc</option>
                        <option value="occurence_asc">Occurences asc</option>
                        <option value="params_desc">Params desc</option>
                        <option value="params_asc">Params asc</option>
                    </Form.Select>
                </Form.Group>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>N°</th>
                            <th>Requête</th>
                            <th>Occurences</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listeRequetes.map((item, index) => (
                            <tr key={item.key}>
                                <td>{index + 1}</td>
                                <td className="listRequete" onClick={() => handleShow(item.key)}>{item.key}</td>
                                <td className="listRequete" onClick={() => handleShow(item.key)}>{item.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Modal size="lg" show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Détails Requête</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Card>
                            <Card.Body><div className="cardDisplay">{requete}</div></Card.Body>
                        </Card>
                        <Card>
                            <Card.Body>
                                <div className="cardDisplay">Analyse temps d'exécution (en s)</div>
                                <Table striped bordered>
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
                                            <td>{detailRequete[0]}</td>
                                            <td>{detailRequete[1]}</td>
                                            <td>{detailRequete[2]}</td>
                                            <td>{detailRequete[3]}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>

                        <Card>
                            <Card.Body><div className="cardDisplay">{date.length} occurences en {temps}</div></Card.Body>
                        </Card>
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