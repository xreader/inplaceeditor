var express =       require('express')
    , http =        require('http')
    , path =        require('path')
    , fs =          require('fs')
    ;
var port = 8080;

var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('expressPEsw4Wre4echec2aT2bu2r2rAthac'));
    app.use(express.session({ secret: '4Wre4echec' }));
    app.use(app.router);
    app.use(express.static(path.join(__dirname, '.')));
});

//save changes
app.post('/save', function (req, res) {
    console.log("saving:" + req.body.name);
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
    if ( req.body.from && req.body.to ) {
	    fs.readFile( req.body.from, function (err, data) {
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
