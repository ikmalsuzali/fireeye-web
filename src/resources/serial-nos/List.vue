<template>
  <div>
    <v-card>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="items"
          :options.sync="options"
          :server-items-length="totalRecords"
          @update:options="getSerialNos()"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Serial Numbers</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-btn
                v-if="
                  $store.getters.getUserRole == 'admin' ||
                  $store.getters.getUserRole == 'moderator'
                "
                color="primary"
                dark
                class="mb-2 mr-2"
                @click="onGenerateClick()"
              >
                GENERATE
              </v-btn>
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
                  @input="onSearchInput"
                ></v-text-field>
              </v-col>
              <v-col md="9" style="text-align: right">
                <v-menu open-on-hover bottom offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      outlined
                      dark
                      v-bind="attrs"
                      v-on="on"
                      style="margin-top: 10px"
                    >
                      {{ selectedStatus.title }}
                      <v-icon right dark>mdi-filter</v-icon>
                    </v-btn>
                  </template>

                  <v-list>
                    <v-list-item
                      v-for="(item, index) in statusItems"
                      :key="index"
                      @click="
                        selectedStatus = item;
                        getSerialNos();
                      "
                    >
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>
          </template>
          <template v-slot:[`item.customer`]="{ item }">
            <v-tooltip bottom v-if="getValue(item.customer, 'email')">
              <template v-slot:activator="{ on, attrs }">
                <v-chip
                  :color="item.customer ? 'primary' : 'red'"
                  dark
                  v-bind="attrs"
                  v-on="on"
                  :to="'/admin/customer?email=' + item.customer.email"
                >
                  {{ item.customer ? item.customer.name : "No Customer" }}
                </v-chip>
              </template>
              <span>Click To Go To Customer</span>
            </v-tooltip>
          </template>
          <template v-slot:[`item.created_at`]="{ item }">
            {{
              item.created_at ? setDateFormat(item.created_at) : "Not Available"
            }}
          </template>
          <template v-slot:[`item.activation_date`]="{ item }">
            {{
              item.activation_date
                ? setDateFormat(item.activation_date)
                : "Not Available"
            }}
          </template>
          <template v-slot:[`item.warranty_expiry_date`]="{ item }">
            <v-chip :color="setDateExpiryColor(item.warranty_expiry_date)">
              {{
                item.warranty_expiry_date
                  ? setDateFormat(item.warranty_expiry_date)
                  : "Not Available"
              }}
            </v-chip>
          </template>
          <template v-slot:[`item.product_expiry_date`]="{ item }">
            <v-chip :color="setDateExpiryColor(item.product_expiry_date)">
              {{
                item.product_expiry_date
                  ? setDateFormat(item.product_expiry_date)
                  : "Not Available"
              }}
            </v-chip>
          </template>
          <template v-slot:[`item.status`]="{ item }">
            <v-chip :color="getStatus(item.status).color" dark>
              {{ getStatus(item.status).name }}
            </v-chip>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-if="
                    item.status == 2 &&
                    ($store.getters.getUserRole == 'admin' ||
                      $store.getters.getUserRole == 'moderator')
                  "
                  small
                  color="secondary"
                  class="mr-2"
                  @click="onReplaceClick(item)"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-cached
                </v-icon>
              </template>
              <span>Replace Product</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-if="
                    item.status == 1 && $store.getters.getUserRole == 'admin'
                  "
                  small
                  color="red"
                  class="mr-2"
                  @click="onDeleteClick(item)"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-delete
                </v-icon>
              </template>
              <span>Delete</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-if="item.status == 1"
                  small
                  color="secondary"
                  class="mr-2"
                  @click="onViewQrCode(item)"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-qrcode
                </v-icon>
              </template>
              <span>View Qr Code</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog
      v-model="isReplacementDialogEnabled"
      transition="dialog-bottom-transition"
      max-width="600"
    >
      <v-card>
        <v-toolbar color="primary" dark>
          Replace Item: {{ selectedReplacementItem.serial_no }}
        </v-toolbar>
        <v-card-text>
          <div class="text-h6 py-2">Select a replacement serial number</div>
        </v-card-text>
        <v-autocomplete
          class="px-10"
          :items="serialNolookupItems"
          v-model="selectedReplacedItem"
          dense
          filled
          rounded
          item-text="serial_no"
          return-object
        ></v-autocomplete>
        <v-card-actions class="justify-end">
          <v-btn color="primary" @click="onConfirmReplacementClick()">
            Confirm
          </v-btn>
          <v-btn text @click="isReplacementDialogEnabled = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="isDeleteDialogEnabled"
      transition="dialog-bottom-transition"
      max-width="600"
    >
      <v-card>
        <v-toolbar color="primary" dark>
          Delete Item: {{ selectedDeletedItem.serial_no }}
        </v-toolbar>
        <v-card-text>
          <div class="text-h6 py-2">
            Are you sure you want to delete the serial no?
          </div>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn color="primary" @click="onConfirmDeleteClick()">Confirm</v-btn>
          <v-btn text @click="isDeleteDialogEnabled = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="isGenerateDialogEnabled"
      transition="dialog-bottom-transition"
      max-width="1000"
    >
      <v-card>
        <v-toolbar color="primary" dark>Generate Serial Number(s)</v-toolbar>
        <v-row class="px-10 pt-6">
          <v-col md="2">
            <v-text-field
              label="Product Code"
              outlined
              v-model="generateRecord.product_code"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              label="Year Manufactured"
              outlined
              type="number"
              :counter="2"
              v-model="generateRecord.manufacturing_year"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              label="Serial Number"
              outlined
              value="System Generated"
              readonly
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              label="Index"
              outlined
              value="System Generated"
              readonly
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="px-10">
          <v-col md="3" class="ml-auto">
            <v-text-field
              label="Generate Amount"
              type="Number"
              filled
              v-model="generateRecord.generation_amount"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-card-actions class="justify-end">
          <v-btn color="primary" @click="postGenerateSerialNo()">Confirm</v-btn>
          <v-btn text @click="isGenerateDialogEnabled = false">Close</v-btn>
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
  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
