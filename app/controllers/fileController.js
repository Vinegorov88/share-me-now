let error404 = require('../services/error404');
let config = require('../config/config');
let File = require('../models/File');
let moment = require('moment');
let fs = require('fs');

  
module.exports.upload = function(req, res){

    //We take the information of the uploaded file
    let file = req.file;

    //We are making a new record in the database with the file data
    let newItem = new File({
        originalName: file.originalname,
        fileName: file.filename,
        size: file.size,
        date: moment().format("YYYY-MM-DD hh:mm:ss"),
        downloads: 0
    });

    //We record
    newItem.save();

    //We create a url to download the file
    let url = config.app_url + '/file/show/' + file.filename;
    
    //We send the URL that leads to the download page
    res.json(url);
}



//A feature that will run every day will check and remove files uploaded 30 days ago
function removeOldFiles(){

    //We point out the date is thirty days back
    let olderThan = moment().subtract(30, "days").format("YYYY-MM-DD");

    //We retrieve files from the database that were uploaded thirty days ago
    File.find({ date: { $lte: olderThan } }, function(err, files){
        
        //We are checking for error
        if(err) return;

        //We delete files from the hardware and from the base
        for(let file of files){   

            //We delete the file from the hardware
            fs.unlinkSync(config.root_path + file['fileName']);

            //We delete the database file information
            file.remove();
        }
    });
}
// setInterval(removeOldFiles, 1000);



module.exports.show = function(req, res){

    //We define
    let types, size, i, filePath;

    //We get the fileName of the file
    let fileName = req.params.filename;

    //We look at the main file that contains a fileName like this one
    File.findOne({ fileName: fileName }, function(err, file) {

        try {
            //We take the original file name
            let originalName = file.originalName;

            //We add file abbreviations to an array
            types = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

            //We check whether file size is equal to zero
            if (file.size == 0) return 'n/a';
          
            //We parse file size
            i = parseInt(Math.floor(Math.log(file.size) / Math.log(1024)));

            //If i is equal to zero return file size
            if (i == 0) return file.size + types[i];

            //We get the corresponding key from the array and add it after file size
            size = (file.size / Math.pow(1024, i)).toFixed(1) + types[i];
            
            //Point the path to the file
            filePath = config.root_path + fileName;
               
            //We check the file if it exists, if there is a render and provide the necessary information about it
            if (fs.existsSync(filePath)) res.render('file/show', { fileName: fileName, originalName: originalName, size: size });

            else {

                //if the file is deleted from the hard drive, we also delete it from the database
                file.remove();

                //Forward the user to page 404
                return error404(req, res);
            }
        } catch(err) {
            res.status(500).send('500 Internal Server Error');
        }
    });
}



module.exports.download = function(req, res){

    //We check in the database if there is a file with this name
    File.findOne({fileName: req.params.filename}, function(err, file){

        //Specify the exact path to the file itself
        let filePath = config.root_path + req.params.filename;

        try {
            //If there is an error or no such file exists that contains the specified key, we forward the user to page 404
            if(!file) return error404(req, res);

            //We increase the number of file downloads with one
            file.downloads++;

            //We record
            file.save();

            //Download the file
            res.download(filePath);

        } catch(err) {
            //If err, response status and send message
            res.status(500).send('500 Internal Server Error');
        }   
    });
}
