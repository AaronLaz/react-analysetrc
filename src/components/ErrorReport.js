import '../index.css';
import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import Loading from './Loading';
import { Button, Modal, Table, Card } from 'react-bootstrap';
import { timeConverter } from './Report';

export default class ErrorReport extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            tempsEmpty: false,
            occurrencesEmpty: false,
            tempsDisplay: [],
            occurrenceDisplay: [],
            show: false,
            detailRequete: [0, 0, 0, 0],
            requete: "",
            date: [],
        }
        this.handleTemps = this.handleTemps.bind(this);
        this.handleOccurrences = this.handleOccurrences.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleTemps() {
        if (parseInt(this.props.paramTemps) !== 0) {
            let requetes = this.props.requetes.slice();
            let tempIndex = this.props.tempIndex.slice();
            let dateIndex = this.props.dateIndex.slice();
            let res = [];
            tempIndex.forEach((currentElement) => {
                if (currentElement.value >= this.props.paramTemps) {
                    res.push({ key: requetes[currentElement.key], value: currentElement.value, time: dateIndex.find(obj => obj.key === currentElement.key).value.query_date.toLocaleString() });
                }
            })
            if (res.length === 0) {
                this.setState({ tempsEmpty: true });
            }
            else {
                this.setState({ tempsDisplay: res });
            }
        } else {
            this.setState({ tempsEmpty: true });
        }
    }

    handleOccurrences() {
        if (parseInt(this.props.paramOccurrences) !== 0) {
            let occurrences = this.props.occurrences.slice();
            let res = [];
            occurrences.forEach((currentElement) => {
                if (currentElement.value >= this.props.paramOccurrences) {
                    res.push({ key: currentElement.key, value: currentElement.value });
                }
            })
            if (res.length === 0) {
                this.setState({ occurrencesEmpty: true });
            }
            else {
                this.setState({ occurrenceDisplay: res });
            }
        } else {
            this.setState({ occurrencesEmpty: true });
        }
    }

    // Fermeture modal
    handleClose() { this.setState({ show: false }) };

    // Affichage modal (popup) d??tails de la requ??te
    handleShow(query) {
        // R??cup??ration requ??te ?? afficher
        this.setState({ requete: query });
        const requete = this.props.analyse[query];
        this.setState({ detailRequete: requete });
        // R??cup??ration valeurs date et temps d'ex??cution de la requ??te
        const date_requete = this.props.date[query];
        this.setState({ date: date_requete });
        // Affichage modal
        this.setState({ show: true });
    };

    componentDidMount = () => {
        this.handleTemps();
        this.handleOccurrences();
        setTimeout(() => this.setState({ loading: true }), 1000);
    }

    render() {
        return (
            this.state.loading ?
                <div>
                    <label><b>Rapport d'erreur <i>{this.props.filename}</i></b></label>
                    {this.state.tempsEmpty ?
                        <div className="error">
                            <div className="text-center">
                                Pas d'erreurs d??tect??es avec les param??tres de temps donn??es
                            </div>
                        </div>
                        :
                        <div>
                            <label><b>Requ??tes avec {`>`} de {this.props.paramTemps} secondes de temps d'ex??cution</b></label>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>N??</th>
                                        <th>Requ??te</th>
                                        <th>Temps d'ex??cution</th>
                                        <th>Date d'ex??cution</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.tempsDisplay.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td className="listRequete" onClick={() => this.handleShow(item.key)}>{item.key}</td>
                                            <td className="listRequete" onClick={() => this.handleShow(item.key)}>{item.value} s</td>
                                            <td className="listRequete" onClick={() => this.handleShow(item.key)}>{item.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    }
                    {this.state.occurrencesEmpty ?
                        <div className="error">
                            <div className="text-center">
                                Pas d'erreurs d??tect??es avec les param??tres de nombre d'occurrences donn??es
                            </div>
                        </div>
                        :
                        <div>
                            <label><b>Requ??tes avec {`>`} de {this.props.paramOccurrences} occurrences</b></label>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>N??</th>
                                        <th>Requ??te</th>
                                        <th>Occurrences</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.occurrenceDisplay.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td className="listRequete" onClick={() => this.handleShow(item.key)}>{item.key}</td>
                                            <td className="listRequete" onClick={() => this.handleShow(item.key)}>{item.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    }
                    <Modal size="lg" show={this.state.show} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>D??tails Requ??te</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Card>
                                <Card.Body><div className="cardDisplay">{this.state.requete}</div></Card.Body>
                            </Card>
                            <Card>
                                <Card.Body>
                                    <div className="cardDisplay">Analyse temps d'ex??cution (en s)</div>
                                    <Table striped bordered>
                                        <thead>
                                            <tr>
                                                <th>Min</th>
                                                <th>Max</th>
                                                <th>Moyenne</th>
                                                <th>Cumul??</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{this.state.detailRequete[0]}</td>
                                                <td>{this.state.detailRequete[1]}</td>
                                                <td>{this.state.detailRequete[2]}</td>
                                                <td>{this.state.detailRequete[3]}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                            <Card>
                                <Card.Body><div className="cardDisplay">{this.state.date.length} occurrences en {timeConverter(this.state.detailRequete[3] * 1000.0)}</div></Card.Body>
                            </Card>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
                :
                <Loading />
        );
    }
}
