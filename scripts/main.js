
//Explan the following statements OK?
firebase.initializeApp({
  apiKey: 'AIzaSyDMY_A5Y0PqvqxZk27gkjhe5UOjAZ1yZXs',
  authDomain: 'php-sreps.firebaseapp.com',
  databaseURL: 'https://php-sreps.firebaseio.com',
  projectId: 'php-sreps',
  storageBucket: 'php-sreps.appspot.com',
  messagingSenderId: '137723334567'
});

//explain this code below...
const database = firebase.database().ref();

database.child('records').on('value', snapshot => {
  const array = $.map(snapshot.val(), value => { return value; });
  const table = $('table'); $('tbody').remove();
  const tbody = $('<tbody/>').appendTo(table);
  $.each(array, i => {
    const tr = $('<tr/>').appendTo(tbody);
    const item = $('<td/>').addClass('mdl-data-table__cell--non-numeric').text(array[i].item).appendTo(tr);
    const quantity = $('<td/>').text(array[i].quantity).appendTo(tr);
    const date = $('<td/>').text(array[i].date).appendTo(tr);
    
    
 //Explan the following statements OK?   
$(document).ready(() => {
  $('form').on('submit', event => {
    const item = $('#item');
    const quantity = $('#quantity');
    const date = new Date();
    const record = { item: item.val(), quantity: quantity.val(), date: date };
    const recordKey = database.child('records').push().key;
    const updates = {}; updates['/records/' + recordKey] = record;
    database.update(updates);
    quantity.val('');
    item.val('');
  });
});
  });
});


