import '../index.css';
import React, { useState, useEffect } from "react";
import 'react-toastify/dist/ReactToastify.css';
import Loading from './Loading';

function ErrorReport(props) {

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setTimeout(() => setLoading(true), 1000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        loading ?
            <div>
                <label><b>Erreurs <i>{props.filename}</i></b></label>
            </div>
            :
            <Loading />
    )
}

export default ErrorReport;
