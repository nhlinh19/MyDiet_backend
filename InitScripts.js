const mongoose = require("mongoose")
const models = require("./models")
const { create } = require("./models/user")


mongoose
.connect("mongodb+srv://linhlrx:eAHJrgHjgCnF69wQ@clusterdemo.tcwne.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
.then(()=> console.log("DB connected"))
.catch(err => console.error(err))



createFood("Apple", "1 medium", 52, 14, 0, 0)
createFood("Atlantic Salmon", "1 fillet", 280, 1, 15, 36)
createFood("Alaskan King Crab", "6 oz", 70, 1, 1, 14)
createFood("Carrot", "50g", 21, 5, 0, 1)
createFood("Rice", "45 g", 160, 35, 0, 3)
/*createFood("steak", "200g", 196, 2, 4, 40)
createFood("Banana", "1 medium", 89, 23, 0, 1)
createFood("Egg", "1 small egg", 54, 0, 4, 5)
createFood("Pork", "2 patties", 140, 1, 9, 12)
createFood("Chicken", "4oz", 120, 0, 1, 26)
createUser("pvphat", "phat123", "Phan Van Phat", "pvphat19@apcs.fitus.edu.vn")
createUser("nhlinh", "linh123", "Nguyen Hoang Linh", "nhlinh19@apcs.fitus.edu.vn")*/

async function createFood(fName, fUnit, fCalo, fCarbs, fFat, fProtein){
    try{
        const food = await models.Food.create({
            name : fName,
            unit : fUnit,
            calories : fCalo,
            carbs : fCarbs,
            fat : fFat,
            protein : fProtein
        })
        console.log(food)
    }
    catch(e){
        console.log(e.message)
    }
}

async function createUser(uUsername, uPassword, uFullname, uEmail){
    try{
        const user = await models.User.create({
            username : uUsername,
            password : uPassword,
            fullname : uFullname,
            email : uEmail,
            userType : 0
        })
        console.log(user)
    }
    catch(e){
        console.log(e.message)
    }
}
