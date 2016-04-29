var RotatingWritable = require("rotating-writable")

function HealthdLogger(options){
	options = options || {}
	options.path = options.path || (process.cwd() + "/logs/application.log")

	function start(req){
		var epoch = Date.now(),
			start = process.hrtime(),
			url = req.url,
			statusCode = req.statusCode,
			forwardedFor = req.headers["x-forwarded-for"]
		return function finish(){
			var span = process.hrtime(start),
				duration = span[0] * 1e6 + diff[1] * 1e-3
			return [epoch, url, statusCode, duration, duration, forwardedFor].join("\"")
		}
	}

	start.koa2 = function(ctx, next){
		var finish = start(ctx.req)
		var middlewares = next()
		middlewares.then(finish, finish)
		return middlewares
	}

	return start
}

module.exports = HealthdLogger
module.exports.HealthdLogger = HealthdLogger
