var express =       require('express')
    , http =        require('http')
    , path =        require('path')
    , fs =          require('fs')
    , flash =       require('connect-flash') ;
var port = 8080;

var app = express()
    , passport = require('passport')
    , util = require('util')
    , LocalStrategy = require('passport-local').Strategy;

var users = [
    { id: 1, username: 'admin', password: 'secret'}
];

function findById(id, fn) {
	var idx = id - 1;
	if (users[idx]) {
		fn(null, users[idx]);
	} else {
	      fn(new Error('User ' + id + ' does not exist'));
	}
}

function findByUsername(username, fn) {
	for (var i = 0, len = users.length; i < len; i++) {
		var user = users[i];
		if (user.username === username) {
			return fn(null, user);
		}
	}
	return fn(null, null);
}

passport.serializeUser(function(user, done) {
	  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	findById(id, function (err, user) {
		done(err, user);
	});
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.
      findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      })
    });
  }
));

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');	
    app.set('port', process.env.PORT || 3000);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('expressPEsw4Wre4echec2aT2bu2r2rAthac'));
    app.use(express.session({ secret: '4Wre4echec' }));
    app.use(passport.initialize());
    app.use(flash());
    app.use(passport.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, '.')));
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user, message: req.flash('error') });
});

/*
app.get('/js/inplaceeditor.js', function (req, res) {
	console.log("editor requested...");
	if (req.isAuthenticated())
		res.sendfile("inplaceeditor.js", {root:"js"});
	else
		res.sendfile("login.js", {root:"js"});		

});
*/

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  function(req, res) {
    res.redirect('/index.html');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/index.html');
});

app.get('/isloggedin', function(req, res){
    if ( req.isAuthenticated() )
        res.send("true");
    else
        res.send("false");
});

//create new page
app.post('/create', function (req, res) {
    console.log("saving:" + req.body.name);
    if ( !req.isAuthenticated() ) {
        res.send('not authenticated', 401);
    }
    var name = req.param('name', null);
    var theme = req.param('theme', null);
    var template = req.param('template', null);
    if (name && theme && template) {
        //read layout data
        var layoutFile = 'data/layout/' + template + '.html';
        fs.readFile( layoutFile, function (err, data) {
            data = data.toString().replace('$bootstrap_css$', theme.css);
            if (err) throw err;
            fs.writeFile(name, data, function (err) {
                if (err) throw err;
                console.log('page created!');
                res.send("ok");
            });
            console.log(data);
        });
    }
});
//save changes
app.post('/save', function (req, res) {
    console.log("saving:" + req.body.name);
    if ( !req.isAuthenticated() ) return false;
    var name = req.param('name', null);
    var content = req.param('content', null);
    if (name && content) {
    	fs.writeFile(name, content, function (err) {
            if (err) throw err;
            console.log('It\'s saved!');
            res.send("ok");
        });
    }
});

app.post('/duplicate', function (req, res) {
    console.log("duplicate:" + req.body.from + "/" + req.body.to);
    if ( !req.isAuthenticated() ) return false;
    if ( req.body.from && req.body.to ) {
        var from = req.body.from;
        var parsedUrl = url.parse( req.body.from );
        from = parsedUrl.path.toString().replace('#', '');
        from = from == '\/'?'':from;
        var from = from || 'index.html';

        fs.readFile( from, function (err, data) {
		if (err) throw err;
		fs.writeFile(req.body.to, data, function (err) {
		    if (err) throw err;
		    console.log('Its duplicated!');
            res.send("ok");
		});
		console.log(data);
	    });
    }
});

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
