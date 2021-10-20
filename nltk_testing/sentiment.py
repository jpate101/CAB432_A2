# -*- coding: utf-8 -*-
"""
Created on Mon Oct  4 09:29:36 2021

@author: User
"""

from textblob import TextBlob
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

analysis = TextBlob("textBlob sure looks like it has some interresting features");
print(analysis.sentiment.polarity)
print(analysis.sentiment.subjectivity)