

///
//
firebase.initializeApp({
  apiKey: 'AIzaSyDMY_A5Y0PqvqxZk27gkjhe5UOjAZ1yZXs',
  authDomain: 'php-sreps.firebaseapp.com',
  databaseURL: 'https://php-sreps.firebaseio.com',
  projectId: 'php-sreps',
  storageBucket: 'php-sreps.appspot.com',
  messagingSenderId: '137723334567'
})

const database = firebase.database().ref()

Vue.filter('formatDate', date => {
  return date.toDateString()
})

Vue.component('record-form', {
  template: `
    <div class="uk-card uk-card-default uk-card-hover uk-card-body uk-margin-bottom">
      <form
        v-on:submit.prevent="addNewRecord"
        class="uk-form-stacked">
        <fieldset class="uk-fieldset">
          <legend class="uk-legend uk-card-title">Enter new record</legend>
          <div class="uk-margin">
            <label
              class="uk-form-label"
              for="form-title">
              Title
            </label>
            <div class="uk-form-controls">
              <input
                v-model.trim="title"
                class="uk-input uk-form-small"
                placeholder="Title"
                type="text">
            </div>
          </div>
          <div class="uk-margin">
            <label
              class="uk-form-label"
              for="form-quantity">
              Quantity
            </label>
            <div class="uk-form-controls">
              <input
                v-model.trim="quantity"
                class="uk-input uk-form-small"
                placeholder="Quantity"
                type="text">
            </div>
          </div>
          <div class="uk-margin">
            <label
              class="uk-form-label"
              for="form-quantity">
              Date
            </label>
            <div class="uk-form-controls">
              <input
                v-model.trim="date"
                class="uk-input uk-form-small"
                placeholder="Date"
                type="text">
            </div>
          </div>
        </fieldset>
        <button
          class="uk-button uk-button-primary"
          type="submit">
          Add Record
        </button>
      </form>
    </div>`,
  data: function() {
    return {
      title: null,
      quantity: null,
      date: null
    }
  },
  methods: {
    addNewRecord: function() {
      const object = {}
      const key = database.child('records').push().key
      const value = {
        title: this.title,
        quantity: +this.quantity,
        date: new Date(this.date)
      }
      object['/records/' + key] = value
      database.update(object)
      this.title = ''
      this.quantity = ''
      this.date = null
    }
  }
})

Vue.component('record-table', {
  template: `
    <div class="uk-overflow-auto">
      <table class="uk-table uk-table-divider">
        <thead>
          <tr>
            <th>Identifier</th>
            <th class="uk-width-small">Title</th>
            <th class="uk-width-small">Quantiy</th>
            <th class="uk-width-medium">Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <slot></slot>
        </tbody>
      </table>
    </div>`
})

Vue.component('record-row', {
  props: ['record'],
  template: `
    <tr>
      <template v-if="editing">
        <td>{{ record.id }}</td>
        <td>
          <input
            v-model.trim="newRecord.title"
            v-on:keyup.enter="doneEditing"
            class="uk-input uk-form-small uk-form-width-small"
            placeholder="Title"
            type="text">
        </td>
        <td>
          <input
            v-model.trim="newRecord.quantity"
            v-on:keyup.enter="doneEditing"
            class="uk-input uk-form-small uk-form-width-small"
            placeholder="Quantity"
            type="text">
        </td>
        <td>
          <input
            v-model.trim="newRecord.date"
            v-on:keyup.enter="doneEditing"
            class="uk-input uk-form-small uk-form-width-medium"
            placeholder="Date"
            type="text">
        </td>
      </template>
      <template v-else>
        <td>{{ record.id }}</td>
        <td>{{ record.title }}</td>
        <td>{{ record.quantity }}</td>
        <td>{{ record.date | formatDate }}</td>
      </template>
      <td>
        <button
          v-if="editing"
          v-on:click="endEditing"
          class="uk-button uk-button-default uk-button-small">
          Cancel
        </button>
        <div
          v-else
          class="uk-button-group">
          <button
            v-on:click="beginEditing"
            class="uk-button uk-button-secondary uk-button-small">
            Edit
          </button>
          <button
            v-on:click="remove"
            class="uk-button uk-button-danger uk-button-small">
            Remove
          </button>
        </div>
      </td>
    </tr>`,
  data: function() {
    return {
      editing: false,
      newRecord: {
        id: this.record.id,
        title: this.record.title,
        quantity: this.record.quantity,
        date: this.record.date
      }
    }
  },
  methods: {
    beginEditing: function() {
      this.editing = true
    },
    endEditing: function() {
      this.editing = false
      this.newRecord = {
        id: this.record.id,
        title: this.record.title,
        quantity: this.record.quantity,
        date: this.record.date
      }
    },
    doneEditing: function() {
      this.editing = false
      this.newRecord = {
        id: this.newRecord.id,
        title: this.newRecord.title,
        quantity: +this.newRecord.quantity,
        date: new Date(this.newRecord.date)
      }
      database.child('records/' + this.newRecord.id).update({
        title: this.newRecord.title,
        quantity: this.newRecord.quantity,
        date: this.newRecord.date
      })
    },
    remove: function() {
      database.child('records/' + this.record.id).remove()
    }
  }
})

Vue.component('report-form', {
  props: ['reports'],
  template: `
    <div class="uk-card uk-card-default uk-card-hover uk-card-body uk-margin-bottom">
      <h3 class="uk-card-title">Summary Report</h3>
      <table class="uk-table uk-table-small uk-table-divider">
        <tbody>
          <tr v-for="report in reports">
            <td class="uk-text-left">{{ report.title }}</td>
            <td class="uk-text-right">{{ report.quantity }}</td>
          </tr>
        </tbody>
      </table>
    </div>`
})

const vm = new Vue({
  el: '#vue',
  data: {
    records: [],
    reports: []
  }
})

database.child('records').on('value', snapshot => {
  if (snapshot.val() !== null) {
    const object = snapshot.val()
    vm.records = Object.keys(object).map(key => {
      const record = object[key]
      record.quantity = +record.quantity
      record.date = new Date(record.date)
      record.id = key
      return record
    })
  }
  else {
    vm.records = []
  }
})

database.child('reports').on('value', snapshot => {
  if (snapshot.val() !== null) {
    const object = snapshot.val()
    vm.reports = Object.keys(object).map(key => {
      const report = {}
      report.quantity = +object[key]
      report.title = key
      return report
    })
  }
  else {
    vm.reports = []
  }
})
