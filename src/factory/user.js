export function User({ id, name, email, dateOfBirth, active }) {
  this.id = id;
  this.name = name;
  this.email = email;
  this.dateOfBirth = dateOfBirth;
  this.active = active;
}

export const initializeUser = {
  name: "",
  email: "",
  dateOfBirth: "",
  active: false,
};
