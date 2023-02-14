'use strict';

const Sequelize = require('sequelize');
let connections = {};

const createConnection = async (config) => {
    if (connections[config.database])
        return connections[config.database];
    connections[config.database] = await new Sequelize(
        config.database,
        config.user,
        config.password, {
            host: config.host,
            dialect: config.dialect,
            pool: {
                max: config.max,
                min: config.min || 0,
                idle: config.idle || 1000
            },
            port: config.port
        }
    );
    return connections[config.database];
};

const createConnections = configs => configs.reduce((promise, config) => createConnection(config));

const getConnections = () => connections;

const getConnection = async (config) => {
    if(!connections[config.database]) {
        connections[config.database] = await createConnection(config);
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
