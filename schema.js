var request = require("request");
var _ = require("lodash");

module['exports'] = function myService (hook) {  
  

  var params = hook.params;
  var name = params.name;
  var owner = params.owner;
  
  var url = `https://hook.io/${owner}/`;
  
  request(url, function(e, r, body) {
    
    if (e) {
      hook.res.json({"success":false, "error": error});
      return;
    }
    
    var array = JSON.parse(body);
    
    var webhook = _.head(_.filter(array, function(webhook) {
      return webhook.name === name;
    }));
    
    var mschema = webhook.mschema;  // assume mschema is enabled
    
    var formatted;
 
    if ( ! mschema) {
      formatted = [{
          "type": "text",
          "key": "data",
          "required": false,
          "label": "Data",
          "help_text": `Request params in JSON format. You can implement [schema for this hook.io](https://hook.io/admin?owner=${owner}&name=${name}#schema)`
      }];
    } else {

      var mapping = {
        "string": "unicode",
        "number": "decimal", 
      };
      
      formatted = _.map(mschema, function(value, key) {

          var name = key;
          var type = mapping[value.type] || "text";
          var required = value.required || false;
          var label = value.label || "";
          var help = value.help || "";

          var info = {
            "type": type,
            "key": "data__" + name,
            "required": required,
            "label": label,
            "help_text": help,
            "parent_key": "data",
          }

          return info;

      });
    }
    
    hook.res.json(formatted);
    
  });
  
};
