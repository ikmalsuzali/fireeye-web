<template>
  <div>
    <v-app>
      <v-container>
        <v-row>
          <v-col style="height: 100vh">
            <v-card max-width="500" style="margin: auto">
              <div class="ma-6">
                <h2 class="text-center">Help</h2>

                <v-text-field
                  readonly
                  label="Company Phone Number"
                  value="+603 7498 0229"
                  prepend-icon="mdi-phone"
                ></v-text-field>
                <v-text-field
                  readonly
                  label="Company Email"
                  value="help@fireeye.com.my"
                  prepend-icon="mdi-email"
                ></v-text-field>
                <div><u>Operating Hours</u></div>
                <div>Monday to Friday 10.00am to 6.00pm daily</div>
              </div>
              <h2 class="ma-6">Question and Answers</h2>
              <div>
                <v-expansion-panels>
                  <v-expansion-panel
                    v-for="(qaItem, index) in qaItems"
                    :key="index"
                  >
                    <v-expansion-panel-header>
                      <b>
                        {{ qaItem.question }}
                      </b>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      {{ qaItem.answer }}
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </div>
</template>

<script>
export default {
  data() {
    return {
      qaItems: [
        { question: "What is your name?", answer: "test" },
        { question: "Where are you located?", answer: "test" },
      ],
    };
  },
  methods: {
    onAddMoreSerialClick() {
      this.record.serial_nos.push("");
    },
    onDeleteSerialNo(index) {
      if (this.record.serial_nos.length > 1) {
        this.record.serial_nos.splice(index, 1);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
