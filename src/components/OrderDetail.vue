<template>
  <v-data-table
      :headers="headers"
      :items="orderDetails"
      sort-by="id"
      class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Detail of order {{ $route.params.id }}</v-toolbar-title>
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
            @click="payOrder"
        >Pay Order</v-btn>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
            >Order Item</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedOrderDetail.id" label="ID"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
<!--                    <v-text-field v-model="editedOrderDetail.itemId" label="Item ID"></v-text-field>-->
                    <v-select
                        v-model="selectedItem"
                        :items="items"
                        :rules="[v => !!v || 'Item is required']"
                        item-text="name"
                        item-value="id"
                        label="Item"
                        required
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedOrderDetail.quantity" label="Quantity"></v-text-field>
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
<!--      <v-icon-->
<!--          small-->
<!--          class="mr-2"-->
<!--          @click="editItem(item)"-->
<!--      >-->
<!--        mdi-pencil-->
<!--      </v-icon>-->
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
      { text: 'Item', value: 'items.name' },
      { text: 'Price', value: 'items.sellPrice' },
      { text: 'Quantity', value: 'quantity' },
      // { text: 'Shop', value: 'shop' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    orderDetails: [],
    items: [],
    selectedItem: null,
    editedIndex: -1,
    editedOrderDetail: {
      id: '',
      itemId: 0,
      quantity: 0,
      // shop: 0,
    },
    defaultOrderDetail: {
      id: '',
      itemId: 0,
      quantity: 0,
      // shop: 0,
    },
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Select Item' : 'Edit Order'
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
      axios.get('http://localhost:9000/order/' + this.$route.params.id).then(response => this.orderDetails = response.data.orderDetails);
      axios.get('http://localhost:9000/shop/1/items').then(response => this.items = response.data);
      // console.log(this.orderDetails);
    },

    editItem (item) {
      this.editedIndex = this.orderDetails.indexOf(item)
      this.editedOrderDetail = Object.assign({}, item)
      this.dialog = true
      this.editedOrderDetail.itemId = this.selectedItem
    },

    deleteItem (item) {
      const index = item.id;
      confirm('Are you sure you want to delete this item?') && this.orderDetails.splice(index, 1)
      axios.delete('http://localhost:9000/order/detail/' + index + '/delete');
      this.initialize();
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedOrderDetail = Object.assign({}, this.defaultOrderDetail)
        this.editedIndex = -1
      })
    },

    save () {
      this.editedOrderDetail.itemId = this.selectedItem
      if (this.editedIndex > -1) {
        // Object.assign(this.orderDetails[this.editedIndex], this.editedOrderDetail)
        // const index = this.editedOrderDetail.id;
        // axios.put('http://localhost:9000/category/' + index + '/update', this.editedOrderDetail);
        // this.initialize();
      } else {
        axios.post('http://localhost:9000/order/detail/create/', null, {
          params: {
            orderId: this.$route.params.id,
            itemId: this.editedOrderDetail.itemId,
            quantity: this.editedOrderDetail.quantity
          }
        });
        // this.categories.push(this.editedCategory)
        this.initialize();
      }
      this.close()
    },

    payOrder() {
      axios.put('http://localhost:9000/payment/' + this.$route.params.id, null, {
        params: {
          cash: 0,
          credit: 0
        }
      });
      this.$router.push('/payments/' + this.$route.params.id);
    }
  },
}
</script>
