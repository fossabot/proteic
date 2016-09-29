var fs = require("fs"),
    rollup = require("rollup");
    
rollup.rollup({
    entry: "index.js",
    external: ['d3']
}).then(function (bundle) {
    var code = bundle.generate({
        format: "cjs"
    }).code.replace(
        /^exports\.event = (.*);$/m,
        "Object.defineProperty(exports, \"event\", {get: function() { return $1; }});"
        );
    return new Promise(function (resolve, reject) {
        fs.writeFile("build/bundle.node.js", code, "utf8", function (error) {
            if (error) return reject(error);
            else resolve();
        });
    });
}).catch(abort);

function abort(error) {
    console.error(error.stack);
}