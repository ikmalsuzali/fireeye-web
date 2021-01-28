<template>
  <v-app>
    <v-container fluid fill-height style="background-color: #1e88e5">
      <v-layout align-center justify-center>
        <v-flex :style="{ 'max-width': '350px' }">
          <v-card>
            <v-card-text>
              <div class="text-center mb-4">
                <h1>Password Reset</h1>
              </div>
              <transition name="fade" mode="out-in">
                <div>
                  <div>
                    <v-text-field
                      :label="'Email'"
                      prepend-icon="mdi-account"
                      v-model="form.email"
                      required
                      readonly
                      :error-messages="errorMessages.email"
                    ></v-text-field>
                    <v-text-field
                      label="Password"
                      prepend-icon="mdi-lock"
                      type="password"
                      v-model="form.password"
                      required
                    ></v-text-field>
                    <v-text-field
                      label="Confirm Password"
                      prepend-icon="mdi-lock"
                      type="password"
                      v-model="form.confirm_password"
                      required
                    ></v-text-field>

                    <div class="text-center">
                      <v-btn
                        :loading="loading"
                        color="primary"
                        large
                        type="submit"
                        text
                        rounded
                        @click="postPasswordReset()"
                      >
                        {{ "Reset Password" }}
                      </v-btn>
                    </div>
                  </div>

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
              </transition>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: this.$route.query.email,
        password: null,
        confirm_password: null,
        token: this.$route.params.token,
      },
      errorMessages: {},
      loading: false,
      snackBar: {
        enabled: false,
        message: "",
      },
    };
  },
  methods: {
    postPasswordReset() {
      this.$http
        .post(`auth/password-reset`, this.form)
        .then((response) => {
          this.$store.dispatch("logout");
          this.$router.push("/login");
        })
        .catch((error) => {
          this.snackBar.enabled = true;
          this.snackBar.message = "Password Reset Error";
        });
    },
  },
};
</script>
