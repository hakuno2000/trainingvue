<template>
  <v-data-table
      :headers="headers"
      :items="payments"
      sort-by="calories"
      class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Payment for order {{ $route.params.id }}</v-toolbar-title>
        <v-divider
            class="mx-4"
            inset
            vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
<!--          <template v-slot:activator="{ on, attrs }">-->
<!--            <v-btn-->
<!--                color="primary"-->
<!--                dark-->
<!--                class="mb-2"-->
<!--                v-bind="attrs"-->
<!--                v-on="on"-->
<!--            >New Category</v-btn>-->
<!--          </template>-->
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
<!--                  <v-col cols="12" sm="6" md="4">-->
<!--                    <v-text-field v-model="editedPayment.id" label="ID"></v-text-field>-->
<!--                  </v-col>-->
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedPayment.cash" label="Cash"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedPayment.credit" label="Credit"></v-text-field>
                  </v-col>
                  <!--                  <v-col cols="12" sm="6" md="4">-->
                  <!--                    <v-text-field v-model="editedItem.shop" label="Shop"></v-text-field>-->
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
      { text: 'Base Price', value: 'basePrice' },
      { text: 'Sell Price', value: 'sellPrice' },
      { text: 'Cash', value: 'cash' },
      { text: 'Credit', value: 'credit' },
      // { text: 'Shop', value: 'shop' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    payments: [],
    editedIndex: -1,
    editedPayment: {
      id: '',
      cash: 0,
      credit: 0,
      // shop: 0,
    },
    defaultPayment: {
      id: '',
      cash: 0,
      credit: 0,
      // shop: 0,
    },
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Category' : 'Edit Category'
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
      axios.get('http://localhost:9000/payment/' + this.$route.params.id).then(response => this.payments = response.data);
    },

    editItem (item) {
      this.editedIndex = this.payments.indexOf(item)
      this.editedPayment = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = item.id;
      confirm('Are you sure you want to delete this item?') && this.payments.splice(index, 1)
      axios.delete('http://localhost:9000/category/' + index + '/delete');
      this.initialize();
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedPayment = Object.assign({}, this.defaultPayment)
        this.editedIndex = -1
      })
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.payments[this.editedIndex], this.editedPayment)
        axios.put('http://localhost:9000/payment/' + this.$route.params.id, null, {
          params: {
            cash: this.editedPayment.cash,
            credit: this.editedPayment.credit
          }
        });
        this.initialize();
      } else {
        axios.post('http://localhost:9000/shop/1/categories/add', this.editedPayment);
        // this.categories.push(this.editedCategory)
        this.initialize();
      }
      this.close()
    },
  },
}
</script>
