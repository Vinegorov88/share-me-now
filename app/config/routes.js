let express = require('express');
let router = express.Router();
let multer  = require('multer');
let upload = multer({dest: 'public/upload/', limits: { fileSize: 20000000 }});

let homeController = require('../controllers/homeController');
let fileController = require('../controllers/fileController');

router.get('/', homeController.home);
router.get('/file/show/:filename', fileController.show);
router.get('/file/download/:filename', fileController.download);
router.post('/file/upload', upload.single('myfile'), fileController.upload);
    
module.exports = router;