import get from "get-value";
export default {
  data() {
    return {
      options: {},
      search: "",
      selectedStatus: { title: "All", value: null },
      statusItems: [
        { title: "All", value: null },
        { title: "New", value: 1 },
        { title: "Under Warranty", value: 2 },
        { title: "Replaced", value: 3 },
        { title: "Replacement", value: 4 },
      ],
      snackBar: {
        enabled: false,
        message: "",
      },
      totalRecords: 0,
      generateRecord: {
        manufacturing_year: moment().format("YY"),
        generation_amount: 1,
        product_code: "",
      },
      defaultGenerateRecord: {
        manufacturing_year: moment().format("YY"),
        generation_amount: 1,
        product_code: "",
      },
      isGenerateDialogEnabled: false,
      isReplacementDialogEnabled: false,
      isDeleteDialogEnabled: false,
      selectedDeletedItem: {},
      selectedReplacementItem: {},
      selectedReplacedItem: {},
      serialNolookupItems: [],
      items: [],
      headers: [
        {
          text: "Serial No.",
          align: "start",
          sortable: false,
          value: "serial_no",
        },
        { text: "Created Date", value: "created_at" },
        { text: "Activate Date", value: "activation_date" },
        { text: "Warranty Expiry", value: "warranty_expiry_date" },
        { text: "Product Expiry", value: "product_expiry_date" },
        {
          text: "Customer",
          value: "customer",
          align: "center",
          sortable: false,
        },
        { text: "Status", value: "status", sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
    };
  },

  methods: {
    getValue(resource, key) {
      return get(resource, key);
    },
    onSearchInput() {
      this.getSerialNos();
    },
    setDateFormat(date) {
      return moment(date).format("DD/MM/YYYY");
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
    postReplacementSerialNo() {
      axios
        .post(
          process.env.VUE_APP_API_URL +
            `admin/replace/${this.selectedReplacementItem.id}/replacement/${this.selectedReplacedItem.id}`
        )
        .then((response) => {
          console.log(response);
          this.snackBar.enabled = true;
          this.snackBar.message = "Successfully replaced serial no";
          this.selectedReplacementItem = {};
          this.selectedReplacedItem = {};
          this.getSerialNos();
          this.isReplacementDialogEnabled = false;
        })
        .catch((error) => {
          this.snackBar.enabled = true;
          this.snackBar.message = "Cannot replace serial no at the moment";
        });
    },
    deleteSerialNo() {
      axios
        .delete(
          process.env.VUE_APP_API_URL +
            "admin/serial-number/" +
            this.selectedDeletedItem.id
        )
        .then((response) => {
          if (response.data) {
            this.snackBar.enabled = true;
            this.snackBar.message = "Successfully deleted serial no";
            this.selectedDeletedItem = {};
            this.getSerialNos();
            this.isDeleteDialogEnabled = false;
          }
        })
        .catch((error) => {});
    },
    getSerialNos() {
      axios
        .get(process.env.VUE_APP_API_URL + "admin/serial-number", {
          params: {
            page: this.options.page,
            rows_per_page: this.options.itemsPerPage,
            search: this.search,
            status: this.selectedStatus.value,
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
    getSerialNoLookup() {
      axios
        .get(process.env.VUE_APP_API_URL + "lookup/serial-number", {
          params: {
            status: 1,
          },
        })
        .then((response) => {
          if (response.data) {
            this.serialNolookupItems = response.data.data;
          }
        })
        .catch((error) => {});
    },
    postGenerateSerialNo() {
      axios
        .post(
          process.env.VUE_APP_API_URL + "admin/generate/serial-number",
          this.generateRecord
        )
        .then((response) => {
          if (response.data) {
            this.generateRecord = this.defaultGenerateRecord;
            this.getSerialNos();
            this.getSerialNoLookup();
            this.isGenerateDialogEnabled = false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getStatus(id) {
      switch (id) {
        case 1:
          return {
            id: 1,
            name: "New",
            color: "#4caf50",
          };

        case 2:
          return {
            id: 2,
            name: "Under Warranty",
            color: "#1e88e5",
          };
        case 3:
          return {
            id: 3,
            name: "Replaced",
            color: "#fb8c00",
          };
        case 4:
          return {
            id: 4,
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
    onViewClick(item) {
      if (item.id) {
        console.log(item.id);
        this.$router
          .push({
            name: "serial-no.detail",
            params: { id: item.id },
          })
          .catch(() => {});
      }
    },
    onGenerateClick() {
      this.isGenerateDialogEnabled = true;
    },

    onReplaceClick(item) {
      this.selectedReplacementItem = item;
      this.isReplacementDialogEnabled = true;
    },
    onDeleteClick(item) {
      this.selectedDeletedItem = item;
      this.isDeleteDialogEnabled = true;
    },
    onConfirmDeleteClick() {
      this.deleteSerialNo();
    },
    onConfirmReplacementClick() {
      this.postReplacementSerialNo();
    },
    onViewQrCode(item) {
      window.open(item.qr_code_url, "_blank");
    },
    findStatus() {
      if (this.$route.query.status) {
        this.selectedStatus = this.statusItems.find((item) => {
          if (this.$route.query.status == item.value) {
            return item;
          }
        });
      }
    },
  },
  created() {
    this.findStatus();
    this.getSerialNos();
    this.getSerialNoLookup();
  },
};
</script>
