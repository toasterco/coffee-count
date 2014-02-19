var CoffeeTable = new Meteor.Collection('CoffeeTable');

if (Meteor.isClient) {
  var ReactiveDate = function() {
    this.date = new Date();
    this.dep = new Deps.Dependency();
  };

  ReactiveDate.prototype.init = function() {
    var self = this;
    Meteor.setInterval(function() {
      self.date = new Date();
      self.dep.changed();
    }, 10000);
  };

  ReactiveDate.prototype.get = function() {
    this.dep.depend();
    return this.date;
  };

  var date = new ReactiveDate();
  date.init();

  var tableSub = Meteor.subscribe('CoffeeTable', function() {
    ensureEntry(dateTime(date.get()));
  });

  // Returns the amount property of todays document in CoffeeTable.
  Template.main.coffees = function() {
    if (tableSub.ready()) {
      var doc = CoffeeTable.findOne({date: dateTime(date.get())});
      if (doc) {
        return doc.amount || "no";
      }
    }
    return 'an unquantified amount of';
  };

  Template.main.events({
    // Increment todays amount by one on big button click.
    'click .coffee-button': function(e) {
      var doc = CoffeeTable.findOne({date: dateTime(date.get())});
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