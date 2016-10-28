module.exports = {
    "url": "blook.io",
    "secret": "randomstringtousedinencryption",
    "pagination": "10",
    "uploads": "app/Uploads",
    "jwtStorage": "file",
    "port": "80",
    "database": {
        "bhogiza": {
            "host": "127.0.0.1",
            "port": 27017,
            "name": "bhogiza",
            "username": "",
            "password": "",
            "options": {
                "db": "admin"
            }
        },
        "qogiza": {
            "host": "127.0.0.1",
            "port": 27017,
            "name": "qogiza",
            "username": "",
            "password": "",
            "options": {
                "db": "admin"
            }
        },
        "organizationone" :  {
            "host": "127.0.0.1",
            "port": 27017,
            "name": "organizationone",
            "username": "",
            "password": "",
            "options": {
                "db": "admin"
            }
        }
    }
}
