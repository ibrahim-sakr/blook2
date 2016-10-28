var fs = require('fs');

function jwtFileRetriever(token){
    this.check = function(token){
        if (token) {
            var savedJwt = fs.readFileSync("./savedJWT", 'utf8');
            savedJwt = savedJwt.split(";");
            if (savedJwt.indexOf(token) === -1) {
                return false;
            } else {
                return true;
            };
        }
        return false;
    }

    this.save = function(token){
        var file = fs.readFileSync('./savedJWT','utf8');
        var newData = file + ";" + token;
        fs.writeFileSync('./savedJWT', newData, {
            encoding: "utf8"
        });
        return true;
    }

    this.delete = function(token){
        var file, index, data;
        file = fs.readFileSync('./savedJWT', 'utf8');
        file = file.split(";");
        index = file.indexOf(token);
        file.splice(index, 1);
        data = file.join(";");
        fs.writeFileSync('./savedJWT', data);
        return true;
    };
}
module.exports = new jwtFileRetriever;
