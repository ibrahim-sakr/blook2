module.exports = {
    "url": "blook.app",
    "secret": "randomstringtousedinencryption",
    "pagination": "10",
    "uploads"   : "app/Uploads",
    "jwtStorage": "file", 
    "port"      : "1234", 
    "database": {
        "organizationone": {
            "host": "127.0.0.1",
            "port": 27017,
            "name": "organizationone",
            "username": "",
            "password": "",
            "options": {
                "db": "admin"
            }
        },
        "organizationtwo": {
            "host": "127.0.0.1",
            "port": 27017,
            "name": "organizationtwo",
            "username": "",
            "password": "",
            "options": {
                "db": "admin"
            }
        },
        "organizationthree": {
            "host": "127.0.0.1",
            "port": 27017,
            "name": "organizationthree",
            "username": "",
            "password": "",
            "options": {
                "db": "admin"
            }
        } 
    }
}
