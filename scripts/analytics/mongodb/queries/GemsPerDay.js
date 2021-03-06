// Print out gem counts bucketed by day and amount
// NOTE: created is a string and not an ISODate in the database

var match={
    "$match" : {
        "stripe.subscriptionID" : { "$exists" : false }
    }
};
var proj0 = {"$project": {
    "amount": 1,
    "created": { "$concat": [{"$substr" :  ["$created", 0, 4]}, "-", {"$substr" :  ["$created", 5, 2]}, "-", {"$substr" :  ["$created", 8, 2]}]}
}
};

var group={"$group" : {
        "_id" : {
            "m" : "$amount",
            "d" : "$created"
        },
        "count" : {
            "$sum" : 1
        }
    }
};
var sort = {$sort: { "_id.d" : -1}};
db.payments.aggregate(match, proj0, group, sort).result.forEach( function (myDoc) { print({day: myDoc._id.d, amount: myDoc._id.m, count: myDoc.count}) })
