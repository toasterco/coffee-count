var CoffeeTable = new Meteor.Collection('CoffeeTable');

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
