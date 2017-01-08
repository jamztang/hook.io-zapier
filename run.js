var request = require("request");

function serialize(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

module['exports'] = function myService (hook) {  
  
  var params = hook.params;
  var owner = params.owner;
  var name = params.name;
  var method = params.method;

  var url = `https://hook.io/${owner}/${name}`;
  var data = {}
  var query = ""
  if (method === "GET") {
    query = serialize(params.data);
    url = url + "?" + query;
  } else {
    data = params.data;
  }

  var options = { 
    url: url,
    method: method,
    body: data,
    json: true,
  }
  
  request(options, function(e, r, body) {
    
     if (e) {
       hook.res.end(body);
       return;
     }
     hook.res.end(body); 

  });
    
};