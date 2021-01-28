<template>
  <div>
    <div>
      <v-text-field
        :label="'Email'"
        prepend-icon="mdi-account"
        v-model="form.email"
        required
        :error-messages="errorMessages.email"
      ></v-text-field>

      <v-text-field
        :label="$t('auth.password')"
        prepend-icon="mdi-lock"
        type="password"
        v-model="form.password"
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
          @click="postLogin()"
        >
          {{ $t("auth.sign_in") }}
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
</template>

<script>
import { mapActions } from "vuex";
import axios from "axios";

export default {
  data() {
    return {
      form: {
        email: null,
        password: null,
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
    postLogin() {
      axios
        .post(process.env.VUE_APP_API_URL + `auth/login`, this.form)
        .then((response) => {
          this.$store.dispatch("setAuth", response.data.data);
          this.$router.push("/admin/dashboard");
        })
        .catch((error) => {
          this.snackBar.enabled = true;
          this.snackBar.message = "Login Error";
        });
    },
  },
};
</script>
