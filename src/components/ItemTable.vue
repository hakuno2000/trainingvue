<template>
  <v-data-table
      :headers="headers"
      :items="items"
      sort-by="calories"
      class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>My Items</v-toolbar-title>
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
            >New Item</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
<!--                  <v-col cols="12" sm="6" md="4">-->
<!--                    <v-text-field v-model="editedItem.id" label="ID"></v-text-field>-->
<!--                  </v-col>-->
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.categoryId" label="Category ID"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.basePrice" label="Base Price"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.sellPrice" label="Sell Price"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.description" label="Description"></v-text-field>
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
        value: 'id',
      },
      { text: 'Name', value: 'name' },
      { text: 'Base Price', value: 'basePrice' },
      { text: 'Sell Price', value: 'sellPrice' },
      { text: 'Description', value: 'description' },
      // { text: 'Shop', value: 'shop' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    items: [],
    editedIndex: -1,
    editedItem: {
      id: '',
      name: 'item name',
      categoryId: 1,
      basePrice: 3000,
      sellPrice: 3000,
      description: 'about'
    },
    defaultItem: {
      id: '',
      name: 'item name',
      categoryId: 1,
      basePrice: 3000,
      sellPrice: 3000,
      description: 'about'
    },
    postItem: {
      name: '',
      basePrice: 3000,
      sellPrice: 3000,
      description: ''
    },
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
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
      axios.get('http://localhost:9000/shop/1/items').then(response => this.items = response.data);
    },

    editItem (item) {
      this.editedIndex = item.id;
      this.editedItem = Object.assign({}, item)
      this.dialog = true
      // console.log(this.editedIndex)
      // console.log(this.editedItem.categoryId)
    },

    deleteItem (item) {
      const index = item.id;
      confirm('Are you sure you want to delete this item?') && this.items.splice(index, 1)
      axios.delete('http://localhost:9000/item/' + index + '/delete');
      this.initialize();
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save () {
      if (this.editedIndex > -1) {
        // Object.assign(this.items[this.editedIndex], this.editedItem);
        const index = this.editedItem.id;
        axios.put('http://localhost:9000/item/' + index + '/update', this.editedItem, {
          params: {
            categoryId: this.editedItem.categoryId
          }
        });
        this.initialize();
        console.log(this.editedItem)
      } else {
        // this.items.push(this.editedItem);
        const categoryId = this.editedItem.categoryId;
        this.postItem.name = this.editedItem.name;
        this.postItem.basePrice = this.editedItem.basePrice;
        this.postItem.sellPrice = this.editedItem.sellPrice;
        this.postItem.description = this.editedItem.description;
        console.log(this.postItem);
        axios.post('http://localhost:9000/category/' + categoryId + '/add', this.postItem);
        this.initialize();
      }
      this.close()
    },
  },
}
</script>
