var httpProxy = require('http-proxy');
const util = require('util');
const config = require('./config/config.json');

const caasurl = "http://" + config.caashost + ":" + config.caasport;

var proxy = httpProxy.createServer({
	target: caasurl
});
console.info("listening on port " + config.port);
console.info("redirecting to " + caasurl);
proxy.listen(config.port);

proxy.on('proxyReq', function(proxyReq, req, res, options) {
	let prMethod = util.inspect(proxyReq.method, false, null).split("'").join("");
	let prPath = util.inspect(proxyReq.path, false, null).split("'").join("");

	console.info(prMethod + " " + caasurl + prPath);

	proxyReq.setHeader('Authorization', 'apikey="' + config.apikey + '"');

	console.info("Added apikey to headers");
});
proxy.on('error', function(err, req, res){
	console.error(err);
});