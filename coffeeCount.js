var CoffeeTable = new Meteor.Collection('CoffeeTable');

if (Meteor.isClient) {
  var dateString = dateTime(new Date());
  var tableSub = Meteor.subscribe('CoffeeTable', function() {
    ensureEntry(dateString);
  });

  // Returns the amount property of todays document in CoffeeTable.
  Template.main.coffees = function() {
    if (tableSub.ready()) {
      var doc = CoffeeTable.findOne({date: dateString});
      if (doc) {
        return doc.amount;
      }
    }
    return 'a currently unquantified amount of';
  };

  Template.main.events({
    // Increment todays amount by one on big button click.
    'click .coffee-button': function(e) {
      var doc = CoffeeTable.findOne({date: dateString});
      if (doc) {
        CoffeeTable.update(doc._id, {$inc: {amount: 1}});
      }
    }
  });

  // Ensures there is a document in the CoffeeTable collection for this datetime.
  function ensureEntry(dateTime) {
    if (CoffeeTable.findOne({date: dateTime})) {
      return;
    }

    CoffeeTable.insert({
      date: dateTime,
      amount: 0
    });
  }

  // Turns a new Date() object into a string formatted (ddmmyyyy).
  function dateTime(date) {
    var ensureLength = function(str) {
      if (('' + str).length < 2) {
        return '0' + str;
      }
      return str;
    };
    var day = ensureLength(date.getDate());
    var month = ensureLength(date.getUTCMonth() + 1);
    var year = date.getFullYear();
    return '' + day + month + year;
  }
}

if (Meteor.isServer) {
  // Am I one of the final five?
  var cylons = ['adamcbrewer', 'gixo', 'cheeseen', 'stevenarcher'];

  var isCylon = function() {
    var username = Meteor.user().services.github.username.toLowerCase();
    return cylons.indexOf(username) !== -1;
  };

  CoffeeTable.allow({
    insert: isCylon,
    update: isCylon
  });

  Meteor.publish('CoffeeTable', function() {
    return CoffeeTable.find({});
  });
}
