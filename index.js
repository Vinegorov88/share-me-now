let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/share-me-now', {useNewUrlParser: true});

let express = require('express');
let bodyParser = require('body-parser');
let routes = require('./app/config/routes');
let pageNotFound = require('./app/middlewares/pageNotFound');
let app = express();

app.set('views', './app/views');
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/', routes);

app.use(pageNotFound);

app.listen(8000, () => console.log('Server listening on port 8000...'));

