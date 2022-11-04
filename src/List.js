import React, { useEffect,useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";

function List(){

    const [listFiles, setListFiles] = useState([]);

    const sendGetRequest = async () => {
        try {
            const resp = await axios.get('http://localhost:8000/getfiles');
            setListFiles(resp.data);
            console.log(listFiles);
        } catch (err) {
            // Handle Error Here
            console.error(err);
        }
    };
    

    useEffect(() => {
        sendGetRequest();
    }, []);
    return(
        <div>
            {listFiles[0]}
            {listFiles[1]}
            <ToastContainer />
        </div>
    );
}

export default List;