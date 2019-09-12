const express = require('express')
const router = express.Router()
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL || 'mysql://root:@localhost/test')
// const sequelize = require("../../server")

const bodyParser = require('body-parser')
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))


oldestUser = function () {
    //// get the oldest user in each country
    // SELECT MAX(age),country FROM `users` GROUP BY country
    let result = sequelize.query("SELECT MAX(age),country FROM `users` GROUP BY country").spread(function (data, metadata) {
        return data
    })
    return Promise.resolve(result)
}

// oldestUser()

userBetweenDate = function () {
    //// get users that created between date
    // SELECT name ,created_date FROM `users` WHERE (created_date BETWEEN '2019-07-03' AND '2019-07-29')
    let result = sequelize.query("SELECT name ,created_date FROM `users` WHERE (created_date BETWEEN '2019-07-03' AND '2019-07-29' )").spread(function (data, metadata) {
        return data
    })
    return Promise.resolve(result)
}

// userBetweenDate()

//-------------------------------------------------------------------------------------------------------------------------------

////// Simple backend operation
//// connect to the SQL DB

////get the data from the csv file and put them o the table users

getDataFromCsv = function () {
    const csv = require('csv-parser');
    const fs = require('fs');
    let data = []
    fs.createReadStream('user_table.csv')
        .pipe(csv())
        .on('data', (row) => {
            data.push(row)
            // console.log(data);
        })
        .on('end', () => {
            console.log('CSV file successfully processed')
            // console.log(data)
            for (i of data) {
                sequelize
                    .query(`INSERT INTO users VALUES('${i.name}', '${i.email}', '${i.password}','${i.created_date}','${i.country}','${i.age}')`)
                    .then(function (result) {
                        console.log(result)
                    })

            }
            // console.log(i.name)
        });
}


//// function for make a new name if the name have Equal Brace Letters (more then onens) and return true if do's and false else

isHaveBraceEqualLetters = function (x) {
    let name = x
    let HaveBraceEqualLetters = false
    for (let i = 0; i < name.length; i++) {
        if (name[i] === name[i - 1]) {
            // console.log(name[i], name[i - 1])
            name = name.replace(`${name[i]}`, " ")
            name = name.replace(`${name[i - 1]}`, " ")
            // console.log(name)
            HaveBraceEqualLetters = true
        }
    }
    return [HaveBraceEqualLetters, name]
    // console.log(i)
}

// function for run on all data and change the name according to the above function

SimpleBackendOperation = function () {
    let result = sequelize.query("SELECT * FROM `test`.`users`").spread(function (data, metadata) {
        console.log(data)
        for (let i of data) {
            let answer = isHaveBraceEqualLetters(i.name)
            // console.log(result)
            if (answer[0]) {
                sequelize.query(`UPDATE users SET name = '${answer[1]}' WHERE name = '${i.name}'`).spread(function (results, metadata) {
                })
            }
        }
        return data
    })
    return Promise.resolve(result)
}

//-------------------------------------------------------------------------------------------------------------------------------

////// Algorithm handling
//create 5 groups of users according to there age

//option 1 // get pramter of how much groups I want
option1 = function (numberOfGroupIneed) {
    sequelize.query("SELECT * FROM `test`.`users` ORDER BY age").spread(function (results, metadata) {
        // to test my code more easily 
        // sequelize.query("SELECT name FROM `test`.`users` ORDER BY age LIMIT 14").spread(function (results, metadata) {
        let newRsult = []
        let saver = 0
        let saver2 = 0
        let userNUM = (results.length / numberOfGroupIneed)
        userNUM = parseInt(Math.ceil(userNUM))
        for (let i = 0; i < numberOfGroupIneed; i++) {
            let nextGroup = results.slice((i + 1) * userNUM, (userNUM * (i + 2)) + saver).length
            if (nextGroup < userNUM) {
                saver = -1
                saver2 -= 1
            }
            let group = results.slice(i * userNUM + saver2, (userNUM * (i + 1)) + saver + saver2)
            newRsult.push(group)
        }
        for (i of newRsult) {
            console.log("group number " + (newRsult.indexOf(i) + 1), i)
        }
        return newRsult
    })
}


// option1(5)

const getAvgOfArray = function (array) {
    return array.reduce((a, b) => a + b) / array.length;
}

const getData = async function () {
    let result = await sequelize.query("SELECT name , age FROM `test`.`users` ").spread(function (results, metadata) {
        return results;
    })
    // console.log(result)
    return Promise.resolve(result);
}

