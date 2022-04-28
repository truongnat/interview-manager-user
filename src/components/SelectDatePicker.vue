<template>
  <div class="select-date-picker">
    <v-select
      v-model="dateOfBirth.date"
      :items="dates"
      filled
      label="Date"
      item-text="label"
      item-value="value"
      dense
    />
    <v-select
      v-model="dateOfBirth.month"
      :items="months"
      filled
      label="Month"
      item-text="label"
      item-value="value"
      dense
      class="mx-5"
      @change="(val) => $emit('changeMonth', val)"
    />
    <v-select
      v-model="dateOfBirth.year"
      :items="years"
      item-text="label"
      item-value="value"
      filled
      label="Year"
      dense
    />
  </div>
</template>
<script>
import {
  getCurrentDate,
  months,
  years,
  dates,
  getDates,
  isInValidDateInMonth,
  convertDateOfBirthToString,
  convertStringToDateOfBirth,
} from "@/helpers/date";

const initDob = {
  date: dates.find((el) => el.value === getCurrentDate()).value,
  month: months[0].value,
  year: years[0].value,
};

export default {
  name: "SelectDatePicker",
  props: ["dob"],
  emits: ["changeMonth", "onChange"],
  data: () => ({
    dates: dates,
    months: months,
    years: years,
    dateOfBirth: {},
  }),
  watch: {
    dateOfBirth: {
      handler: function (val) {
        this.dates = getDates(val.month, val.year);
        if (isInValidDateInMonth(val.date, val.month, val.year)) {
          this.dateOfBirth.date = this.dates[this.dates.length - 1].value;
        }
        this.$emit("onChange", convertDateOfBirthToString(this.dateOfBirth));
      },
      deep: true,
    },
  },
  mounted() {
    this.dateOfBirth = this.dob
      ? { ...convertStringToDateOfBirth(this.dob) }
      : { ...initDob };
  },
};
</script>
<style lang="scss">
.select-date-picker {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}
</style>
