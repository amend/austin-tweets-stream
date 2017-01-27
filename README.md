
Please read amend/austin-tweets-map first to see how amend/austin-tweets-stream and amend/austin-tweets-get-sentiment work together.
https://github.com/amend/austin-tweets-map

I used Twitters streaming API to set up a server (app.js) that collects tweets from the Austin area and stores them in a MongoDB collection. In app.js, austinStream.on initiates the streaming.
