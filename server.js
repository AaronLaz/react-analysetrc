var express = require('express');
var app = express();
var multer = require('multer')
var cors = require('cors');
const fs = require('fs');

app.use(cors());

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'logs')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

var upload = multer({ storage: storage }).single('file');

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
  var result =[];
  fs.readdir("./logs", (err, files) => {
    files.forEach(file => {
      result.push(file);
    });
    res.send(result);
  });
});

// Supprimer un fichier log
app.delete('/delete/:filename', function (req, res) {
  console.log(req.params.filename);
  var name = req.params.filename;
  fs.readdir("./logs", (err, files) => {
    files.forEach(file => {
      console.log(file + " : "+name);
      if(file == name){
        fs.unlinkSync("./logs/"+name);
      }
    });
    return res.status(200);
  });
});

app.listen(8000, function () {

  console.log('App tourne sur le port 8000');

});