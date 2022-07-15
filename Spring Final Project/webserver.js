var http = require("http");
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var app = express();
var fs = require("fs");
var url = require("url");
var qs = require("querystring");

var rand = 0;


function checkFile(pathname, response)
{
	var extension = path.extname(pathname).substring(1);
	console.log(extension);
	fs.readFile(pathname, function(err, data)
	{
		if (err)
		{
			console.log(err);
			response.writeHead(404, {"Content-Type": 'text/"' + extension + '"'});
		}
		else
		{
			if (extension == "png")
			{
				if (err)
				{
					console.log(err);
					response.writeHead(404, {"Content-Type": "image/png"});
				}
				else
				{
					response.writeHead(200, {"Content-Type": "image/png"});
				}
			}
			if (extension == "jpg")
			{
				if (err)
				{
					console.log(err);
					response.writeHead(404, {"Content-Type": "image/png"});
				}
				else
				{
					response.writeHead(200, {"Content-Type": "image/jpeg"});
				}
			}
			response.writeHead(200, {"Content-Type": 'text/"' + extension + '"'});
			response.end();
		}
	});
}

checkForLogin = function(loginInfo)
{
	var loginData = fs.readFileSync("dbase.txt");
	loginData = loginData.toString().split(";");
	for (var i = 0; i < loginData.length; i++)
	{
		var dataObj = JSON.parse(loginData[i]);
		
		if (dataObj.uname == loginInfo.uname && dataObj.pword == loginInfo.pword)
			return dataObj;
	}
}

http.createServer(function(request, response)
{
	
	var pathname = url.parse(request.url).pathname.substring(1);
	console.log("Request for " + pathname + " received.");
	
	
	
	fs.readFile(pathname, function(err, data)
	{
		if (err)
		{
			console.log(err);
			response.writeHead(404, {"Content-Type": "text/html"});
		}
		else
		{
			response.writeHead(200);
			if (request.method == "POST")
			{
				checkFile(pathname, response);
				request.on("data", function(qstr)
				{
					var qobj = qs.parse(qstr.toString());
					
					console.log(qobj);
					if (qobj.test == "1")
					{
						var given = fs.readFileSync("datainfo.txt");
						var objects = [];
						objects = (given.toString()).split(";");
					
						var change = 0;
						console.log("one");
						for (j = 0; j < objects.length-1; j++)
						{
							var temp = JSON.parse(objects[j]);
						
						
							if (qobj.uname == temp.uname && qobj.pword == temp.pword)
							{
								response.write(data.toString());
								response.write("\n<script>data = " + JSON.stringify(temp) + ";</script>\n");
								change = 1;
								break;
							}
						}
						if (j >= objects.length-1 && change != 1)
						{
							response.write("Username or Password is incorrect.");
						}
						console.log(objects);
						response.end();
					}
					if (qobj.test == "2")
					{
						var change = 0;
						fs.appendFileSync("datainfo.txt", JSON.stringify(qobj) + ";" + "\r\n", function (err)
						{
							if (err)
								console.log(err);
						});
						response.write(data.toString());
						response.end();
					}
					if (qobj.test == "3")
					{
						response.write(data.toString());
						console.log(JSON.stringify(qobj));
						response.write("\n<script>data = " + JSON.stringify(qobj) + ";</script>\n");
						response.end()
					}
				});
				
			}	
			else
			{
				response.write(data);
				response.end();
			}
		}
		
	});
}).listen(8081);

console.log("Server running at http://127.0.0.1:8081");
