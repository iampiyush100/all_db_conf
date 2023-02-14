'use strict';

const mysql = require('mysql2/promise');
let connections = {};

const createConnection = async (config) => {
    if (connections[config.database])
        return connections[config.database];
    connections[config.database] = await mysql.createConnection(config);
    return connections[config.database];
};

const createConnections = configs => configs.reduce((promise, config) => createConnection(config));

const getConnections = () => connections;

const getConnection = async (config) => {
    if(!connections[config.database]) {
        connections[config.database] = mysql.createPool(config);
    }
    return connections[config.database];
};

const terminateConnection = database => {
    if (!connections[database])
        throw new Error(`Connection does not exist for database ${database}`);

    // TODO Test termination
    return connections[database].destroy();
};
module.exports = {
    createConnection,
    getConnection,
    getConnections,
    createConnections,
    terminateConnection
};
