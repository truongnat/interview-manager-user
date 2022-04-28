<template>
  <v-dialog
    v-model="show"
    max-width="500px"
  >
    <v-card>
      <v-card-title class="text-h5">
        Are you sure you want to delete this user?
      </v-card-title>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="blue darken-1"
          text
          @click="closeDelete"
        >
          Cancel
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="deleteItemConfirm"
        >
          OK
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: "ModalDeleteUser",
  props: ["visible"],
  emits: ["onClose", "onConfirm"],
  data() {
    return {
      show: false,
    };
  },
  watch: {
    visible(val) {
      this.show = val;
    },
  },
  methods: {
    closeDelete() {
      this.$emit("onClose");
    },
    deleteItemConfirm() {
      this.$emit("onConfirm");
    },
  },
};
</script>
<style lang="scss" scoped></style>
