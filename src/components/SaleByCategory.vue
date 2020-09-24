<template>
  <v-data-table
      :headers="headers"
      :items="sales"
      sort-by="id"
      class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Show Sales</v-toolbar-title>
        <v-divider
            class="mx-4"
            inset
            vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-btn
            color="primary"
            dark
            class="mb-2"
            @click="saleByMonth"
        >Sale by Month</v-btn>
        <v-btn
            color="primary"
            dark
            class="mb-2"
            @click="saleByItem"
        >Sale by Item</v-btn>
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
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedSale.id" label="ID"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedSale.name" label="Name"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedSale.description" label="Description"></v-text-field>
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
      <v-icon
          small
          @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
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
        value: 'category.id',
      },
      { text: 'Category', value: 'category.name' },
      { text: 'Quantity', value: 'quantity' },
      { text: 'BasePrice', value: 'basePrice' },
      { text: 'SellPrice', value: 'sellPrice' },
      { text: 'Investment', value: 'investment' },
      { text: 'Profit', value: 'profit' },
      // { text: 'Actions', value: 'actions', sortable: false },
    ],
    sales: [],
    editedIndex: -1,
    editedSale: {
      "transaction": 0,
      "quantity": 0,
      "basePrice": 0,
      "sellPrice": 0,
      "cash": 0,
      "credit": 0,
      "investment": 0,
      "profit": 0,
      "date": "2020-09-03",
    },
    defaultSales: {
      "transaction": 0,
      "quantity": 0,
      "basePrice": 0,
      "sellPrice": 0,
      "cash": 0,
      "credit": 0,
      "investment": 0,
      "profit": 0,
      "date": "2020-09-03",
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
      axios.get('http://localhost:9000/sale/category').then(response => this.sales = response.data);
    },

    editItem (item) {
      this.editedIndex = this.sales.indexOf(item)
      this.editedSale = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = item.id;
      confirm('Are you sure you want to delete this item?') && this.sales.splice(index, 1)
      // axios.delete('http://localhost:9000/category/' + index + '/delete');
      this.initialize();
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedSale = Object.assign({}, this.defaultSales)
        this.editedIndex = -1
      })
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.sales[this.editedIndex], this.editedSale)
        // const index = this.editedCategory.id;
        // axios.put('http://localhost:9000/category/' + index + '/update', this.editedCategory);
        this.initialize();
      } else {
        // axios.post('http://localhost:9000/shop/1/categories/add', this.editedCategory);
        // this.categories.push(this.editedCategory)
        this.initialize();
      }
      this.close()
    },

    saleByMonth() {
      this.$router.push('/sale/month');
    },
    saleByItem() {
      this.$router.push('/sale/item');
    }
  },
}
</script>
