var connect = require('connect')
    , http = require('http')
    , port = process.env.PORT || 5000
    , hostname = process.env.HOSTNAME || "leena-lemur-ultra.local";

var app = connect()
    .use(connect.logger('dev'))
    .use(connect.static('public'))
    .use(connect.directory('public'))
    .use(connect.cookieParser())
    .use(connect.session({ secret: 'my secret here' }))
    .use(function(req, res){
        res.end('Hello from Connect!\n');
    });

http.createServer(app).listen(port);