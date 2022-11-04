import React, { useEffect,useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";

function List(){

    const [listFiles, setListFiles] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/getfiles').then(resp => {
            console.log("test"+resp);
            setListFiles(resp.data);
    });
    }, []);
    return(
        <div>
            {listFiles[0]}
            <ToastContainer />
        </div>
    );
}

export default List;