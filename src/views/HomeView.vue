<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { RouterLink } from "vue-router";

type TUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
};

const users = ref<TUser[]>([]);

const status = ref<"loading" | "settled" | "error">();

const userQuery = ref<string>("");

async function GetUsersAPI(): Promise<TUser[] | undefined> {
  const request = await fetch("https://dummyjson.com/users");
  if (!request.ok) {
    throw new Error("somthing went wrong!");
  }

  return (await request.json()).users;
}

onMounted(async () => {
  status.value = "loading";
  try {
    const response = await GetUsersAPI();
    users.value = response!;
    status.value = "settled";
  } catch (error) {
    if (error instanceof Error) {
      status.value = "error";
      throw new Error(error.message);
    }
  }
});

const usersComputed = computed(() =>
  users.value.filter((user) =>
    user.firstName.toLocaleLowerCase().includes(userQuery.value)
  )
);
</script>

<template>
  <main class="m-10">
    <h1 class="font-bold text-lg mb-1">USERS</h1>
    <hr />
    <h2 class="font-semibold my-2">LIST</h2>
    <span v-if="status === 'loading'">Loading ...</span>
    <div v-else-if="status === 'settled'">
      <input
        type="text"
        class="outline-none border-[1px] border-gray-300 rounded-md p-1 w-5/12 mb-2"
        placeholder="search"
        v-model="userQuery"
      />
      <p
        v-if="usersComputed.length === 0"
        class="text-red-400 text-2xl text-center mt-10"
      >
        You don't have user data
      </p>
      <table v-else class="w-full border-2">
        <thead>
          <tr class="bg-gray-200">
            <th
              class="font-bold tracking-wide text-left py-2 w-5/12 pl-2 border-r-2 border-gray-300"
            >
              NAME
            </th>
            <th
              class="font-bold tracking-wide text-left py-2 w-5/12 pl-2 border-r-2 border-gray-300"
            >
              EMAIL
            </th>
            <th class="font-bold tracking-wide text-center py-2 w-3/12">
              GENDER
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in usersComputed" :key="user.id" class="border-2">
            <td class="pl-2 py-2 border-r-2">
              <RouterLink class="text-blue-400" :to="'/detail/' + user.id">{{
                user.firstName
              }}</RouterLink>
            </td>
            <td class="pl-2 py-2 border-r-2">{{ user.email }}</td>
            <td class="text-center">{{ user.gender }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <span v-else>Error :(</span>
  </main>
</template>
