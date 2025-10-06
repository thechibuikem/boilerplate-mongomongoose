require("dotenv").config({ path: "./.env.local" });
const mongoose = require("mongoose");

// connect to the database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// create a schema
const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String],
});

// create a model
let Person = mongoose.model("Person", personSchema);

// create and save a person
const createAndSavePerson = (done) => {
  // create a new person
  let person1 = new Person({
    name: "David",
    age: 18,
    favoriteFoods: ["Pizza", "Burger"],
  });
  // save person1 to the database
  person1.save(function (err, data) {
    if (err) return console.error(err);
    done(null, data);
  });
};

// populate the database with an array of people
const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople)
    .then((data) => {
      done(null, data);
    })
    .catch((err) => {
      done(err);
    });
};

// find people by name
const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, function (err, data) {
    if (err) return console.error(err);
    done(null, data);
  });
};

// find one person by food
const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, function (err, data) {
    if (err) return console.error(err);
    done(null, data);
  });
};

// find person by id
const findPersonById = (personId, done) => {
  Person.findById({ _id: personId }, function (err, data) {
    if (err) return console.error(err);
    done(null, data);
  });
};

// find edit then save
const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  Person.findById(personId)
    .then((person) => {
      // throw error if person is not found
      if (!person) throw new Error("Person not found");
      // adding food to favoriteFoods array
      person.favoriteFoods.push(foodToAdd);
      return person;
    })
    .then((person) => {
      return person.save();
    })
    .then((data) => {
      done(null, data);
    })
    .catch((err) => {
      console.error(err);
      done(err);
    });
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate(
    { name: personName },
    { age: ageToSet },
    { new: true },
  )
    .then((updatedPerson) => {
      done(null, updatedPerson);
    })
    .catch((err) => {
      done(err);
    });
};
// removing one element matching an ID
const removeById = (personId, done) => {
  // Person.findByIdAndRemove(personId)
  //   .then((removedPerson) => {
  //     done(null, removedPerson);
  //   })
  //   .catch((error) => {
  //     done(error);
  //   });
  Person.findOneAndRemove({ _id: personId })
    .then((removedPerson) => {
      done(null, removedPerson);
    })
    .catch((error) => {
      done(error);
    });
};
// removing all elements matching a condition
const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({ name: nameToRemove }, function (err, data) {
    if (err) return console.error(err);
    done(null, data);
  });
};

// query chaining
const queryChain = (done) => {
  const foodToSearch = "burrito";

  Person.find({ favoriteFoods: foodToSearch })
    .sort({ name: 1 })
    .limit(2)
    .select({ age: 0 })
    .exec(function (err, data) {
      if (err) return console.error(err);
      done(null, data);
    });
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
