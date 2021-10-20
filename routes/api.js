const needle = require('needle');
const key = require("./keys");
const express = require('express');
const router = express.Router();

const endpointUrl = `https://api.twitter.com/2/spaces/search`;

async function getRequestTwitter(search) {

    //set params for twitter api
    const params = {
        'query': `${search}`, 
        'space.fields': 'title,created_at',
        'expansions': 'creator_id',
        'state': "scheduled"
    }

    //make api call to twitter using needle, the tool twitter recogmends
    const res = await needle('get', endpointUrl, params, {
        headers: {
            "User-Agent": "v2SpacesSearchJS",
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

router.get("/:query", (req, res) => {

    //set the parameter form url as a variable for convienance
    search = req.params.query;
  
    //call the apis
    //TODO

    //temp twitter call
    let twitter = getRequestTwitter(search);

    console.log(twitter);
  
    twitter.then((value) => {
      //pass content to display page
      console.log(value);
      res.end();
    }).catch((e) => {
      //if an error happens then render an error page
      res.end();
    })

    let testing_tweet = "textBlob sure looks like it has some interresting features";
    
    let { spawn } = require('child_process')

    let process2 = spawn('python',['./SA.py', testing_tweet.toString()]);

    console.log('here start');

    process2.stdout.on('data', (data) => {
        //console.log('stdout: ${data}');
        console.log(data.toString());
        temp = data.toString().split("\n");
        console.log(temp[0]);
        console.log(temp[1]);
        console.log("___________");
    });

    process2.stderr.on('data', (data) => {
        //console.log('stderr: ${data}');
        console.log(data.toString());
    });

    console.log('here end');


  });

  module.exports = router;