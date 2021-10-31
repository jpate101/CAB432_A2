import sys
from textblob import TextBlob
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

def main(argv):
    analysis = TextBlob(argv);
    print(analysis.sentiment.polarity)
    print(analysis.sentiment.subjectivity)
    return [analysis.sentiment.polarity, analysis.sentiment.subjectivity];

if __name__ == "__main__":
    results = main(sys.argv[1]);
    

    