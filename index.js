const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
var bcrypt = require('bcryptjs');
var config = require('./config');
const path = require('path');
const port = process.env.PORT || 80;
var striptags = require('striptags');
var jwt = require('jsonwebtoken');
var cors = require('cors')

var async = require('async');
var mongoDB = 'mongodb://localhost:27017/pods';
mongoose.connect(mongoDB);
var db = mongoose.connection;

var User = require("./models/User");
var Episode = require("./models/Episodes");
var Podcast = require("./models/Podcast");
var NGrams = require("./utility/NGrams");
var RecommendationEngine = require("./utility/RecommendationEngine");



db.on('connected',function(){
  console.log('Mongoose connected to 27017');
});

db.on('error', function(err) {
  console.log('Mongoose connection error: ' + err);
});

db.on('disconnected', function() {
  console.log('Mongoose disconnected');
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors());



app.post('/main/signup', function(req, res) {
  var _email = req.body.email;
  var _password = req.body.password;
  var _username = req.body.username;

  console.log(_email);
  console.log(_password);
  console.log(_username);

  

  if (_email && _password && _username) {
      var hashedPassword = bcrypt.hashSync(_password, 8);
      var userData = {
              email: _email,
              password: hashedPassword,
              join_date: new Date(),
              username : _username,
              listened_podcasts : [],
              isPodcaster : false,
              uploaded_podcasts : [],
              playlists : [],
              app_token : "",
              subscribed_podcasts : [],
              preferred_categories : []
          }
          //use schema.create to insert data into the db
      User.create(userData, function(err, user) {
          if (err) {
              console.log(err);
              return res.json({ error: true, message: err })
          } else {
              var token = jwt.sign({ username: user.username }, config.secret, {
              expiresIn: 86400 // expires in 24 hours
              });
              res.status(200).json({status : "OK", user : user, token :token})
          }
      });
  } else {
      return res.json({ error: true, message: "Missing fields" });
  }
});


app.post('/main/login', function(req, res) {
  var _username = req.body.username;
  var _password = req.body.password;

  if (_username && _password) {

      User.findOne({ username: _username }, function(err, user) {
          if (err) return res.status(500).json({ error: true, message: 'Error on the server.' });
          if (!user) return res.json({ error: true, message: 'Wrong password/username' });

          var passwordIsValid = bcrypt.compareSync(_password, user.password);
          if (!passwordIsValid) return res.json({ error: true, token: null, message : "Wrong password/username" });
          var token = jwt.sign({ username: user.username }, config.secret, {
              expiresIn: 86400 // expires in 24 hours
          });
          user.password = null;
          res.cookie('jwt', token);
          res.status(200).json({ status: 'OK', token: token , user : user });
      });
  }
  else{
    res.json({error:true, message:"Missing Fields"})
  }
});


app.all('/api/*', function(req, res, next) {

  var token = req.query.token;
  if (!token) return res.json({error:true, message:"token-required"});

  jwt.verify(token, config.secret, function(err, decoded) {
      if (err) return res.json({error:true, message:"Permission Denied"});

      User.findOne({username : decoded.username}, function(err, user) {
          if (err || !user) return res.status(500).send({ error: true, message: 'Invalid jwt token' });
          req.auth_user = decoded;
          req.auth_user.details = user;
          req.auth_user.username = decoded.username;
          return next();
      })   

  });
})

app.get('/api/testToken', function(req, res) {

  res.json({status : "OK" , message : "token is valid"}) 
})


app.get('/api/latesteps',function(req,res){
  Episode.find({})
  .limit(10)
  .sort({ pub_date: -1 })
  .populate('podcast',['uuid','image','title','description','author'])
  .exec(function(err, episodes) {
      if (err) {
          console.log(err);
          res.json({ error: true, message: err })
      } else {
          res.status(200).json({ error: false, status: 'OK', count:episodes.length, episodes: episodes })
      }
  })

});

//get episodes detail from uuid
app.get('/api/episodes',function(req,res){
  _uuid = req.query.uuid;
  if(_uuid){
    Episode.findOne({uuid : _uuid})
    .limit(10)
    .sort({ pub_date: -1 })
    .populate('podcast',['uuid','title','description','image','author'])
    .exec(function(err, episode) {
        if (err) {
            console.log(err);
            res.json({ error: true, message: err })
        } else {
            res.status(200).json({ error: false, status: 'OK', episode: episode })
        }
    })
  }

});

//get episodes from podcast
app.get('/api/podcast/episode',function(req,res){
  _uuid = req.query.podcast_uuid;
  if(_uuid){
    Episode.find({podcast_uuid : _uuid})
    .sort({ pub_date: -1 })
    .exec(function(err, episodes) {
        if (err) {
            console.log(err);
            res.json({ error: true, message: err })
        } else {
            res.status(200).json({ error: false,count:episodes.length, status: 'OK', episodes: episodes })
        }
    })
  }

});

//get podcast from uuid
app.get('/api/podcasts',function(req,res){
  _uuid = req.query.uuid;
  if(_uuid){
    Podcast.findOne({uuid : _uuid})
    .sort({ pub_date: -1 })
    .exec(function(err, podcast) {
        if (err) {
            console.log(err);
            res.json({ error: true, message: err })
        } else {
            Episode.find({podcast_uuid : podcast.uuid})
            .sort({ pub_date: -1 })
            .exec(function(err, episodes) {
                if (err) {
                    console.log(err);
                    res.json({ error: true, message: err })
                } else {
                    res.status(200).json({ status: 'OK', podcast: podcast , episodes : episodes })
                }
            })
            
        }
    })
  }
  else{
    res.json({error : true, message: "no uuid found"})
  }

});

app.get('/api/category/list',function(req,res){
    Podcast.find()
    .select('categories')
    .distinct('categories')
    .exec(function(err, list) {
        if (err) {
            console.log(err);
            res.status(401).json({ error: true, message: err })
        } else {
            var result = []
            async.each(list,function(eachItem, callback){
              var item =  eachItem.split('|');
              for(var i=0;i<item.length;i++){
                var word = item[i];
                if(word.charAt(0)===' '){
                  word = word.substring(1,word.length);
                }
                if(word.charAt(word.length-1)===' '){
                  word = word.substring(0,word.length-1);
                }
                result.push(word);
              }
              callback();
            })
            result = [...new Set(result)];
            res.json({status : "OK",count:result.length, categories : result});
        }
    })

});
app.get('/api/getSuggestion',function(req,res){
  var _username = req.auth_user.username;
  User.findOne({username : _username})
  .select('preferred_categories')
  .exec(function(err,items){
    console.log(items["preferred_categories"]);
    if(err){
     return res.json({ error: true, message: err })
    }
    else{
      var result = []
        
          
          count = 0;
          var result = [];
          async.whilst(
            function(){return count<15},
            function(callback){
              var q = items["preferred_categories"][count%items["preferred_categories"].length];
              Podcast.count({categories : {$regex : q, $options: 'i'}}).exec(function(err,c){
                var random = Math.floor(Math.random()*c);
                if(err){
                  return res.json({ error: true, message: err })
                }
                Podcast.findOne({categories : {$regex : q, $options: 'i'}})
                .skip(random)
                .exec(function(err,pod){
                  if(err){
                    return res.json({ error: true, message: err })
                  }
                  else{
                    result.push(pod);
                    count++;
                    callback();
                  }
                })
              })
            },
            function(err){
              if(err){

              }
              else{
                res.json({status : "OK",count:result.length, podcasts : result});
              }
            }

          )
          // async.each(items["preferred_categories"],function(eachItem,callback){
          //   Podcast.find({categories : {$regex : eachItem, $options: 'i'}})
          //   .limit(5)
          //   .exec(function(err,podcasts){
          //     if(err){callback();}
          //     else{
          //       console.log("pods = "+podcasts);
          //       result = result.concat(podcasts);
          //       callback();
          //     }
          //   })
          // },function(err){
          //     if(err){

          //     }
          //     else{
          //       res.json({status : "OK",count:result.length, podcasts : result});
          //     }
          // })
    }
  })
})

app.post('/api/setPreferredCategories',function(req,res){
  var _username  = req.auth_user.username;
  var _preferred = req.query.pref;

  console.log(_preferred);
  const update = {preferred_categories : _preferred};
  User.findOneAndUpdate({username:_username},update, function(err,updated){
    if(err){
      res.status(401).json({ error: true, message: err })
    }
    else{
      res.json({status : "OK", message : "Data has been saved"})
    }
  })
})

app.get('/api/user',function(req,res){

  var _username = req.auth_user.username;

  if(_username === req.auth_user.username){
    User.findOne({username : _username})
  .exec(function(err, _user) {
      if (err) {
          console.log(err);
          res.status(401).json({ error: true, message: err })
      } else {
          res.status(200).json({ error: false, status: 'OK', user: _user })
      }
  })
  }else{
    res.status(401).json({error : true, message:"Permission Denied"})
  }

});

app.get('/api/relatedPodcast',function(req,res){
  _uuid = req.query.uuid;
  Podcast.findOne({uuid : _uuid})
  .exec(function(err,podcast){
    if(err){
      return res.status(401).json({error : true , message : err})
    }
    if(podcast){
      RecommendationEngine.RunRecommendationEngine(res,podcast,0);
    }
    else{
      res.json({error : true, message : "can't find podcast with such uuid"})
    }
  })
})

app.get('/api/relatedEpisode',function(req,res){
  _uuid = req.query.uuid;
  Episode.findOne({uuid : _uuid})
  .exec(function(err,eps){
    if(err){
      return res.status(401).json({error : true , message : err})
    }
    if(eps){
      console.log(eps.processed_title);
      console.log(eps.processed_description);
      RecommendationEngine.RunRecommendationEngine(res,eps,1);
    }
    else{
      res.json({error : true, message : "can't find episode with such uuid"})
    }
  })
})

app.get('/api/category/sample_eps/list',function(req,res){
  Podcast.find()
  .select('categories')
  .distinct('categories')
  .exec(function(err, list) {
      if (err) {
          console.log(err);
          res.status(401).json({ error: true, message: err })
      } else {
          var result = []
          async.each(list,function(eachItem, callback){
            var item =  eachItem.split('|');
            for(var i=0;i<item.length;i++){
              var word = item[i];
              if(word.charAt(0)===' '){
                word = word.substring(1,word.length);
              }
              if(word.charAt(word.length-1)===' '){
                word = word.substring(0,word.length-1);
              }
              result.push(word);
            }
            callback();
          })
          result = [...new Set(result)];

          var endResult = []
          async.each(result,function(eachItem,callback){
            Podcast.find({categories : {$regex : eachItem, $options: 'i'}})
            .limit(4)
            .exec(function(err,pods){
                var cateA = {category:eachItem,podcasts:pods}
                endResult.push(cateA);
                console.log(cateA);
                callback();
            })
          },function(err){
              if(err)
                res.json({error : true, message : err});
              else
                res.json({status : "OK",count:endResult.length, results : endResult});
          })
          
      }
  })

});

app.get('/api/category/podcasts',function(req,res){
  _category = req.query.category;
  _page = req.query.page;
  Podcast.find({categories : {$regex : _category, $options: 'i'}})
  .limit(50)
  .skip((50*_page)-50)
  .exec(function(err,pod){
    if(err){
      return res.status(401).json({error : true , message : err})
    }
    res.json({status : "OK",count:pod.length,page:_page,podcasts:pod})
  })
})

app.post('/api/listen',function(req,res){
  _uuid = req.query.uuid;
  _username = req.auth_user.username;
  User.findOne({username : _username})
  .exec(function(err,user){
    for (var i=user.listened_episodes.length-1; i>=0; i--) {
      if (user.listened_episodes[i] === _uuid) {
        user.listened_episodes.splice(i, 1);
      }
    }
    user.listened_episodes.push(_uuid);
    user.save(function(err,user){
      Episode.findOne({uuid:_uuid})
      .exec(function(err,episode){
      var today = new Date();
      var lastDate = episode.last_updated.getDate()+"-"+episode.last_updated.getMonth()+"-"+episode.last_updated.getFullYear();
      var todayDate = today.getDate()+"-"+today.getMonth()+"-"+today.getFullYear();
      if(lastDate===todayDate){
        episode.view_today +=1;
      }else{
        episode.view_today = 1;
      }
      episode.last_updated = today;
      episode.total_view+=1;
      episode.save(function(err){
        if(err){
          return res.status(401).json({error : true , message : err})
        }
        Podcast.findOne({uuid:episode.podcast_uuid})
        .exec(function(err,pod){
          var today = new Date();
          var lastDate = pod.last_updated.getDate()+"-"+pod.last_updated.getMonth()+"-"+pod.last_updated.getFullYear();
          var todayDate = today.getDate()+"-"+today.getMonth()+"-"+today.getFullYear();
          if(lastDate===todayDate){
            pod.view_today +=1;
          }else{
            pod.view_today = 1;
          }
          pod.last_updated = today;
          pod.total_view+=1;
          pod.save(function(err){
            if(err){
              return res.status(401).json({error : true , message : err})
            }
            else{
              res.json({status:"OK",message: "Listened"})
            }
          })
        })
      });
  })
    })
  })
  
})


app.get('/api/trending',function(req,res){
  Episode.find({})
  .limit(15)
  .sort({ view_today: -1 })
  .populate('podcast',['uuid','image','title','description','author'])
  .exec(function(err, episodes) {
      if (err) {
          console.log(err);
          res.json({ error: true, message: err })
      } else {
          res.status(200).json({ error: false, count:episodes.length, status: 'OK', episodes: episodes })
      }
  })
});

app.get('/api/popular',function(req,res){
  Podcast.find({})
  .limit(15)
  .sort({ total_view: -1 })
  .exec(function(err, pods) {
      if (err) {
          console.log(err);
          res.json({ error: true, message: err })
      } else {
          res.status(200).json({ error: false, count:pods.length, status: 'OK', podcasts: pods })
      }
  })
});
app.get('/api/recent_play',function(req,res){
  _username = req.auth_user.username;

  var result = []
  User.findOne({username : _username})
  .exec(function(err,user){
    async.each(user.listened_episodes,function(eachItem,callback){
      Episode.findOne({uuid:eachItem})
      .populate('podcast',['uuid','image','title','description','author'])
      .exec(function(err,eps){
        result.push(eps);
        callback();
      })
    },function(err){
      if (err) {
        res.json({ error: true, message: err })
    } else {
        res.status(200).json({ status: 'OK',count:result.length, episodes: result })
    }
    })
  })
});
app.post('/api/unsubscribe',function(req,res){
  _uuid = req.query.uuid;
  _username = req.auth_user.username;
  Podcast.findOne({uuid:_uuid})
  .exec(function(err,podcast){

    //cari dan hapus
      for (var i=podcast.subscribers.length-1; i>=0; i--) {
        if (podcast.subscribers[i] === _uuid) {
            podcast.subscribers.splice(i, 1);
        }
      }
      podcast.save(function(err){
        if(err){
          return res.status(401).json({error : true , message : err})
        }
        User.findOne({username:_username})
        .exec(function(err,user){
          for (var i=user.subscribed_podcasts.length-1; i>=0; i--) {
            if (user.subscribed_podcasts[i] === _uuid) {
              user.subscribed_podcasts.splice(i, 1);
            }
          }
          user.save(function(err,user_result){
            if(err){
              return res.status(401).json({error : true , message : err})
            }
            res.json({status:"OK",subscriptions:user_result.subscribed_podcasts});
          });
        })
      });
  })
})
app.post('/api/subscribe',function(req,res){
  _uuid = req.query.uuid;
  _username = req.auth_user.username;
  Podcast.findOne({uuid:_uuid})
  .exec(function(err,podcast){
      podcast.subscribers.push(_username);
      podcast.save(function(err){
        if(err){
          return res.status(401).json({error : true , message : err})
        }
        User.findOne({username:_username})
        .exec(function(err,user){
          for(var i=0;i<user.subscribed_podcasts.length;i++){
            if(user.subscribed_podcasts[i]===_uuid){
              return res.json({error:true,message:"Already subscribed to the podcast"})
            }
          }
          user.subscribed_podcasts.push(_uuid);
          user.save(function(err,user_result){
            if(err){
              return res.status(401).json({error : true , message : err})
            }
            res.json({status:"OK",subscriptions:user_result.subscribed_podcasts});
          });
        })
      });
  })
})

app.get('/api/getSubscribedPodcast',function(req,res){
  var _user = req.auth_user.details;
  console.log(_user);
  var result = []
  async.each(_user.subscribed_podcasts,function(eachItem,callback){
    Podcast.findOne({uuid:eachItem})
    .exec(function(err,pod){
      if(err){
        return res.status(401).json({error : true , message : err})
      }
      result.push(pod);
      callback();
    })
  },function(err){
    if(err){
      return res.status(401).json({error : true , message : err})
    }
    else{
      res.json({status:"OK",count:result.length, podcasts:result})
    }
  })
})

app.post('/api/review',function(req,res){
  _uuid = req.query.uuid;
  _username = req.auth_user.username;

  _content = req.body.content;
  _rating = req.body.rating;
  Episode.findOne({uuid:_uuid})
  .exec(function(err,eps){
    if(err){
      return res.status(401).json({error : true , message : err})
    }
    else{
      var review = {
        user: _username,
        content : _content,
        rating : _rating,
        date_created : new Date()
      }
      eps.reviews.push(review)
      eps.save(function(err,reviews){
        if(err){
          return res.status(401).json({error : true , message : err})
        }
        else{
          total_rate = 0;
          for(var rev in reviews){
            total_rate+=rev.rating;
          }
          total_rate = total_rate/reviews.length;
          Podcast.findOne({uuid:eps.podcast_uuid})
          .exec(function(err,podcast){
            if(err){
              return res.status(401).json({error : true , message : err})
            }
            podcast.total_rating = total_rate;
            podcast.save(function(err){
              if(err){
                return res.status(401).json({error : true , message : err})
              }
              else{
                res.json({status:"OK", review:review})
              }
            })
          })
        }
      })
    }
  })
})

app.get('/api/searchPodcast',function(req,res){
  var _query = req.query.query;
  var _skip = req.query.page;
  Podcast.find({$text: {$search: _query}})
    .limit(20)
    .skip((20*_skip)-20)
    .exec(function(err, docs) {
        if(err){
          return res.status(401).json({error : true , message : err})
        }
        else{
          res.json({status:"OK",count:docs.length, podcasts:docs})
        }
        });
})

app.get('/api/searchEpisode',function(req,res){
  var _query = req.query.query;
  var _skip = req.query.page;
  Episode.find({$text: {$search: _query}})
    .limit(20)
    .populate('podcast',['uuid','image','title','description','author'])
    .skip((20*_skip)-20)
    .exec(function(err, docs) {
        if(err){
          return res.status(401).json({error : true , message : err})
        }
        else{
          res.json({status:"OK",count:docs.length, episodes:docs})
        }
        });
})
app.post('/api/createPlaylist',function(req,res){
  var _name = req.params.name;
  var _username = req.auth_user.username;
  console.log(_username);
  User.findOne({username : _username})
  .exec(function(err,user){
    var previousSn = 0;
    if(user.playlist.length>0){
      previousSn = user.playlist[user.playlist.length-1].sn
    }
    var playlist = {sn : previousSn+1, name : _name, date_created: new Date(), episodes : []}
    user.playlist.push(playlist);
    user.save(function(err,user){
      if(err){
        return res.status(401).json({error : true , message : err})
      }
      else{
        res.json({status:"OK", user:user})
      }
    })
  })
})
app.put('/api/insertToPlaylist',function(req,res){
  var _sn = req.query.sn;
  var _username = req.auth_user.username;
  var _uuid = req.query.uuid;
  Episode.findOne({uuid:_uuid})
  .exec(function(err,eps){
    if(err){
      return res.status(401).json({error : true , message : "No episode with given uuid found"})
    }
    User.findOne({username : _username})
    .exec(function(err,user){
      var found = -1;
      for(var i=0;i<user.playlist.length;i++){
        if(user.playlist[i].sn == _sn){
          found = i;
          break;
        }
      }
      if(found==-1){
        return res.status(401).json({error : true , message : "No episode with given uuid found"})
      }
      user.playlist[found].episodes.push(_uuid);
      user.save(function(err,user){
        if(err){
          return res.status(401).json({error : true , message : err})
        }
        else{
          res.json({status:"OK", user:user})
        }
      })
    })
  })
})
app.get('/api/playlist',function(req,res){
  var _username = req.auth_user.username;
  User.findOne({username : _username})
  .exec(function(err,user){
    if(err){
      return res.status(401).json({error : true , message : err})
    }
    var result = [];
    async.each(user.playlist,function(eachItem,callback){
      var playlist = {name:eachItem.name, date_created:eachItem.date_created,episodes:[]}
      async.each(eachItem.episodes,function(eps,callback2){
        Episode.findOne({uuid:eps})
        .populate('podcast',['uuid','image','title','description','author'])
        .exec(function(err,ep){
          playlist.episodes.push(ep);
          callback2();
        })
      },function(err){
        result.push(playlist);
        callback();
      })
    },function(err){
      if(err){
        return res.status(401).json({error : true , message : err})
      }
      else{
        res.json({status:"OK",count:result.length, playlists:result})
      }
    })
  })
})

app.get('/api/podcaster/uploaded_podcast',function(req,res){
  var user = req.auth_user.details;
  console.log(user);
  result = []
  async.each(user.uploaded_podcasts,function(eachPod,podCallback){
    Podcast.findOne({uuid:eachPod})
    .exec(function(err,pod){
      if(err){
        return res.status(401).json({error : true , message : err})
      }
      result.push(pod);
      podCallback();
    })
  },function(err){
    if(err){
      return res.status(401).json({error : true , message : err})
    }else{
      res.json({status:"OK",count:result.length, podcasts:result});
    }
  })
})

app.get('/removenonenglish', function(req, res) {
  req.setTimeout(36000000);
  var param = {

  }
  Podcast.deleteMany({
    language: {$ne : "English"}

  },function(err,podcast){
    if(err){
      console.log(err);
    }
    else{
      console.log(podcast.title)
    }
  })
      
});

app.listen(port, () => console.log("server running on port "+port));