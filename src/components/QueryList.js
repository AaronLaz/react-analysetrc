import '../index.css';
import React, { useState, useEffect } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { Button, Modal, Table, Card, Form } from 'react-bootstrap';
import Loading from './Loading';
import { difference, timeConverter } from './Report';

function QueryList(props) {

    const [loading, setLoading] = useState(false);
    const [listeRequetes, setListeRequetes] = useState(props.occurrencecount.slice().sort((a, b) => a.value - b.value));
    const [show, setShow] = useState(false);
    const [detailRequete, setDetailRequete] = useState([0, 0, 0, 0]);
    const [requete, setRequete] = useState("");
    const [date, setDate] = useState([]);
    const [temps, setTemps] = useState();
    const [option, setOption] = useState('occurrence_asc');

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

    // Implémentation triage classique avec fonction Array.sort (complexité de 0(n^2)) (~50-90ms)
    // const sortUniqueQueries = (requetes, params_desc, long) => {
    //     let liste = requetes.slice();
    //     // Triage requêtes par nombre de paramètres ou longeur
    //     liste.sort((a, b) => {
    //         let numParamsA = 0;
    //         let numParamsB = 0;

    //         // Vérifier si la clause "WHERE" est présent
    //         if (a.key.split("WHERE").length > 1) {
    //             numParamsA = a.key.split("WHERE")[1].split("AND").length;
    //         }
    //         if (b.key.split("WHERE").length > 1) {
    //             numParamsB = b.key.split("WHERE")[1].split("AND").length;
    //         }

    //         // Tri par nombre de paramètres descendant
    //         if (params_desc) {
    //             // Trier en premier par le nb de paramères dans la clause "WHERE"
    //             if (long) { // Trier par nb de paramètres et longueur de la requête
    //                 if (numParamsA !== numParamsB) {
    //                     return numParamsB - numParamsA;
    //                 }
    //                 else {
    //                     // si le nb de params est égale, trier par la longeur de la requête
    //                     return a.key.length - b.key.length;
    //                 }
    //             } else {
    //                 // Tri par nb de paramètres
    //                 return numParamsB - numParamsA;
    //             }

    //         }
    //         // Tri par nombre de paramètres ascendant
    //         else {
    //             // Trier en premier par le nb de paramères dans la clause "WHERE"
    //             if (long) { // Trier par nb de paramètres et longueur de la requête
    //                 if (numParamsA !== numParamsB) {
    //                     return numParamsA - numParamsB;
    //                 }
    //                 else {
    //                     // si le nb de params est égale, trier par la longeur de la requête
    //                     return a.key.length - b.key.length;
    //                 }
    //             } else {
    //                 // Tri par nb de paramètres
    //                 return numParamsA - numParamsB;
    //             }
    //         }
    //     });
    //     return liste;
    // }

    // Implémentation arbre de recherche binaire (BST) pour améliorer la compléxité du triage (O(n log(n))) (~38-40ms)
    class Node {
        // Création d'un noeud de l'arbre
        constructor(key, value, numParams, left = null, right = null) {
            // Assigner les valeurs de base de chaque requête (contenu requete et compte) et aussi numParam: le nombre de paramètres dans la clause WHERE
            this.key = key;
            this.value = value;
            this.numParams = numParams;

            // Initialiser à null les valeurs des sous-arbres gauche et droit
            this.left = left;
            this.right = right;
        }
    }

    class BinarySearchTree {
        // Création d'une nouvelle arbre de recherche
        constructor() {
            // Initialise la racine de l'arbre à null
            this.root = null;
        }

        // Insérer un nouveau noeud dans l'arbre
        insert(key, value, numParams) {
            // Créer un nouveau noeud à partir des valeurs (requête, compte et nb params)
            const newNode = new Node(key, value, numParams);

            // Si l'arbre est vide, on assigne le noeud comme la racine
            if (this.root === null) {
                this.root = newNode;
            } else {
                // Sinon, insérer le noeud à la bonne position dans l'arbre
                this.insertNode(this.root, newNode);
            }
        }

        // Fonction auxiliaire récursive pour mettre un noeud dans la bonne position dans l'arbre
        insertNode(node, newNode) {
            // Si le nombre de paramètres du nouveau noeud est inférieur au noeud courant, on insére le noeud au sous-arbre gauche
            if (newNode.numParams < node.numParams) {
                // Si le sous-arbre gauche de l'arbre courant est null, on insère le noeud
                if (node.left === null) {
                    node.left = newNode;
                } else {
                    // Sinon, appel récursif sur le sous-arbre gauche
                    this.insertNode(node.left, newNode);
                }
            } else {
                // Si le nombre de paramètres du nouveau noeud est supérieur au noeud courant, on insére le noeud au sous-arbre droit
                if (node.right === null) {
                    // Si le sous-arbre droit de l'arbre courant est null, on insère le noeud
                    node.right = newNode;
                } else {
                    // Sinon, appel récursif sur le sous-arbre droit
                    this.insertNode(node.right, newNode);
                }
            }
        }

        // Méthode pour traverser l'arbre dans l'ordre et retourner un tableau trié
        inOrderTraverse() {
            // Initialise un tableau vide pour contenir les valeurs triées
            const sorted = [];

            // Appel de la fonction aux inOrderTraverseNode
            this.inOrderTraverseNode(this.root, sorted);

            // Retourne tableau trié
            return sorted;
        }

        // Fonction aux récursive pour traverser l'arbre de recherche dans l'ordre
        inOrderTraverseNode(node, sorted) {
            // Si le noeud courant n'est pas nul, appeler récursivement inOrderTraverseNode sur le sous-arbre gauche
            if (node !== null) {
                this.inOrderTraverseNode(node.left, sorted);

                // Ajout les valeurs du noeud courant dans le tableau trié
                sorted.push({ key: node.key, value: node.value });

                //Appeler récursivement inOrderTraverseNode sur le sous-arbre droit
                this.inOrderTraverseNode(node.right, sorted);
            }
        }

        // Méthode pour trier les requêtes uniques utilisant l'arbre binaire de recherche
        sortUniqueQueries(requetes, desc, long) {
            // Initialise un nouveau arbre binaire de recherche
            const bst = new BinarySearchTree();

            // Parcourir le tableau de requêtes et insérez chaque requête unique dans l'arbre de recherche
            for (const query of requetes) {
                // Calcul du nombre de paramètres pour chaque requête
                let numParams = 0;
                if (query.key.split("WHERE").length > 1) {
                    numParams = query.key.split("WHERE")[1].split("AND").length;
                }

                // Insérer la requête dans l'arbre de recherche
                bst.insert(query.key, query.value, numParams);
            }

            // Traverser dans l'ordre l'arbre de recherche pour obtenir un tableau de requêtes trié
            let sorted = bst.inOrderTraverse();

            // Triage par longueur
            if (long) {
                sorted.sort((a, b) => {
                    return a.key.length - b.key.length;
                });
            }

            // Triage en ordre descendant
            if (desc) {
                sorted.reverse();
            }

            // Retourne le tableau trié
            return sorted;
        }
    }


    function handleChange(event) {
        setOption(event.target.value);
        let liste = props.occurrencecount;
        let temp;
        let tree = new BinarySearchTree();
        switch (event.target.value) {
            case "occurrence_asc":
                temp = liste.slice().sort((a, b) => a.value - b.value);
                break;
            case "occurrence_desc":
                temp = liste.slice().sort((a, b) => b.value - a.value);
                break;
            case "params_desc":
                temp = tree.sortUniqueQueries(liste, true, false);
                break;
            case "params_asc":
                temp = tree.sortUniqueQueries(liste, false, false);
                break;
            case "long_desc":
                temp = tree.sortUniqueQueries(liste, true, true);
                break;
            case "long_asc":
                temp = tree.sortUniqueQueries(liste, false, true);
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
                    <Form.Label>Options de tri <i>* pointer sur les options dans la sélection pour en savoir plus</i></Form.Label>
                    <Form.Select value={option} onChange={handleChange} className="sort_options">
                        <option value="occurrence_asc" title="Tri par nombre d'occurrences en ordre ascendant">Occurrences asc</option>
                        <option value="occurrence_desc" title="Tri par nombre d'occurrences en ordre descendant">Occurrences desc</option>
                        <option value="params_asc" title="Tri par nombre de paramètres en ordre ascendant">Params asc</option>
                        <option value="params_desc" title="Tri par nombre de paramètres en ordre descendant">Params desc</option>
                        <option value="long_asc" title="Tri par longueur après tri par paramètres en ordre ascendant">Longueur asc</option>
                        <option value="long_desc" title="Tri par longueur après tri par paramètres en ordre descendant">Longueur desc</option>
                    </Form.Select>
                </Form.Group>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>N°</th>
                            <th>Requête</th>
                            <th>Occurrences</th>
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
                            <Card.Body><div className="cardDisplay">{date.length} occurrences en {temps}</div></Card.Body>
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