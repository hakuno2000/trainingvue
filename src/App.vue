<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://vuejs.org/images/logo.png"
          transition="scale-transition"
          width="40"
          @click="returnHome"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
          @click="returnHome"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
          target="_blank"
          text
          @click="showCategories"
      >
        <span>Categories</span>
      </v-btn>
      <v-btn
          target="_blank"
          text
          @click="showItems"
      >
        <span>Items</span>
      </v-btn>
      <v-btn
          target="_blank"
          text
          @click="showOrders"
      >
        <span>Orders</span>
      </v-btn>
      <v-btn
          target="_blank"
          text
          @click="showSales"
      >
        <span>Sales</span>
      </v-btn>

      <v-btn
        href="https://www.flickr.com/photos/hakuno2000/"
        target="_blank"
        text
      >
        <span class="mr-2">Info</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
<!--      <HelloWorld/>-->
      <RouterView></RouterView>
    </v-main>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',

  components: {
    // HelloWorld,
  },

  data: () => ({
    //
  }),

  methods: {
    returnHome() {
      this.$router.push('/categories/');
    },
    showCategories() {
      this.$router.push('/categories/');
    },
    showItems() {
      this.$router.push('/items/');
    },
    showOrders() {
      this.$router.push('/orders/');
    },
    showSales() {
      this.$router.push('/sale/month');
    },
  }
};
</script>
