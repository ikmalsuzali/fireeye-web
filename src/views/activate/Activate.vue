<template>
  <div>
    <v-app>
      <v-container>
        <v-row>
          <v-col style="height: 100vh">
            <v-card max-width="500" style="margin: auto">
              <div class="ma-6">
                <h2 class="text-center">Activate Warranty</h2>
                <div style="margin: 10px">
                  Thank you for purchasing FIRE EYE product. Please fill out the
                  followings to enjoy the warranty (2 years) and product
                  liability insurance coverage.
                </div>
                <v-text-field
                  label="Name"
                  placeholder="Fill in your name"
                  counter="24"
                  prepend-icon="mdi-map-marker"
                  v-model="record.name"
                ></v-text-field>
                <v-text-field
                  label="Mobile"
                  placeholder="Fill in your mobile number"
                  prefix="+60"
                  prepend-icon="mdi-phone"
                  v-model="record.mobile_number"
                ></v-text-field>
                <v-text-field
                  label="Email"
                  placeholder="Fill in your email"
                  prepend-icon="mdi-email"
                  v-model="record.email"
                ></v-text-field>
                <div><b>Serial Number</b></div>
                <div
                  v-for="(serialNo, index) in record.serial_nos"
                  :key="index"
                  class="d-flex"
                >
                  <v-icon
                    v-if="serialNo.enabled"
                    color="green"
                    @click="onDeleteSerialNo(index)"
                  >
                    mdi-check
                  </v-icon>
                  <v-icon
                    v-if="
                      !serialNo.enabled &&
                      serialNo.serial_no &&
                      serialNo.serial_no.length > 8
                    "
                    color="red"
                    @click="onDeleteSerialNo(index)"
                  >
                    mdi-close
                  </v-icon>
                  <v-text-field
                    label="Serial No."
                    placeholder="Fill in your serial number"
                    :prefix="'Item ' + (index + 1).toString() + ': '"
                    v-model="serialNo.serial_no"
                    @blur="checkValidSerialNo()"
                  ></v-text-field>
                  <v-icon color="red" @click="onDeleteSerialNo(index)">
                    mdi-delete
                  </v-icon>
                </div>
                <v-btn class="mb-2" block small @click="onAddMoreSerialClick">
                  Add more serial numbers
                </v-btn>
                <v-divider color="grey" class="my-4"></v-divider>
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  block
                  small
                  @click="validateVerification()"
                >
                  GET VERIFICATION CODE
                </v-btn>
                <div>
                  An verification code has been sent to your mobile/email
                  address. Please enter the 6 digits code. Click Resend if you
                  have not receive it.
                </div>
                <v-text-field
                  label="Verification Code"
                  placeholder="Fill in your verification code"
                  counter="6"
                  v-model="record.verification_code"
                ></v-text-field>
                <div class="pb-5">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    block
                    small
                    @click="postConfirmVerification()"
                  >
                    CONFIRM ACTIVATION CODE
                  </v-btn>
                  <v-btn color="grey" class="mb-2" block small>
                    NEED HELP?
                  </v-btn>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
    <v-dialog
      v-model="isActivationTypeDialog"
      transition="dialog-bottom-transition"
      max-width="600"
    >
      <v-card>
        <v-toolbar color="primary" dark>Send By SMS Or Email</v-toolbar>
        <div class="pa-4">
          <v-btn block color="primary" @click="postVerification(1)">SMS</v-btn>
          <v-btn
            class="my-2"
            block
            color="primary"
            @click="postVerification(0)"
          >
            Email
          </v-btn>
        </div>

        <v-card-actions class="justify-end">
          <v-btn text @click="isActivationTypeDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="isErrorDialog"
      transition="dialog-bottom-transition"
      max-width="600"
    >
      <v-card>
        <v-toolbar color="primary" dark>Error</v-toolbar>
        <div class="pa-4">
          <div v-for="(item, index) in errorMessages" :key="index">
            <div>{{ item.name }}</div>
          </div>
        </div>

        <v-card-actions class="justify-end">
          <v-btn text @click="isErrorDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="isSuccessDialog"
      transition="dialog-bottom-transition"
      max-width="600"
    >
      <v-card>
        <v-toolbar color="primary" dark>Activation Completed</v-toolbar>
        <div class="pa-4">
          <div>
            The activation of product(s) are confirmed and now under warranty.
          </div>
        </div>
        <v-card-actions class="justify-end">
          <v-btn text @click="isSuccessDialog = false">Close</v-btn>
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
import axios from "axios";

