import React from 'react';
import '../index.css';

const NotFound = () => (
    <div className="error">
        <div className="text-center">
            <h1 className="display-1 fw-bold">404</h1>
            <p className="fs-3"> <span className="text-danger">Oups!</span> Page introuvable.</p>
            <p className="lead">
                La page que vous cherchez n'existe pas
            </p>
            <a href="/" className="btn btn-primary">Retour à l'accueil</a>
        </div>
    </div>
);

export default NotFound;