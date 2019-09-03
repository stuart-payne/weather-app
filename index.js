'use strict';

const fs = require("fs");
const Hapi = require('hapi');

let rawdata = fs.readFileSync("city.list.json");
const CITIES = JSON.parse(rawdata);

const lookUpCity = (id) => {
    return CITIES.find(function(el) {
        return el.id == id;
      });
}

const checkCityName = (name) => {
    var res = CITIES.find((el) => {
        return el.name == name;
    });
    return (res ? true : false); 
}


const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    await server.register(require('inert'));

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: 'dist'  
            }
        }
    });
    
    server.route({
        method: 'GET',
        path: '/city/{cityid}',
        handler: (request, h) => {
            console.log(request.params.cityid);
            var found =  lookUpCity(request.params.cityid);
            if(found){
                console.log(found.name);
                return {name: found.name, country: found.country};
            } else {
                return undefined;
            }
        },
        options: {
            cors: true
        }
    });

    server.route({
        method: 'GET',
        path: '/check/{cityName}',
        handler: (request, h) => {
            var check = checkCityName(request.params.cityName);
            return {check: check};
        },
        options: {
            cors: true
        }
    });

    await server.start();
    console.log(`Server running on ${server.info.uri}`);
}

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();