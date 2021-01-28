import Vue from "vue";
import Vuex from "vuex";
import get from "get-value";
import VuexPersistence from "vuex-persist";

Vue.use(Vuex);

function getValue(resource, key) {
  return get(resource, key);
}

export default new Vuex.Store({
  state: {
    auth: {
      user: {
        name: null,
        email: null,
        role: { role: null },
      },
      token: null,
    },
  },
  getters: {
    getName: (state) => {
      return getValue(state.auth, "user.name");
    },
    getEmail: (state) => {
      return getValue(state.auth, "user.email");
    },
    getUserRole: (state) => {
      return getValue(state.auth, "user.role.role");
    },
    getTokenId: (state) => {
      return getValue(state.auth, "token");
    },
  },
  actions: {
    setAuth(context, payload) {
      console.log("set auth actions", payload);
      context.commit("SET_AUTH", payload);
    },
    logout(context, payload) {
      context.commit("LOGOUT", payload);
    },
  },
  mutations: {
    SET_AUTH(state, payload) {
      console.log("set auth mutations", payload);

      state.auth = payload;
    },
    LOGOUT(state, payload) {
      state.auth = {
        user: {
          name: null,
          email: null,
          role: { role: null },
        },
        token: null,
      };
    },
  },
  plugins: [new VuexPersistence().plugin],
});
