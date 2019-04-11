"use strict";
var sql = require("sqlite3");
var db = new sql.Database("data.db");

db.serialize(createMapPinData);

// db.all("select * from mapPins", show);§

// db.all("select * from animals where id=42", show);


function createMapPinData()
{
    db.run("create table mapPins (id, lat, long, pageLink, locationName)");
    db.run("insert into mapPins values (0, 36, 140,'tokyo','Tokyo')");
    db.run("insert into mapPins values (1, 22, 104,'tokyo','Sapa')");
    db.run("insert into mapPins values (2, 25, 83,'tokyo','Varanasi')");
    db.run("insert into mapPins values (3, 65, -18,'tokyo','Iceland')");
    db.run("insert into mapPins values (4, 39, -9,'tokyo','Lisbon')");
    db.run("insert into mapPins values (5, -23, -43,'tokyo','Rio de Janeiro')");
    db.run("insert into mapPins values (6, 37, -120,'tokyo','Yosemite')");
    db.run("insert into mapPins values (7, -13, -73,'tokyo','Machu Pichu')");
    db.run("insert into mapPins values (8, 7, 30,'','Location of Boi')");
}


function show(err, rows)
{
    if (err) {throw err;}
    console.log(rows);
}