<template>
  <v-data-table
      :headers="headers"
      :items="orders"
      sort-by="id"
      class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>All Orders</v-toolbar-title>
        <v-divider
            class="mx-4"
            inset
            vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
            >New Order</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
<!--                  <v-col cols="12" sm="6" md="4">-->
<!--                    <v-text-field v-model="editedOrder.id" label="ID"></v-text-field>-->
<!--                  </v-col>-->
<!--                  <v-col cols="12" sm="6" md="4">-->
                    <v-date-picker v-model="editedOrder.date" label="Date"></v-date-picker>
<!--                  </v-col>-->
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
<!--      <v-icon-->
<!--          small-->
<!--          @click="deleteItem(item)"-->
<!--      >-->
<!--        mdi-delete-->
<!--      </v-icon>-->
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
  </v-data-table>
</template>

<script>
import axios from 'axios';
export default {
  data: () => ({
    dialog: false,
    headers: [
      {
        text: 'ID',
        align: 'start',
        sortable: true,
        value: 'id',
      },
      { text: 'Date', value: 'date' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    orders: [],
    editedIndex: -1,
    editedOrder: {
      id: '',
      date: '2020-09-03',
      // shop: 0,
    },
    defaultCategory: {
      id: '',
      date: '2020-09-03',
      // shop: 0,
    },
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Order' : 'Edit Order'
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
  },

  created () {
    this.initialize()
  },

  methods: {
    initialize () {
      axios.get('http://localhost:9000/order').then(response => this.orders = response.data);
    },

    editItem (item) {
      this.editedIndex = this.orders.indexOf(item)
      this.editedOrder = Object.assign({}, item)
      this.dialog = true

      const index = this.editedOrder.id;
      this.$router.push('/orderdetails/' + index);
    },

    deleteItem (item) {
      const index = item.id;
      confirm('Are you sure you want to delete this item?') && this.orders.splice(index, 1)
      // axios.delete('http://localhost:9000/category/' + index + '/delete');
      this.initialize();
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedOrder = Object.assign({}, this.defaultCategory)
        this.editedIndex = -1
      })
    },

    save () {
      if (this.editedIndex > -1) {
        // Object.assign(this.orders[this.editedIndex], this.editedOrder)
        // axios.put('http://localhost:9000/order/1/create', this.editedOrder);
        this.initialize();
      } else {
        console.log(this.editedOrder)
        axios.post('http://localhost:9000/order/1/create', this.editedOrder);
        this.initialize();
      }
      this.close()
    },
  },
}
</script>
