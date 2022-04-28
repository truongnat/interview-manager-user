import moment from "moment";

export const DEFAULT_RANGE_YEAR = 20;
export const DEFAULT_RANGE_MONTH = 12;

export const months = [
  ...Array.from(new Array(DEFAULT_RANGE_MONTH)).map((_, i) => ({
    label: i + 1,
    value: i + 1,
  })),
];

export const years = [
  ...Array.from(new Array(DEFAULT_RANGE_YEAR)).map((_, i) => ({
    label: getCurrentYear() - DEFAULT_RANGE_YEAR + i + 1,
    value: getCurrentYear() - DEFAULT_RANGE_YEAR + i + 1,
  })),
];

export const dates = getDates(months[0].value, years[0].value);

export function getDates(month, year) {
  const count = countDateInCurrentMonthAndYear(month, year);
  return [
    ...Array.from(new Array(count)).map((_, i) => ({
      label: i + 1,
      value: i + 1,
    })),
  ];
}

export function getCurrentDate() {
  return new Date().getDate();
}

export function getCurrentMonth() {
  return new Date().getMonth();
}

export function getCurrentYear() {
  return new Date().getFullYear();
}

export function countDateInCurrentMonthAndYear(month, year) {
  return new Date(year, month, 0).getDate();
}

export function isInValidDateInMonth(date, month, year) {
  return date > countDateInCurrentMonthAndYear(month, year);
}

export function convertDateOfBirthToString(dob) {
  return `${dob.date}/${dob.month}/${dob.year}`;
}

export function convertStringToDateOfBirth(str = "") {
  const [date, month, year] = str.split("/");

  return {
    date: Number(date),
    month: Number(month),
    year: Number(year),
  };
}

export function convertStringToDate(str = "") {
  return moment(str.split("/").reverse().join("-")).toDate();
}

export function sortByDate(originArray = []) {
  return [...originArray].sort(function (a, b) {
    return convertStringToDate(a) - convertStringToDate(b);
  });
}
