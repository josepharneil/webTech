"use strict";
var sql = require("sqlite3");
var db = new sql.Database("myData.db");

db.serialize(create);

db.all("select * from animals", show);

db.all("select * from animals where id=42", show);


function create()
{
    db.run("create table yeyeye (id, breed)");
    db.run("insert into yeyeye values (42, 'dog')");
    db.run("insert into yeyeye values (53, 'fish')");
}

function show(err, rows)
{
    if (err) {throw err;}
    console.log(rows);
}