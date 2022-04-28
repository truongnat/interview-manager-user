<template>
  <v-dialog
    v-model="visible"
    max-width="500px"
    @click:outside="$emit('onClose')"
  >
    <v-card>
      <validation-observer
        ref="observer"
        v-slot="{ invalid }"
      >
        <form @submit.prevent="save">
          <v-card-title>
            <span class="text-h5">Update User</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <validation-provider
                v-slot="{ errors }"
                name="name"
                rules="required"
              >
                <v-text-field
                  v-model="formUser.name"
                  :error-messages="errors"
                  label="Name"
                  filled
                  clearable
                  required
                />
              </validation-provider>
              <validation-provider
                v-slot="{ errors }"
                name="email"
                rules="required|email"
              >
                <v-text-field
                  v-model="formUser.email"
                  :error-messages="errors"
                  label="E-mail"
                  filled
                  clearable
                  disabled
                />
              </validation-provider>

              <SelectDatePicker
                :dob="user.dateOfBirth"
                @onChange="changeDatePicker"
              />

              <validation-provider name="active">
                <v-checkbox
                  v-model="formUser.active"
                  :value="true"
                  label="Active"
                  type="checkbox"
                />
              </validation-provider>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="blue darken-1"
              text
              @click="close"
            >
              Cancel
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              :disabled="invalid"
              @click="save"
            >
              Save
            </v-btn>
          </v-card-actions>
        </form>
      </validation-observer>
    </v-card>
  </v-dialog>
</template>
<script>
import { initializeUser } from "@/factory/user";
import { extend } from "vee-validate";
import * as rules from "vee-validate/dist/rules";
import { REGEX_EMAIL } from "@/utils";
import SelectDatePicker from "./SelectDatePicker.vue";
import { convertStringToDateOfBirth } from "@/helpers/date";

extend("required", {
  ...rules.required,
  message: "{_field_} can not be empty",
});

extend("email", {
  ...rules.email,
  message: "Email must be valid",
});

export default {
  name: "ModalUpdateUser",
  components: { SelectDatePicker },
  props: ["user"],
  emits: ["onSubmit", "onClose"],
  data() {
    return {
      formUser: { ...initializeUser },
      visible: true,
    };
  },
  created() {
    this.REGEX_EMAIL = REGEX_EMAIL;
  },
  mounted() {
    this.formUser = {
      ...this.formUser,
      ...this.user,
      dateOfBirth: convertStringToDateOfBirth(this.user.dateOfBirth),
    };
    console.log("logging : ", this.formUser);
  },
  methods: {
    close() {
      this.formUser = { ...initializeUser };
      this.closeModal();
      this.clear();
    },
    async save() {
      const isValid = await this.$refs.observer.validate();
      if (isValid) {
        this.$emit("onSubmit", this.formUser);
        this.close();
      }
    },
    closeModal() {
      this.$emit("onClose");
    },
    changeDatePicker(value) {
      this.formUser.dateOfBirth = value;
    },
    clear() {
      this.$refs.observer.reset();
    },
  },
};
</script>
