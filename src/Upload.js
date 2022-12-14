import './Upload.css';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Progress } from 'reactstrap';
import Loading from './Loading';
import { useHistory } from 'react-router-dom';

function Upload() {

  const [selectedFile, setSelectedFile] = useState();
  const [loaded, setLoaded] = useState(0);
  const [loading, setLoading] = useState(false);
  let history = useHistory();

  useEffect(() => {
    setTimeout(() => setLoading(true), 1000);
  }, []);

  function homepage() {
    history.push('/');
  }

  function onChangeHandler(event) {
    if (checkType(event) && checkFileSize(event)) {
      setSelectedFile(event.target.files[0]);
    }
    setSelectedFile(event.target.files[0]);
  }

  function onClickHandler() {
    if (selectedFile != null) {
      const data = new FormData();
      data.append('file', selectedFile);
      axios.post("http://localhost:8000/upload", data, {
        onUploadProgress: ProgressEvent => {
          setLoaded(ProgressEvent.loaded / ProgressEvent.total * 100)
        },
      })
        .then(res => { // affichage résultat
          toast.success('succès');
          setTimeout(() => { window.location.reload(false); }, 3000);
        }).catch((err) => toast.error('échec de l\'upload'));
    } else {
      toast.error("Veuillez sélectionner un fichier");
    }

  }

  function checkType(event) {
    //message d'erreur
    let err = '';
    // list des extensions attendues
    const extensions = ['trc'];
    var re = /(?:\.([^.]+))?$/;
    if (!extensions.includes(re.exec(event.target.value)[1])) {
      // créer message d'erreur  
      err = re.exec(event.target.value)[1] + ' n\'est pas supporté (trc attendu)\n';
    }
    if (err !== '') { // si message d'erreur non vide, afficher l'erreur
      event.target.value = null; // réinitialiser la sélection de fichiers
      toast.error(err);
      return false;
    }
    return true;
  }

  function checkFileSize(event) {
    let size = 20000000 // 20 mb
    let err = "";
    if (event.target.files[0].size > size) {
      err += event.target.value + 'est trop volumineux, veuillez choisir un fichier plus petit (<20mb)\n';
    }
    if (err !== '') {
      event.target.value = null;
      toast.error(err);
      return false;
    }

    return true;

  }

  return (
    loading ?
      <div className="container">
        <div className="row">
          <div className="offset-md-3 col-md-6">
            <div className="form-group files">
              <label>Upload fichier log</label>
              <input type="file" name="file" onChange={(event) => onChangeHandler(event)} />
            </div>
            <div className="form-group">
              <Progress max="100" color="success" value={loaded}>{Math.round(loaded, 2)}%</Progress>
            </div>
            <button type="button" className="btn btn-success btn-block" onClick={(event) => onClickHandler()}>Upload</button>
            <ToastContainer />
          </div>
        </div>
      </div>
      :
      <Loading />
  );
}

export default Upload;
