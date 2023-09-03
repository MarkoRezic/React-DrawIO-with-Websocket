import dotenv from 'dotenv'
dotenv.config();

const {
    DB_HOST,
    DB_USER,
    DB_PASS,
    DB_DATABASE,
} = process.env;

import mysql from "mysql2";

const db_raw = mysql.createPool({
    connectionLimit: 1000,
    connectTimeout: 60 * 60 * 1000,
    user: DB_USER,
    host: DB_HOST,
    password: DB_PASS,
    database: DB_DATABASE,
});

const db_parallel_raw = mysql.createPool({
    connectionLimit: 1000,
    connectTimeout: 60 * 60 * 1000,
    user: DB_USER,
    host: DB_HOST,
    password: DB_PASS,
    database: DB_DATABASE,
    multipleStatements: true,
});

const db = db_raw.promise();
const db_parallel = db_parallel_raw.promise();

export {
    mysql,
    db_raw,
    db_parallel_raw,
    db,
    db_parallel
};