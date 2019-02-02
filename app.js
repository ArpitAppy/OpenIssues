var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('Public'));

app.set('view engine', 'ejs');
app.get('/', function (req, res){
    res.render('index', {
        totalCount: 0,
        count24Hrs: 0,
        count1to7Days: 0, 
        countMoreThan7Days: 0
    } );
});

var index = require('./Routes/index');
app.use('/', index);

app.listen(port, function() {
    console.log('Hello Radius Agent');
    
});