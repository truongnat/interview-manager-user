<template>
  <div class="mr-10 date-range-picker">
    <span class="pr-5">Range filter:</span>
    <v-menu
      v-model="menu1"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
    >
      <template #activator="{ on, attrs }">
        <v-text-field
          v-model="date1"
          readonly
          v-bind="attrs"
          hide-details="false"
          class="mr-5"
          v-on="on"
        />
      </template>
      <v-date-picker
        v-model="date1"
        @change="handleChangeDate1"
        @input="menu1 = false"
      />
    </v-menu>
    <v-menu
      v-model="menu2"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
    >
      <template #activator="{ on, attrs }">
        <v-text-field
          v-model="date2"
          readonly
          v-bind="attrs"
          hide-details="false"
          v-on="on"
        />
      </template>
      <v-date-picker
        v-model="date2"
        @change="handleChangeDate2"
        @input="menu2 = false"
      />
    </v-menu>
  </div>
</template>
<script>
export default {
  name: "DateRangePicker",
  emits: ["onChange"],
  data: () => ({
    date1: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    date2: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    menu2: false,
    menu1: false,
  }),
  methods: {
    handleChangeDate1() {
      this.emitValue();
    },
    handleChangeDate2() {
      this.emitValue();
    },
    emitValue() {
      this.$emit("onChange", {
        from: this.date1,
        to: this.date2,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.date-range-picker {
  display: flex;
  align-items: center;
}
</style>
