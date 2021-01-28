<template>
  <v-card>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="items"
        :single-expand="true"
        :options.sync="options"
        :server-items-length="totalRecords"
        @update:options="getCustomers()"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Customers</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn color="primary" dark class="mb-2">EXPORT</v-btn>
          </v-toolbar>
          <v-row class="mx-1">
            <v-col md="3">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
                show-expand
                @input="onSearchInput"
                item-key="name"
              ></v-text-field>
            </v-col>
          </v-row>
        </template>
        <template v-slot:item="{ item, expand, isExpanded }">
          <tr>
            <td>
              {{ item.name }}
            </td>
            <td>
              {{ item.mobile_number }}
            </td>
            <td>
              {{ item.email }}
            </td>
            <td>
              {{ setDateTimeFormat(item.created_at) }}
            </td>
            <td>
              <div class="d-flex">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-chip
                      color="primary"
                      dark
                      v-bind="attrs"
                      v-on="on"
                      @click="expand(!isExpanded)"
                    >
                      {{ item.serial_numbers.length + " Product(s)" }}
                    </v-chip>
                  </template>
                  <span>Click To Preview Products</span>
                </v-tooltip>
              </div>
            </td>
            <td>
              <v-icon
                small
                color="secondary"
                class="mr-2"
                @click="onEditClick(item)"
              >
                mdi-pencil
              </v-icon>
            </td>
          </tr>
        </template>

        <template v-slot:expanded-item="{ item, headers }">
          <td :colspan="headers.length" v-if="item.serial_numbers.length > 0">
            <div class="ma-4"><b>Products</b></div>
            <v-simple-table dense style="margin-bottom: 30px; margin-top: 10px">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Serial No.</th>
                    <th class="text-left">Created Date</th>
                    <th class="text-left">Activated Date</th>
                    <th class="text-left">Warranty Expiry</th>
                    <th class="text-left">Product Expiry</th>
                    <th class="text-left">Status</th>
                    <!-- <th class="text-left">Actions</th> -->
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(productItem, productIndex) in item.serial_numbers"
                    :key="productIndex"
                  >
                    <td>{{ productItem.serial_no }}</td>
                    <td>{{ setDateFormat(productItem.created_at) }}</td>
                    <td>
                      {{ setDateFormat(productItem.activation_date) }}
                    </td>
                    <td>
                      <v-chip
                        :color="
                          setDateExpiryColor(productItem.warranty_expiry_date)
                        "
                      >
                        {{ setDateFormat(productItem.warranty_expiry_date) }}
                      </v-chip>
                    </td>
                    <td>
                      <v-chip
                        :color="
                          setDateExpiryColor(productItem.product_expiry_date)
                        "
                      >
                        {{ setDateFormat(productItem.product_expiry_date) }}
                      </v-chip>
                    </td>
                    <td>
                      <v-chip :color="getStatus(productItem.status).color" dark>
                        {{ getStatus(productItem.status).name }}
                      </v-chip>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </td>
        </template>
      </v-data-table>
    </v-card-text>
    <v-dialog
      v-model="isEditDialogEnabled"
      transition="dialog-bottom-transition"
      max-width="500"
    >
      <v-card>
        <v-toolbar color="primary" dark>
          Edit Customer: {{ record.name }}
        </v-toolbar>
        <v-row class="px-10 pt-6">
          <v-col md="6">
            <v-text-field
              label="Name"
              outlined
              v-model="record.name"
            ></v-text-field>
          </v-col>
          <v-col md="6">
            <v-text-field
              label="Mobile Number"
              outlined
              v-model="record.mobile_number"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-card-actions class="justify-end">
          <v-btn color="primary" @click="putEditCustomer()">Confirm</v-btn>
          <v-btn text @click="isEditDialogEnabled = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackBar.enabled" timeout="3000">
      {{ snackBar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="snackBar.enabled = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
import moment from "moment";
import axios from "axios";
export default {
  data() {
    return {
      isEditDialogEnabled: false,
      snackBar: {
        enabled: false,
        message: "",
      },
      expanded: [],
      options: {},
      totalRecords: 0,
      search: "",
      items: [],
      record: {},
      headers: [
        {
          text: "Name",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Mobile No", value: "mobile_number" },
        { text: "Email", value: "email" },
        { text: "Created Date", value: "created_at" },
        { text: "No of Products", value: "products" },
        { text: "Actions", value: "actions", sortable: false },
      ],
    };
  },
  methods: {
    setDateFormat(date) {
      return moment(date).format("DD/MM/YYYY");
    },
    setDateTimeFormat(date) {
      return moment(date).format("DD/MM/YYYY h:mm A");
    },
    setDateExpiryColor(date) {
      if (
        moment(date).isBetween(
          moment().subtract(30, "days"),
          moment().add(30, "days")
        )
      ) {
        return "red";
      } else {
        return "white";
      }
    },
    onEditClick(item) {
      this.record = item;
      this.isEditDialogEnabled = true;
    },
    putEditCustomer() {
      axios
        .put(
          process.env.VUE_APP_API_URL + "admin/customer/" + this.record.id,
          this.record
        )
        .then((response) => {
          if (response.data) {
            this.getCustomers();
            this.isEditDialogEnabled = false;
            this.record = {};
            this.snackBar.enabled = true;
            this.snackBar.message = "Successfully edited user";
          }
        })
        .catch((error) => {
          console.log(error);
          this.snackBar.enabled = true;
          this.snackBar.message = "Cannot edit customer at the moment";
        });
    },
    getStatus(id) {
      switch (id) {
        case 1:
          return {
            id: id,
            name: "New",
            color: "#4caf50",
          };
        case 2:
          return {
            id: id,
            name: "Under Warranty",
            color: "#1e88e5",
          };
        case 3:
          return {
            id: id,
            name: "Replaced",
            color: "#fb8c00",
          };
        case 4:
          return {
            id: id,
            name: "Replacement",
            color: "#fdd835",
          };
        default:
          return {
            id: id,
            name: "New",
            color: "#4caf50",
          };
      }
    },
    onSearchInput() {
      this.getCustomers();
    },
    getCustomers() {
      axios
        .get(process.env.VUE_APP_API_URL + "admin/customer", {
          params: {
            page: this.options.page,
            rows_per_page: this.options.itemsPerPage,
            search: this.search,
          },
        })
        .then((response) => {
          if (response.data) {
            this.items = response.data.data;
            this.totalRecords = response.data.meta.total;
          }
        })
        .catch((error) => {});
    },
    findUser() {
      if (this.$route.query.email) {
        this.search = this.$route.query.email;
      }
    },
  },
  created() {
    this.findUser();
    this.getCustomers();
  },
};
</script>
