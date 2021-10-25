const needle = require('needle');
const key = require("./keys");
const express = require('express');
const router = express.Router();

const endpointUrl = `https://api.twitter.com/2/tweets/search/recent`;

var current_polarity_total = 0;
var counted_tweets = 0;

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

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

    //console.log("called api");
    //console.log(res.body);

    //return
    if (res.body) {
        return res.body;
    } else {
        throw new Error('Unsuccessful request');
    }
}

async function pythonread(text){

  let out;

  let { spawn } = require('child_process')

    let process2 = spawn('python',['./SA.py', text]);

    process2.stdout.on('data', (data) => {
        temp = data.toString().split("\n");
        //console.log(text);
        console.log(temp[0]);
        console.log(temp[1]);
        console.log("___________");

        if (parseFloat(temp[1]) > .6) {
          current_polarity_total = current_polarity_total + parseFloat(temp[0]);
          counted_tweets = counted_tweets +1;
        }

        //parseInt("10")
        //console.log(temp);
        out = temp;
        //return out;
        if(out !== undefined){
          return out;
        }
    });
  
    // while(1){
    //   console.log("test point");
    //   console.log(out);
      if(out !== undefined){
        return out;
      }
    // }
}

async function perform_SA(message) {

  let out = [];

  for (let i = 0; i < message.meta.result_count; i++){

    await pythonread(message.data[i].text).then((value) =>{
      //console.log(value)
      out.push(value);
    });
    
  //   process2.stderr.on('data', (data) => {
  //      console.log(data.toString());
  //   });

    if(i + 1 === message.meta.result_count){
      //console.log("this is a fart joke");
      //console.log(out);
      return out;
    }
  }

  //console.log(out);

  //console.log("why");
  //return out;
  
}

  async function apicall() {

    let result = [];

    let san = [];

    let tweets = [];

    let storage;

    //const twitter = await getRequestTwitter(search);

    //console.log(twitter);
  
    await getRequestTwitter(search).then((value) => {
      //console.log("_____------_______ start");

      storage = value;

      for (let i = 0; i < value.meta.result_count; i++ ){
        tweets.push(value.data[i].text);
      }

      //console.log("_____------_______ end");
    });
    

    //console.log(storage);

    sa = await perform_SA(storage).then((value2) => {
    });
    result.push(tweets);

    console.log("this should be at the end");

    return result;
  }
//while(true){
  router.get("/:query", (req, res) => {

    //set the parameter form url as a variable for convienance
    search = req.params.query;
  
    //call the apis
    apicall().then((value) => {

      //console.log(value)

      console.log("___________recall__test ____________")

      let polarity = "";

      if(current_polarity_total > .5){
        polarity = "Positive";

      }else if (current_polarity_total > .5) {
        polarity = "Neutral";
      } else {
        polarity = "Negitive";
      }

      res.render("api", {
        tweets: value[0],
        sentiment: polarity,//doesnt work 
        query: search
      });
      res.end();

    }).catch((e) => {
      //if an error happens then render an error page
      //res.end();
    })

  });

module.exports = router;



//sleep(10000);
//console.log("update check");
//console.log(current_polarity_total);
//console.log(counted_tweets);
//sleep(10000);
//} 
