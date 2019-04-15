"use strict"

var sql = require("sqlite3");

//Database
const databaseName = "myDB";
const databaseVersion = "1";

//Table - users
const tableNameUsers = "users";

//Columns
const keyID = "id";
const keyUserName = "username";
const keyEmail = "email";
const keyPassword = "password";

//SQL for creating table:
var db = new sql.Database(databaseName+".db");

function createDB()
{
    db.run(
        "create table " + 
        tableNameUsers + 
        " (" +
        keyID       + ", " +
        keyUserName + ", " +
        keyEmail    + ", " +
        keyPassword +
        ")"
        );
}

createDB();

function addUser(username,email,password)
{
    db.run(
        "insert into"  + 
        tableNameUsers +
        "values (" +
        "0," +
        username + "," +
        email    + "," +
        password +
        ")"
        );
}

addUser("joe","joe@joe","123");