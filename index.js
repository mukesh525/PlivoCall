let plivo = require('plivo');
let client = new plivo.Client('MAZTQ5OTC3NDE0ZTQYNW', 'YzVhNjMxOTk5ZjFlYTAyYTQzYWFmMGZjNGFhYzZj');

var http = require('http');
var url = require('url') ;
var request = require('request');
const axios = require('axios');
 
   
//npm install request@2.81.0

var schedule = require('node-schedule');

const scheduleFetch = () => { 
    const job = schedule.scheduleJob(' */5 * * * *', function(){
      console.log("starting job")
      axios.get('http://topridez.com/cms/web_service/auto_assign_booking')
            .then(response => {
             console.log(response.data.msg);
             // console.log(response.data.explanation);
            })
            .catch(error => {
            console.log(error);
            });
  });
   return job;
  }


const express = require('express'); 
const app = express();

app.listen(3000, () => 
    console.log('Server listening on port 3000!') 
);





scheduleFetch();



app.get('/call', function(req, res) { //A

var to = req.query.to || req.body.to;
var from = req.query.from || req.body.from;
var name = req.query.name || req.body.name;
    
var hostname = req.headers.host; // hostname = 'localhost:8080'
var pathname = '/speak_api/?name='+name // pathname = '/MyApp'
// res.send('http://' + hostname + pathname);
client.calls.create(
        '+918961422158',
         to,
        'http://' + hostname + pathname,
         {
                answerMethod: "GET",
            },
      ).then(function(call_created) {
        console.log(call_created)
      });
     
 });

 

 app.get('/msg', function(req, res) { //A
    client.messages.create(
        '+918961422158',
        '+919886282641',
        'Hello, world!'
      ).then(function(message_created) {
        console.log(message_created)
      });
 });



  app.get('/speak_api/', function(req, res){

        var hostname = req.headers.host; // hostname = 'localhost:8080'
        var getdigits_action_url = 'http://' + hostname +'/speak_action/';
        var name = req.query.name || req.body.name;
    
        var response = plivo.Response();
        
        var params = {
            'action':getdigits_action_url,
            'method': "GET",
            'timeout':'5',
            'numDigits': '1',
            'retries': '2',
            'redirect': 'true'
        };
        var get_digits = response.addGetDigits(params);
        
        var input_received_speak = "Hi"+ name +" Someone has came to meet you . Press 1 to accept or press 2 to reject.";
        get_digits.addSpeak(input_received_speak);

        var wait_params = {
            'length': "10"
        };
        response.addWait(wait_params);
    
        
        var input_not_received_speak = "Input not received. Thank you";
        response.addSpeak(input_not_received_speak);
      
        
        console.log(response.toXML());
        res.set({'Content-Type': 'text/xml'});
        res.send(response.toXML());
    
    });




app.get('/speak_action/', function(req, res){


     var p  = plivo.Response();
     var hostname = req.headers.host; // hostname = 'localhost:8080'
     var getdigits_action_url = 'http://' + hostname +'/speak_action/';
 
    var digit = req.query.Digits || req.body.Digits;
    var call_uuid = req.query.CallUUID || req.body.CallUUID;

    console.log("Digit pressed: ", digit);
    console.log("Call UUID: ", call_uuid);

    if (digit === "1") {
           p.addSpeak("Request has been accepted. Thank You.");



     }
    else if (digit === "2") {
       
           p.addSpeak("Request has been Rejected. Thank You.");

           
     }
     
         else 
        {
            var params = {
                'action':getdigits_action_url,
                'method': "GET",
                'timeout':'7',
                'numDigits': '1',
                'retries': '2',
                'redirect': 'true'
            };
            var get_digits = p.addGetDigits(params);
            var input_received_speak = "Press 1 to accept or press 2 to reject";
            get_digits.addSpeak(input_received_speak);
    
         //  p.addSpeak("Thanks for your call");
       }

    console.log(p.toXML());
    res.set({'Content-Type': 'text/xml'});
    res.send(p.toXML());

    return res;
});