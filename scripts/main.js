firebase.initializeApp({
  apiKey: 'AIzaSyDMY_A5Y0PqvqxZk27gkjhe5UOjAZ1yZXs',
  authDomain: 'php-sreps.firebaseapp.com',
  databaseURL: 'https://php-sreps.firebaseio.com',
  projectId: 'php-sreps',
  storageBucket: 'php-sreps.appspot.com',
  messagingSenderId: '137723334567'
});

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

  });
});


