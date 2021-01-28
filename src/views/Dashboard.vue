<template>
  <v-row>
    <v-col lg="4">
      <v-card class="mx-auto">
        <v-list-item three-line>
          <v-list-item-content>
            <div class="overline mb-4">TOTAL SERIAL NO(S)</div>
            <v-list-item-title class="headline mb-1">
              {{ item.serial_no_total }}
            </v-list-item-title>
            <v-list-item-subtitle>
              View all the serial no(s)
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-avatar tile size="30">
            <v-icon x-large color="primary">
              mdi-card-bulleted-settings-outline
            </v-icon>
          </v-list-item-avatar>
        </v-list-item>
        <v-card-actions>
          <v-btn outlined rounded text to="/admin/serial-no">VIEW MORE</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col lg="4">
      <v-card class="mx-auto">
        <v-list-item three-line>
          <v-list-item-content>
            <div class="overline mb-4">NEW SERIAL NO(S)</div>
            <v-list-item-title class="headline mb-1">
              {{ item.serial_no_new_total }}
            </v-list-item-title>
            <v-list-item-subtitle>
              View all the new serial no(s)
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-avatar tile size="30">
            <v-icon x-large color="primary">
              mdi-card-bulleted-settings-outline
            </v-icon>
          </v-list-item-avatar>
        </v-list-item>
        <v-card-actions>
          <v-btn outlined rounded text to="/admin/serial-no?status=1">
            VIEW MORE
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col lg="4">
      <v-card class="mx-auto">
        <v-list-item three-line>
          <v-list-item-content>
            <div class="overline mb-4">REPLACEMENT SERIAL NO(S)</div>
            <v-list-item-title class="headline mb-1">
              {{ item.serial_no_replacement_total }}
            </v-list-item-title>
            <v-list-item-subtitle>
              View all the replacement serial no(s)
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-avatar tile size="30">
            <v-icon x-large color="primary">
              mdi-card-bulleted-settings-outline
            </v-icon>
          </v-list-item-avatar>
        </v-list-item>
        <v-card-actions>
          <v-btn outlined rounded text to="/admin/serial-no?status=3">
            VIEW MORE
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col lg="12">
      <v-card class="mx-auto">
        <v-list-item three-line>
          <v-list-item-content>
            <div class="overline mb-4">TOTAL CUSTOMERS</div>
            <v-list-item-title class="headline mb-1">
              {{ item.customer_total }}
            </v-list-item-title>
            <v-list-item-subtitle>
              View all the customer(s)
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-avatar tile size="30">
            <v-icon x-large color="primary">mdi-account</v-icon>
          </v-list-item-avatar>
        </v-list-item>
        <v-card-actions>
          <v-btn outlined rounded text to="/admin/customer">VIEW MORE</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      item: {},
    };
  },
  methods: {
    getDashboardItems() {
      this.$http
        .get("admin/dashboard")
        .then((response) => {
          if (response.data) {
            this.item = response.data.data;
          }
        })
        .catch((error) => {});
    },
  },
  mounted() {
    this.getDashboardItems();
  },
};
</script>

<style lang="sass"></style>
