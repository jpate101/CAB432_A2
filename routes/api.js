const needle = require('needle');
const key = require("./keys");
const express = require('express');
const router = express.Router();

const endpointUrl = `https://api.twitter.com/2/tweets/search/recent`;

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

async function perform_SA(message) {

    let { spawn } = require('child_process')

    let process2 = spawn('python',['./SA.py', message.toString()]);

    //console.log(process2);

    let out;

    process2.stdout.on('data', (data) => {
        temp = data.toString().split("\n");
        console.log(message);
        console.log(temp[0]);
        console.log(temp[1]);
        console.log("___________");

        // out[0] = message;
        // out[1] = term[0];
        // out[2] = term[1];

    });//.catch(e => console.log(e));
    process2.stderr.on('data', (data) => {
       console.log(data.toString());
       out = data.toString();
    });

    return out;
    
  }

  async function apicall() {

    let result = [];

    let san = [];

    let tweets = [];

    let twitter = await getRequestTwitter(search);

    //console.log(twitter);
  
    twitter.then((value) => {
      console.log("_____------_______ start");

      for (let i = 0; i < value.meta.result_count; i++) {
        //console.log(value.data[i].text);
        let sa = perform_SA(value.data[i].text);
        tweets[i] = value.data[i].text;

        //console.log(value.data[i].text);

        sa.then((value2) => {
          san[i] = value2;
        })
        //console.log(i);
      }

      console.log("_____------_______ end");

    });

    result.push(tweets);
    result.push(san);

    console.log(result[0]);
    console.log("this should be at the end");

    return result;
  }

router.get("/:query", (req, res) => {

    //set the parameter form url as a variable for convienance
    search = req.params.query;
  
    //call the apis
    let calls = apicall();
  
    calls.then((value) => {

      //console.log(value);

      res.render("api", {
        tweets: value[0],
        //sent: sent,
        query: search
      });
    
      res.end();
    }).catch((e) => {
      //if an error happens then render an error page
      //res.end();
    })
    //let testing_tweet_array = ["textBlob sure looks like it has some interresting features","The new design is awful!","I’m not sure if I like the new design"];

    //testing_tweet_array.forEach(perform_SA);

    
    

  });

  module.exports = router;