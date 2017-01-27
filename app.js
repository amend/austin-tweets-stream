
var Twit = require('twit'),
    config = require('./config');

var T = new Twit({
	consumer_key:         config.consumer_key,
	consumer_secret:      config.consumer_secret,
	access_token:         config.access_token,
	access_token_secret:  config.access_token_secret
    });


// ---------- set up db ----------
var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/tweets');
db.on('error', console.error.bind(console, 'mongoose connection error: '));
db.once('open', function () {
	//and... we have a data store

    });

// strict option is true by default, set to false so that values
// do not have to be explicitly defined, trade off is must use .get('key')
var austinTweetSchema = new mongoose.Schema({
	twitter_id: {type: String, unique : true},
	twitter_id_str: {type: String, unique : true}
    }, {
	strict: false
    });
db.model('AustinTweet', austinTweetSchema);
// -------------------------------

// sw point ut 30.277362, -97.752645
// ne point ut 30.300483, -97.716660
// sw then ne and longitude comes first for twitter api
// geo query db for ut tweets
// sw 30.098770, -97.938377
// ne 30.516840, -97.561470
var austin = ['-97.938377', '30.098770', '-97.561470', '30.516840'];

var austinStream = T.stream('statuses/filter', { locations: austin });
austinStream.on('tweet', function(tweet) {
	//console.log('streamed tweet text: ' + tweet.text);
	tweet.twitter_id = tweet.id;
	tweet.twitter_id_str = tweet.id_str;
	delete tweet.id;
	delete tweet.id_str;

// sw 30.167461, -97.650991
// nw 30.351388, -97.675908
// ne 30.371550, -97.757254
// se 30.246454, -97.822433

    if(tweet.geo) {

	var coor = tweet.geo.coordinates;
	if(coor[0] >= 30.246454 && coor[1] >= -97.822433 && coor[0] <= 30.351388 && coor[1] <= -97.675908) {
	    console.log('yes with coor: ' + coor[0] + ' ' + coor[1]);

	    db.models.AustinTweet.create(tweet, function(err, tweet) {
		if(err) { console.log('err: ' + err);}

		//console.log('stream tweet text created: ' + tweet.get('text'));
		//checkTweets();
	    });
	} else {
	    console.log('nope with coor: ' + coor[0] + ' ' + coor[1]);
	}
    }
});

var checkTweets = function() {
    db.models.AustinTweet.find({}, function(err, tweets) {
	    if(err) {
		console.log('err: ' + err);
		return;
	    }
	    console.log('gonna iterate through tweets');
	    tweets.map(function(tweet) {
		    if(tweet.get('text')) {
			console.log('db tweet text: ' + tweet.get('text'));
		    } else {
			console.log('incomplete tweet');
		    }
		});
	    console.log('done iterating through tweets');
	});
}
