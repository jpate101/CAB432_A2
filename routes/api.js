const needle = require('needle');
const key = require("./keys");
const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');

const endpointUrl = `https://api.twitter.com/2/tweets/search/recent`;

require('dotenv').config(); 

const bucketName = 'semple-paterson-store';

// Create a promise on S3 service object 
const bucketPromise = new AWS.S3({apiVersion: '2006-03-01'}).createBucket({Bucket: bucketName}).promise(); 
bucketPromise.then(function(data) { 
    console.log("Successfully created " + bucketName); 
})
.catch(function(err) {
    console.error(err, err.stack);
});


async function getRequestTwitter(search) {

    //set params for twitter api
    const params = {
        'query': `${search}`, 
        'tweet.fields': 'author_id'
    }

    //make api call to twitter using needle, the tool twitter recogmends
    const res = await needle('get', endpointUrl, params, {
        headers: {
            "User-Agent": "v2RecentSearchJS",
            "authorization": `Bearer ${key}`
        }
    })

    //return
    if (res.body) {
        return res.body;
    } else {
        throw new Error('Unsuccessful request');
    }
}

async function pythonread(text){

  let out = [];

  let { spawn } = require('child_process')

    let process2 = spawn('python',['./SA.py', text]);

    console.log("pont2");

    for await(const chunk of process2.stdout) {
      console.log(chunk);
      out.push(chunk.toString().split("\n"));
    }

      if(out !== undefined){
        return out;
      }
}

async function perform_SA(message) {


  let out = [];

  for (let i = 0; i < message.meta.result_count; i++){

    console.log("pont1");

    await pythonread(message.data[i].text).then((value) =>{
      out.push(value);
    });
    if(i + 1 === message.meta.result_count){
      return out;
    }
  }
}

  async function apicall() {

    let result = [];

    let san = [];

    let tweets = [];

    let storage;
  
    await getRequestTwitter(search).then((value) => {
      console.log("_____------_______ start");

      storage = value;

      for (let i = 0; i < value.meta.result_count; i++ ){
        tweets.push(value.data[i].text);
      }

      console.log("_____------_______ end");
    });
    

    console.log(storage);

    sa = await perform_SA(storage).then((value2) => {
      san = value2;
    });
    result.push(tweets);
    result.push(san);

    console.log("this should be at the end");

    return result;
  }

  router.get("/:query", (req, res) => {

    //set the parameter form url as a variable for convienance
    search = req.params.query;

    const d = new Date();

      const s3Key = `twitter-${search}`; 

      const paramss3 = {Bucket: bucketName, Key: s3Key};

      new AWS.S3({apiVersion: '2006-03-01'}).getObject(paramss3, (err, result) => {
        console.log(result);
        console.log(err);

        let resultJSON;

        let blank = false;

        if (result){
          resultJSON = JSON.parse(result.Body);

          if (resultJSON.time + 60000 > d.getTime()) {

            res.render("api", {
              tweets: resultJSON.tweets,
              sentiment: resultJSON.polarity,//doesnt work 
              query: resultJSON.search
            });
            res.end();
          }
          else {
            blank = true;
          }
        }
        else{
          blank = true;
        }

        if (blank === true) {

          //call the apis
          apicall().then((value) => {

          let body = {};

          console.log("___________recall__test ____________")

          let current_polarity_total = 0;

          for (let i = 0; i < value[1].length; i++) {
            console.log(parseFloat(value[1][i][0][1]));

            // if(parseFloat((value[1][i][0][1]) > 0.1 && !(parseFloat(value[1][i][0][1]) < 0 )) || (parseFloat(value[1][i][0][1]) < -0.1 && !(parseFloat(value[1][i][0][1]) > 0))){
            if(parseFloat(value[1][i][0][1]) > 0.1 ){

            current_polarity_total += parseFloat(value[1][i][0][0]);

              console.log("value")
              console.log(parseFloat(value[1][i][0][0]));
            }
          }

          console.log(current_polarity_total);

          let polarity = "";

          if(current_polarity_total > 0.25){
            polarity = "Positive";

          }else if (current_polarity_total < -0.25 ) {
            polarity = "Negitive";
          } else {
            polarity = "Neutral";
          }

          body["tweets"] = value[0];
          body["polarity"] = polarity;
          body["search"] = search;
          body["time"] = d.getTime();

          body = JSON.stringify(body);

          console.log(body);

          const upparams = {Bucket: bucketName, Key: s3Key, Body: body};

          const upload = new AWS.S3({apiVersion: '2006-03-01'}).putObject(upparams).promise();

          upload.then(function(data) {
            console.log(data);
          });

          res.render("api", {
            tweets: value[0],
            sentiment: polarity,//doesnt work 
            query: search
          });
          res.end();

        // ).catch((e) => {
        //   //if an error happens then render an error page
        //   res.render("error");
        //   res.end();
        // })
    

    });
  }

  });
});

module.exports = router;
