import React from 'react';
import '../index.css';

const ServerError = () => (
    <div className="error">
        <div className="text-center">
            <h1 className="display-1 fw-bold">500</h1>
            <p className="fs-3"> <span className="text-danger">Oups!</span> Internal server error</p>
            <p className="lead">
                Le serveur a rencontré une situation inattendue.
            </p>
            <a href="/" className="btn btn-primary">Retour à l'accueil</a>
        </div>
    </div>
);

export default ServerError;