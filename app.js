var express = require('express');
var app = express();
const path = require('path');
var port = process.env.PORT || 8080;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// define Public folder to use CSS and JS files
app.use(express.static('Public'));

// EJS engine and index file variables
app.set('views', path.join(__dirname, 'views'))
// app.set('view engine', 'ejs')
app.get('/', function (req, res){
    res.render('index.ejs', {
        totalCount: 0,
        count24Hrs: 0,
        count1to7Days: 0, 
        countMoreThan7Days: 0
    } )
});

// Route index file
var index = require('./Routes/index');
app.use('/', index);

// set the port function
app.listen(port, function() {
    
});