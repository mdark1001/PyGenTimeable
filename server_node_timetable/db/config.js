const config = {
    "PORT": 3001,
    "ODOO": {
        "port": 5432,
        "app_name": "horarios-real-time",
        "database": "smk",
        "username": "postgres",
        "password": "admin",
        "host": "localhost",
        "dialect": "postgres",
        "pool": {
            "max": 50,
            "min": 0,
            "acquire": 30000,
            "idle": 10000
        },
        "logging": function (s) {
           // console.log(s);
        },
        setup: true
    }
}
module.exports = config;
