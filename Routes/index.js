var express =  require('express');
var router = express.Router();
var axios = require('axios');
const split = require('split-string');

// post api to call the github repository open issues
router.post("/", (req, res) => {
    // define variable to get the input field value
    var urlGitHub = req.body.githuburl;
    // Get 24 hrs ago date time in ISO format
    var date24Hrs = new Date(Date.now() - 86400 * 1000).toISOString();
    //Get 7 Days ago date time in ISO format
    var date1to7Days = new Date(Date.now() - 7 * 86400 * 1000).toISOString()
    // split the git hub repository link to get the username and repository name usine split method
    var urlGitHUbChunk = urlGitHub.split('/');
    // define the api link for different time range to calculate open issues
    var urlApiTotal = 'https://api.github.com/repos/' + urlGitHUbChunk[3] + '/' + urlGitHUbChunk[4];
    var urlApiLast24Hrs = 'https://api.github.com/repos/' + urlGitHUbChunk[3] + '/' + urlGitHUbChunk[4] + '/issues?since=' + date24Hrs;
    var urlApi1To7Days = 'https://api.github.com/repos/' + urlGitHUbChunk[3] + '/' + urlGitHUbChunk[4] + '/issues?since=' + date1to7Days;

    // define function to get total open issues count
    function getTotalOpenIssuesCount(){
        return axios.get(urlApiTotal);
    }

    //define function to get open issues within 24 hrs
    function getLast24HrsOpenIssuesCount(){
        return axios.get(urlApiLast24Hrs);
    }

    //define function to get open issues more then 24 hrs ago but less than 7 days ago
    function get1To7DaysOpenIssuesCount(){
        return axios.get(urlApi1To7Days);
    }

    //call api using axios library and upate the open issues count on frontend
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