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
      res.render("api", {
        tweets: twitter.data,
        //sent: sent,
        query: search
      });
      res.end();
    }).catch((e) => {
      //if an error happens then render an error page
      res.end();
    })
  });

  module.exports = router;