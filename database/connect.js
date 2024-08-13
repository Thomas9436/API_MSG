const { MongoClient } = require("mongodb");

var client = null;

function connection(url, callback){
    if (client==null){
        client = new MongoClient(url);

        client.connect((erreur)=>{
            if(erreur){
                const { MongoClient, Db } = require("mongodb");

            var client = null;
            
            function connection(url, callback){
                if (client==null){
                    client = new MongoClient(url);
            
                    client.connect((erreur)=>{
                        if(erreur){
                            client=null;
                            callback(erreur);
                        }else{
                            callback();
            
                        }
                    });
                }else{
                    callback();
                }
            }
            function db(){
                return new Db(client, "DBM")
            }
            function closeConnection(){
                if(client){
                    client.close();
                    client=null;
                }
            }
            
            module.exports = {connection, db, closeConnection}
                client=null;
                callback(erreur);
            }else{
                callback();

            }
        });
    }else{
        callback();
    }
}

function db(){
    return client.db("DBM");
}

function closeConnection(){
    if(client){
        client.close();
        client=null;
    }
}

module.exports = {connection, db, closeConnection}