const getGroups = async function (number_of_groups) {
    let data = await getData();
    let finalResult = await brian(number_of_groups, data);
    return Promise.resolve(finalResult);
}

const brian = function (number_of_groups, data) {
    let centers = Array.from({ length: number_of_groups }, () => Math.floor(Math.random() * 120)).map(center => {
        return { avg: center, ages: [], name: [] };
    });
    centers = Object.assign({}, centers);

    // console.log(centers);
    let loopLimit = 100;
    let loopIndex = 1;
    let loopContinue = true;
    let needReastBrian = false

    while (loopContinue && loopIndex < loopLimit) {
        loopContinue = false;
        data.forEach(d => {
            let closest = {
                point: 0,
                distance: Math.abs(centers[0].avg - d.age)
            }; // initialize first point as the closest, and find the distance;
            for (let i in centers) {
                // console.log(i)
                if (i > 0) {
                    let distance = Math.abs(centers[i].avg - d.age);
                    if (distance < closest.distance) {
                        closest.point = i;
                        closest.distance = distance;
                    }
                }
            }
            // console.log(d.name);
            centers[closest.point].ages.push(d.age);
            centers[closest.point].name.push(d.name)
        });
        for (let i in centers) {
            // console.log(centers[i].ages.length === 0)
            if (centers[i].ages.length === 0) { needReastBrian = true; centers[i].ages = []; centers[i].name = []; return brian(number_of_groups, data) }
            else {
                let newAverage = getAvgOfArray(centers[i].ages);
                if (centers[i].avg !== newAverage) {
                    loopContinue = true;
                    centers[i].avg = newAverage;

                }
                if (loopContinue && loopIndex < 100) {
                    centers[i].ages = [];
                    centers[i].name = [];
                }
            }
        }
        // if (!needReastBrian) {
        console.log("data after " + loopIndex + " iterations:", centers);
        loopIndex++;
        // }
    }
    if (!needReastBrian) {
        return Promise.resolve(centers);
    } else {
        return Promise.resolve(false);
    }
}



// option2(5)


// let x = oldestUser()
// console.log(x)
router.get('/answer11', async function (req, res) {
    let results = []
    await oldestUser().then(result => {
        results.push(result)
    });
    res.send(results)
})

router.get('/answer12', async function (req, res) {
    let results = []
    await userBetweenDate().then(result => {
        results.push(result)
    });
    res.send(results)
})

router.get('/answer21', async function (req, res) {
    let results = []
    await SimpleBackendOperation().then(result => {
        results.push(result)
    });
    res.send(results)
})

router.get('/answer31', async function (req, res) {
    let result = []
    await getGroups(5).then(clustered => {
        // console.log("final result:", clustered);
        let groups = []
        let newGroup = []
        let avgs = []
        for (i in clustered) {
            groups.push(clustered[i])
            avgs.push(clustered[i].avg)
        }
        function sortNumber(a, b) {
            return a - b;
        }
        avgs.sort(sortNumber);
        for (i of avgs) {
            let x = groups.find(g => g.avg === i)
            newGroup.push(x)
        }
        // let result = []
        if (newGroup.length === 5) {
            result.push('Babies', newGroup[0],
                'Children', newGroup[1],
                'teennagers', newGroup[2],
                'Adults', newGroup[3],
                'Sabbath elders', newGroup[4])
        } else for (let i of newGroup) {
            result.push("group number ", newGroup.indexOf(i) + 1, i)
        }
    });

    res.send([result])
})




//------------------------------------------geting data from csv and make new users in DB----------------------------------------------------------------------

//  create a Table 
var users = sequelize.define('users', {
    name: { type: Sequelize.STRING },
    email: { type: Sequelize.STRING },
    password: { type: Sequelize.STRING },
    created_date: { type: Sequelize.STRING },
    country: { type: Sequelize.STRING },
    age: { type: Sequelize.INTEGER },
});

const createNewUser = function (i) {
    users.sync().then(function () {
        return users.create({
            name: i.name,
            email: i.email,
            password: i.password,
            created_date: i.created_date,
            country: i.country,
            age: i.age,
        });
    });
}

getUsers =  function () {
    const csv = require('csv-parser');
    const fs = require('fs');
    let data = []
    // let bkj = require('../route/')
    fs.createReadStream('user_table.csv')
        .pipe(csv())
        .on('data', (row) => {
            data.push(row)
        })
        .on('end', () => {
            console.log('CSV file successfully processed')
            for (i of data) {
                 createNewUser(i)
            }
        });
}

getUsers()





module.exports = router