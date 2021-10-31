# -*- coding: utf-8 -*-
"""
Created on Mon Oct  4 06:51:09 2021

@author: User
"""

from tweepy import Stream
from tweepy import OAuthHandler
from tweepy.streaming import StreamListener
#from tweepy import *
#import tweepy
import json
from textblob import TextBlob

#consumer key, consumer secret, access token, access secret.
ckey="AyD3kuGlHXuYrWIpvN85VbNZW"
csecret="uC619hW0NOQhNhT6vNlgsVSaum4yKlf3FNyt1B7HCmOB6argpp"
atoken="1443569656753635331-WucxvOYiSPnEA7lZr1XiuyOGocHTGH"
asecret="ZqrJ0V5y7VffW9sSnUVgvmNXHQgfokTgCoQ0xxaDmJSHS"

p = 0;
n = 0;

class listener(StreamListener):


    def on_data(self, data):
        all_data = json.loads(data)

        tweet = all_data["text"]
        
        analysis = TextBlob(tweet);
        
        print(tweet,'\n',analysis.sentiment.polarity,'\n',analysis.sentiment.subjectivity,'\n_______________________________');
        if(analysis.sentiment.subjectivity*100 >= 80):
            if(analysis.sentiment.polarity < 0):
                output = open("twetter-out_N.txt","a");
                output.write(str(analysis.sentiment.polarity));
                output.write('\n');
                output.write(tweet);
                output.write('\n--------------------------------\n');
                output.close();
            if(analysis.sentiment.polarity > 0):
                output = open("twetter-out_N.txt","a");
                output.write(str(analysis.sentiment.polarity));
                output.write('\n');
                output.write(str(analysis.sentiment.polarity));
                output.write('\n');
                output.write(tweet);
                output.write('\n--------------------------------\n');
                output.close();

            
            

        return True

    def on_error(self, status):
        print(status);


auth = OAuthHandler(ckey, csecret)
auth.set_access_token(atoken, asecret)

twitterStream = Stream(auth, listener())
twitterStream.filter(track=["Covid","Lockdown"])