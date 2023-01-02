var express = require('express');
var app = express();
var multer = require('multer')
var cors = require('cors');
const fs = require('fs');

app.use(cors());

// Définition de la destination du fichier
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'logs')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

var upload = multer({ storage: storage }).single('file');

// Upload d'un fichier log dans le fichier logs
app.post('/upload', function (req, res) {

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err)
    } else if (err) {
      return res.status(500).json(err)
    }
    return res.status(200).send(req.file)
  })
});

// Récupérer les noms de fichiers logs disponibles
app.get('/getfiles', function (req, res) {
  var result = [];
  fs.readdir("./logs", (err, files) => {
    files.forEach(file => {
      result.push(file);
    });
    res.send(result);
  });
});

// Récupérer les noms de fichiers logs disponibles
app.get('/detail/:filename', function (req, res) {
  var filename = req.params.filename;
  try {
    res.send(fs.readFileSync("./logs/" + filename, { encoding: 'utf-8' }));
  } catch (error) {
    return res.status(500).json(error);
  }
});

// Supprimer un fichier log
app.delete('/delete/:filename', function (req, res) {
  var name = req.params.filename;
  fs.readdir("./logs", (err, files) => {
    files.forEach(file => {
      if (file == name) {
        fs.unlinkSync("./logs/" + name);
      }
    });
    return res.status(200);
  });
});

// Numéro de port à utiliser
app.listen(8000, function () {
  console.log('App tourne sur le port 8000');
});