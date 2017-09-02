firebase.initializeApp({
  apiKey: 'AIzaSyDMY_A5Y0PqvqxZk27gkjhe5UOjAZ1yZXs',
  authDomain: 'php-sreps.firebaseapp.com',
  databaseURL: 'https://php-sreps.firebaseio.com',
  projectId: 'php-sreps',
  storageBucket: 'php-sreps.appspot.com',
  messagingSenderId: '137723334567'
});


  });
});

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
