<template>
  <div>
    <v-card class="mx-auto">
      <v-toolbar>
        <v-toolbar-title>
          {{ "Profile" }}
        </v-toolbar-title>
      </v-toolbar>
      <v-container fluid>
        <v-row>
          <v-col md="5">
            <v-card class="mx-auto my-12">
              <template slot="progress">
                <v-progress-linear
                  color="deep-purple"
                  height="10"
                  indeterminate
                ></v-progress-linear>
              </template>

              <v-card-title>{{ $store.state.auth.user.name }}</v-card-title>
              <v-card-text>
                <div class="subtitle-1">
                  {{ $store.state.auth.user.email }}
                </div>

                <div>
                  {{ $store.state.auth.user.role.role }}
                </div>
              </v-card-text>

              <v-divider class="mx-4"></v-divider>

              <v-card-actions>
                <v-btn
                  color="deep-blue lighten-2"
                  text
                  @click="onResetPassword($store.getters.getEmail)"
                >
                  Reset Password
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col md="7">
            <v-card class="mx-auto my-12">
              <v-toolbar color="blue" dark>
                <v-toolbar-title>User</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="onAddClick()">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-toolbar>
              <v-list three-line>
                <template v-for="(user, index) in userItems">
                  <div :key="index">
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title
                          v-html="user.name"
                        ></v-list-item-title>
                        <v-list-item-subtitle>
                          {{ "Email: " + user.email }}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle>
                          {{ "Role: " + user.role.role }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-btn x-small class="ma-1" @click="onEditClick(user)">
                          Edit
                          <v-icon x-small>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn
                          x-small
                          class="ma-1"
                          @click="onResetPassword(user.email)"
                        >
                          Reset Password
                          <v-icon x-small>mdi-lock-reset</v-icon>
                        </v-btn>
                        <v-btn
                          x-small
                          class="ma-1"
                          @click="onDeleteClick(user)"
                        >
                          Delete
                          <v-icon x-small color="red">mdi-delete</v-icon>
                        </v-btn>
                        <!-- <v-btn icon color="red">
                        <v-icon>mdi-lock-reset</v-icon>
                      </v-btn>
                      <v-btn icon color="red">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn> -->
                      </v-list-item-action>
                    </v-list-item>
                    <v-divider v-if="index < userItems.length - 1"></v-divider>
                  </div>
                </template>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-dialog
      v-model="isAddUserDialogEnabled"
      transition="dialog-bottom-transition"
      max-width="600"
    >
      <v-card>
        <v-toolbar color="primary" dark>Add User</v-toolbar>
        <v-row class="px-10 pt-6">
          <v-col md="6">
            <v-text-field
              label="Name"
              v-model="record.name"
              outlined
            ></v-text-field>
          </v-col>
          <v-col md="6">
            <v-text-field
              label="Email"
              v-model="record.email"
              outlined
            ></v-text-field>
          </v-col>
          <v-col style="margin-top: -30px" md="6">
            <v-text-field
              type="password"
              label="Password"
              v-model="record.password"
              outlined
            ></v-text-field>
          </v-col>
          <v-col md="6" style="margin-top: -30px">
            <v-text-field
              type="password"
              label="Confirm Password"
              v-model="record.confirm_password"
              outlined
            ></v-text-field>
          </v-col>
          <v-col md="6" style="margin-top: -30px">
            <v-autocomplete
              label="Role"
              v-model="record.role"
              :items="['admin', 'moderator', 'basic']"
              outlined
            ></v-autocomplete>
          </v-col>
        </v-row>

        <v-card-actions class="justify-end">
          <v-btn color="primary" @click="addUser()">Confirm</v-btn>
          <v-btn text @click="isAddUserDialogEnabled = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="isEditUserDialogEnabled"
      transition="dialog-bottom-transition"
      max-width="600"
    >
      <v-card>
        <v-toolbar color="primary" dark>Edit User</v-toolbar>
        <v-row class="px-10 pt-6">
          <v-col md="6">
            <v-text-field
              label="Name"
              v-model="record.name"
              outlined
            ></v-text-field>
          </v-col>
          <v-col md="6">
            <v-autocomplete
              label="Role"
              v-model="record.role"
              :items="['admin', 'moderator', 'basic']"
              outlined
            ></v-autocomplete>
          </v-col>
        </v-row>

        <v-card-actions class="justify-end">
          <v-btn color="primary" @click="editUser()">Confirm</v-btn>
          <v-btn text @click="isEditUserDialogEnabled = false">Close</v-btn>
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
          Delete User: {{ record.name }}
        </v-toolbar>
        <v-card-text>
          <div class="text-h6 py-2">
            Are you sure you want to delete the user?
          </div>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn color="primary" @click="deleteUser()">Confirm</v-btn>
          <v-btn text @click="isDeleteDialogEnabled = false">Close</v-btn>
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

export default {
  data() {
    return {
      recordId: this.$route.params.id,
      record: {
        name: "",
        email: "",
        password: "",
        confirm_password: "",
        role: "",
      },
      userItems: [],
      selectedDeletedItem: {},
      isDeleteDialogEnabled: false,
      isEditUserDialogEnabled: false,
      isAddUserDialogEnabled: false,
      snackBar: {
        enabled: false,
        message: "",
      },
    };
  },

  methods: {
    setDateFormat(date) {
      return moment(date).format("DD/MM/YYYY");
    },
    getProfile() {},
    onAddClick() {
      this.isAddUserDialogEnabled = true;
      this.record = {
        name: "",
        email: "",
        password: "",
        confirm_password: "",
        role: "",
      };
    },
    onEditClick(item) {
      this.isEditUserDialogEnabled = true;
      this.record = {
        id: item.id,
        name: item.name,
        email: item.email,
        role: item.role.role,
      };
    },
    onDeleteClick(item) {
      this.isDeleteDialogEnabled = true;
      this.record = {
        id: item.id,
        name: item.name,
        email: item.email,
      };
    },
    addUser() {
      this.$http
        .post("admin/user", this.record)
        .then((response) => {
          if (response.data) {
            this.snackBar.enabled = true;
            this.snackBar.message = "Successfully added user";
            this.record = {};
            this.getUsers();
            this.isAddUserDialogEnabled = false;
          }
        })
        .catch((error) => {});
    },
    editUser() {
      this.$http
        .put("admin/user/" + this.record.id, this.record)
        .then((response) => {
          if (response.data) {
            this.snackBar.enabled = true;
            this.snackBar.message = "Successfully edit user";
            this.record = {};
            this.getUsers();
            this.isEditUserDialogEnabled = false;
          }
        })
        .catch((error) => {});
    },
    deleteUser() {
      this.$http
        .delete("admin/user/" + this.record.id)
        .then((response) => {
          if (response.data) {
            this.snackBar.enabled = true;
            this.snackBar.message = "Successfully deleted user";
            this.record = {};
            this.getUsers();
            this.isDeleteDialogEnabled = false;
          }
        })
        .catch((error) => {});
    },
    getUsers() {
      this.$http
        .get("admin/user")
        .then((response) => {
          if (response.data) {
            this.userItems = response.data.data;
          }
        })
        .catch((error) => {});
    },
    onResetPassword(email) {
      this.$http
        .post(`admin/auth/send-password-reset`, {
          email: email,
        })
        .then((response) => {
          this.snackBar.enabled = true;
          this.snackBar.message = "Successfully send password reset";
          this.isResetPasswordDialogEnabled = false;
        })
        .catch((error) => {
          this.snackBar.enabled = true;
          this.snackBar.message = "Cannot send password reset at the moment";
        });
    },
  },
  created() {
    this.getUsers();
  },
};
</script>
