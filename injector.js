window._fs = require("fs");

window.addJS = function(path) {
    console.log(path);
    var customJS = window._fs.readFileSync(path, "utf-8");
    // console.log(customJS);
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = customJS;
    document.head.appendChild(script);
};

window.addJQuery = function(jqueryPath){
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = "window.$ = window.jQuery = require('"+jqueryPath+"');";
    document.head.appendChild(script);
}

window.addJQuery(window.jQueryPath);
window.addJS(window.injectablePath);