export default {
  data() {
    return {
      isSuccessDialog: false,
      isActivationTypeDialog: false,
      isErrorDialog: false,
      snackBar: {
        enabled: false,
        message: "",
      },
      record: {
        name: "",
        mobile_number: "",
        email: "",
        serial_nos: [{ enabled: false, serial_no: null }],
        verification_code: "",
      },
      serialNolookupItems: [],
      errorMessages: [],
    };
  },
  methods: {
    onAddMoreSerialClick() {
      this.checkValidSerialNo();
      this.record.serial_nos.push({ enabled: false, serial_no: null });
    },
    onDeleteSerialNo(index) {
      if (this.record.serial_nos.length > 1) {
        this.record.serial_nos.splice(index, 1);
      }
    },
    validateVerification() {
      this.errorMessages = [];
      let hasSerialNoError = false;

      this.record.serial_nos.forEach((item, index) => {
        if (item.enabled == false) {
          hasSerialNoError = true;
        }
        if (item.serial_no == "" || !item.serial_no) {
          this.record.serial_nos.splice(index, 1);
        }
      });

      if (!this.record.name) {
        this.errorMessages.push({ name: "Name is required" });
      }

      if (!this.record.mobile_number) {
        this.errorMessages.push({ name: "Mobile is required" });
      }

      if (!this.record.email) {
        this.errorMessages.push({ name: "Email is required" });
      }

      if (hasSerialNoError) {
        this.errorMessages.push({ name: "Serial number(s) is invalid" });
      }

      if (this.errorMessages && this.errorMessages.length == 0) {
        this.isActivationTypeDialog = true;
      } else {
        this.isErrorDialog = true;
      }
    },
    postVerification(activationType) {
      this.record.activation_type = activationType;

      axios
        .post(
          process.env.VUE_APP_API_URL + `customer/send/activation-code`,
          this.record
        )
        .then((response) => {
          console.log(response);
          this.snackBar.enabled = true;
          this.snackBar.message = "Successfully send activation code";
          this.isActivationTypeDialog = false;
        })
        .catch((error) => {
          this.snackBar.enabled = true;
          this.snackBar.message = "Error";
        });
    },
    postConfirmVerification() {
      axios
        .post(
          process.env.VUE_APP_API_URL + `customer/confirm/activation-code`,
          this.record
        )
        .then((response) => {
          console.log(response);
          this.isSuccessDialog = true;
          this.getSerialNoLookup();
          this.snackBar.enabled = true;
          this.snackBar.message = "Product(S) has been successfully activated";
          this.record = {
            name: "",
            mobile_number: "",
            email: "",
            serial_nos: [{ enabled: false, serial_no: null }],
            verification_code: "",
          };
        })
        .catch((error) => {
          this.snackBar.enabled = true;
          this.snackBar.message = "Invalid Code";
        });
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
    clearUnusedSerialNumber() {
      this.record.serial_nos = this.record.serial_nos.filter((item) => {
        if (item.serial_no) {
          return item;
        }
      });
    },
    checkValidSerialNo() {
      this.record.serial_nos = this.record.serial_nos.map((item) => {
        let updatedItem = item;
        updatedItem.enabled = false;
        return updatedItem;
      });

      console.log(this.record.serial_nos);

      this.serialNolookupItems.forEach((lookupItem) => {
        this.record.serial_nos.forEach((item) => {
          if (lookupItem.serial_no == item.serial_no) {
            item.enabled = true;
          }
        });
      });

      // if (serialNo && serialNo.length > 8) {
      //   let foundSerialNo = this.serialNolookupItems.map((item, index) => {
      //     if (item.serial_no == serialNo) {
      //       return item;
      //     }
      //   });

      //   if (foundSerialNo) {
      //     console.log(serialNo);
      //     return true;
      //   } else {
      //     return false;
      //   }
      // } else {
      //   return false;
      // }
    },
  },
  created() {
    this.getSerialNoLookup();
  },
};
</script>

<style lang="scss" scoped></style>
