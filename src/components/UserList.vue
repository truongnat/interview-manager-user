<template>
  <div class="manager-user">
    <v-data-table
      :headers="headers"
      :items="users"
      :items-per-page="limit"
      :loading="loading"
      :custom-sort="customSort"
      hide-default-footer
      loading-text="Loading... Please wait"
      class="elevation-1"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Manager User</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          />
          <v-spacer />
          <div class="view-top-manager">
            <DateRangePicker @onChange="handleChangeRangeDate" />

            <v-select
              v-model="selectedFields"
              :items="fieldsFilter"
              label="Show field table"
              multiple
              persistent-hint
              hide-details="false"
              class="mr-5 w-300"
              @change="handleChangeShowFields"
            />

            <v-btn
              color="primary"
              dark
              class="mr-5"
              @click="handleLoadExampleUser"
            >
              Load Example
            </v-btn>

            <v-btn
              color="primary"
              dark
              @click="showCreateModal = true"
            >
              Create User
            </v-btn>
          </div>
        </v-toolbar>
      </template>

      <template #item.active="{ item }">
        <span>{{ item.active ? "Active" : "Inactive" }}</span>
      </template>

      <template #item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="openUpdateUserModal(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="openDeleteModal(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template #no-data>
        <!-- <v-btn color="primary" @click="initialize"> Reset </v-btn> -->
      </template>
    </v-data-table>
    <v-divider />
    <div
      v-if="totalUser > limit"
      class="user-paging"
    >
      <v-pagination
        v-model="page"
        :length="Math.ceil(totalUser / limit)"
        :total-visible="5"
      />
    </div>

    <ModalCreateUser
      v-if="showCreateModal"
      @onSubmit="handleSubmitCreateUser"
      @onClose="showCreateModal = false"
    />

    <ModalDeleteUser
      :visible="showDelete"
      @onClose="showDelete = false"
      @onConfirm="handleDeleteUser"
    />

    <ModalUpdateUser
      v-if="showUpdateUserModal"
      :user="currentUser"
      @onSubmit="handleSubmitUpdateUser"
      @onClose="showUpdateUserModal = false"
    />
  </div>
</template>
<script>
import ModalCreateUser from "./ModalCreateUser.vue";
import ModalDeleteUser from "./ModalDeleteUser.vue";
import { useServer } from "../server/api";
import ModalUpdateUser from "./ModalUpdateUser.vue";
import { mockUsers } from "@/mocks/data";
import { delay } from "@/utils";
import { convertStringToDate, sortByDate } from "@/helpers/date";
import DateRangePicker from "./DateRangePicker.vue";

const server = useServer();

const defaultConfigHeader = [
  {
    text: "Username",
    align: "start",
    sortable: true,
    value: "name",
  },
  { text: "Email", value: "email", sortable: true },
  {
    text: "Date of Birth",
    value: "dateOfBirth",
    sortable: true,
  },
  { text: "Active", value: "active" },
];

const configAct = { text: "Actions", value: "actions", sortable: false };

export default {
  name: "UserList",
  components: {
    ModalCreateUser,
    ModalDeleteUser,
    ModalUpdateUser,
    DateRangePicker,
  },
  data: () => ({
    headers: [...defaultConfigHeader, configAct],
    users: [],
    showDelete: false,
    showCreateModal: false,
    showUpdateUserModal: false,
    currentUser: null,
    limit: 5,
    page: 1,
    totalUser: 0,
    loading: false,
    currentHeader: null,
    selectedFields: [...defaultConfigHeader.map((el) => el.value)],
    fieldsFilter: [...defaultConfigHeader],
  }),
  computed: {},
  watch: {
    page() {
      this.fetchUsers();
    },
  },
  created() {
    this.loading = true;
    this.fetchUsers();
    this.loading = false;
  },
  methods: {
    fetchUsers() {
      this.users = server.getUsers(this.limit, this.page);
      this.totalUser = server.countUser();
    },

    handleLoadExampleUser() {
      mockUsers.forEach((el) => {
        server.addUser(el);
      });
      this.loading = true;

      delay(() => {
        this.fetchUsers();
        this.loading = false;
      }, 3000);
    },

    openUpdateUserModal(item) {
      this.showUpdateUserModal = true;
      this.currentUser = item;
    },

    openDeleteModal(item) {
      this.showDelete = true;
      this.currentUser = item;
    },

    handleSubmitUpdateUser(data) {
      const response = server.updateUser(data);
      if (response.status === 400) {
        this.$toast.error(response.message, {
          position: "top-center",
          hideProgressBar: true,
          timeout: 1000,
        });
        return;
      }
      this.$toast.success("Update user success!", {
        position: "top-center",
        hideProgressBar: true,
        timeout: 1000,
      });
      this.fetchUsers();
    },

    handleSubmitCreateUser(data) {
      const response = server.addUser(data);
      if (response.status === 400) {
        this.$toast.error(response.message, {
          position: "top-center",
          hideProgressBar: true,
          timeout: 1000,
        });
        return;
      }
      this.$toast.success("Create user success!", {
        position: "top-center",
        hideProgressBar: true,
        timeout: 1000,
      });
      this.fetchUsers();
    },

    handleDeleteUser() {
      server.deleteUser(this.currentUser.id);
      this.$toast.success("Delete user success!", {
        position: "top-center",
        hideProgressBar: true,
        timeout: 1000,
      });
      this.showDelete = false;
      this.fetchUsers();
    },

    handleChangeShowFields(data) {
      const filtered = this.fieldsFilter.filter((el) =>
        data.includes(el.value)
      );
      if (filtered.length) {
        this.headers = [...filtered, configAct];
      } else {
        this.headers = [];
      }
    },

    customSort(items, index, isDesc) {
      items.sort((a, b) => {
        if (index[0] == "dateOfBirth") {
          if (!isDesc[0]) {
            return (
              convertStringToDate(b[index]) - convertStringToDate(a[index])
            );
          } else {
            return (
              convertStringToDate(a[index]) - convertStringToDate(b[index])
            );
          }
        } else {
          if (typeof a[index] !== "undefined") {
            if (!isDesc[0]) {
              return a[index]
                .toLowerCase()
                .localeCompare(b[index].toLowerCase());
            } else {
              return b[index]
                .toLowerCase()
                .localeCompare(a[index].toLowerCase());
            }
          }
        }
      });
      return items;
    },

    handleChangeRangeDate(range) {
      console.log(
        "🚀 ~ file: UserList.vue ~ line 271 ~ handleChangeRangeDate ~ handleChangeRangeDate",
        range
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.manager-user {
  padding: 24px;
}

.user-paging {
  padding-top: 16px;
}

.view-top-manager {
  display: flex;
  align-items: center;
}

.w-300 {
  width: 300px;
}
</style>
