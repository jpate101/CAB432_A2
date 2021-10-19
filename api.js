const needle = require('needle');
const key = require('keys');

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