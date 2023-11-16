const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3500;

// cherche et gère les différentes erreurs possibles
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const adress = server.address();
    const bind = typeof adress === 'string' ? 'pipe' + adress : 'port' + port;
    switch (error.code) {
        case 'EACCES' :
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE' :
            console.error(bind + 'is already in use.');
            process.exit(1);
            break;
        default :
            throw error;
    }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listenning', () => {
    const address = server.address();
    const bind = typeof adress === 'string' ? 'pipe' + adress : 'port' + port;
    console.log("Listenning on" + bind);
})

server.listen(port);