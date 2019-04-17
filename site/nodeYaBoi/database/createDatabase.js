//this will one-time create the database
"use strict";
var sql = require("sqlite");
var db;

create();

async function create()
{
    try
    {
        db = await sql.open('./db.sqlite');
        await db.run("create table comments (id integer primary key autoincrement,name,text,date,page)");
        await db.run("create table users (id integer primary key autoincrement,name,email,password,salt)");
        // await db.run("insert into comments values (0,'Joe','','now','tokyo')");
        // await db.run("insert into comments values (1,'Dan','I am Alpha','now','tokyo')");
        // var as = await db.all("select * from comments");
        // var joe = await db.all("select * from comments where name = 'Joe'")
        // console.log(as);
        // console.log(joe); 
    }
    catch (error)
    {
        console.log(error);
    }
}



// var db = new sql.Database("myData.db");

// db.serialize(create);

// db.all("select * from animals", show);

// db.all("select * from animals where id=42", show);


// function create()
// {
//     db.run("create table comments (id,name,text,date,page)");
//     db.run("insert into yeyeye values (42, 'dog')");
//     db.run("insert into yeyeye values (53, 'fish')");
// } 

// function show(err, rows)
// {
//     if (err) {throw err;}
//     console.log(rows);
// }


/*
var sqlite = require("sqlite");
var db;
create();

async function create() {
    try {
        db = await sqlite.open("./db.sqlite");
        await db.run("create table animals (id, breed)");
        await db.run("insert into animals values (42,'dog')");
        await db.run("insert into animals values (53,'fish')");
        var as = await db.all("select * from animals");
        console.log(as);
    } catch (e) { console.log(e); }
}
*/