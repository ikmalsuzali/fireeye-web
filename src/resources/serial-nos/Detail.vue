<template>
  <div>
    <v-card class="mx-auto">
      <v-toolbar>
        <v-toolbar-title>
          {{ "title" }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn class="mx-4">Replace</v-btn>
        <v-btn color="red">Delete</v-btn>
      </v-toolbar>
      <v-container fluid>
        <v-row>
          <v-col md="8">
            <div>
              <div><b>Serial No</b></div>
              <div class="h2">{{ item.serial_no }}</div>
            </div>
            <div>
              <div><b>Customer</b></div>
            </div>
          </v-col>
          <v-col md="4">
            <div style="text-align: end">
              <div>
                Creation:
                <b>
                  {{
                    item.created_at
                      ? setDateFormat(item.created_at)
                      : "Not Available"
                  }}
                </b>
              </div>
              <div>
                Activation:
                <b>
                  {{
                    item.activated_date
                      ? setDateFormat(item.activated_date)
                      : "Not Available"
                  }}
                </b>
              </div>
              <div>
                Warranty Expiry:
                <b>
                  {{
                    item.warranty_expiry_date
                      ? setDateFormat(item.warranty_expiry_date)
                      : "Not Available"
                  }}
                </b>
              </div>
              <div>
                Product Expiry:
                <b>
                  {{
                    item.product_expiry_date
                      ? setDateFormat(item.product_expiry_date)
                      : "Not Available"
                  }}
                </b>
              </div>
              <div>
                Replacement:
                <b>
                  {{
                    item.replacement_date
                      ? setDateFormat(item.replacement_date)
                      : "Not Available"
                  }}
                </b>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  data() {
    return {
      recordId: this.$route.params.id,
      item: {},
    };
  },

  methods: {
    setDateFormat(date) {
      return moment(date).format("DD/MM/YYYY");
    },
    getSerialNo() {
      axios
        .get(
          process.env.VUE_APP_API_URL + "admin/serial-number/" + this.recordId
        )
        .then((response) => {
          if (response.data) {
            this.item = response.data.data;
          }
        })
        .catch((error) => {});
    },
  },
  created() {
    this.getSerialNo();
  },
};
</script>
