var express =  require('express');
var router = express.Router();
var axios = require('axios');
const split = require('split-string');

router.post("/", (req, res) => {
    var urlGitHub = req.body.githuburl;
    var date24Hrs = new Date(Date.now() - 86400 * 1000).toISOString();
    var date1to7Days = new Date(Date.now() - 7 * 86400 * 1000).toISOString()
    var urlGitHUbChunk = urlGitHub.split('/');
    var urlApiTotal = 'https://api.github.com/repos/' + urlGitHUbChunk[3] + '/' + urlGitHUbChunk[4];
    var urlApiLast24Hrs = 'https://api.github.com/repos/' + urlGitHUbChunk[3] + '/' + urlGitHUbChunk[4] + '/issues?since=' + date24Hrs;
    var urlApi1To7Days = 'https://api.github.com/repos/' + urlGitHUbChunk[3] + '/' + urlGitHUbChunk[4] + '/issues?since=' + date1to7Days;

    function getTotalOpenIssuesCount(){
        return axios.get(urlApiTotal);
    }

    function getLast24HrsOpenIssuesCount(){
        return axios.get(urlApiLast24Hrs);
    }

    function get1To7DaysOpenIssuesCount(){
        return axios.get(urlApi1To7Days);
    }

    axios.all([getTotalOpenIssuesCount(), getLast24HrsOpenIssuesCount(), get1To7DaysOpenIssuesCount()])
    .then(axios.spread(function(totalCountResponse, Last24HrsResponse, OneTo7DaysResponse){
        var OneToSevenDaysResponse = (OneTo7DaysResponse.data.length - Last24HrsResponse.data.length);
        var MoreThan7DaysResponse = (totalCountResponse.data.open_issues_count - OneTo7DaysResponse.data.length);
        res.render('./index', {totalCount:totalCountResponse.data.open_issues_count, count24Hrs:Last24HrsResponse.data.length, count1to7Days: OneToSevenDaysResponse, countMoreThan7Days: MoreThan7DaysResponse });
    }) 
    ) .catch(function(error){
        console.error(error);
    });
});

module.exports = router;