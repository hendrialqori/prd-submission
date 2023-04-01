<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { RouterLink, useRouter, useRoute } from "vue-router";
import type { TUser } from "@/types";
import * as API from "@/libs";

const route = useRoute();

const router = useRouter();

const users = ref<TUser[]>([]);

const status = ref<"loading" | "settled" | "error">();

const searchQuery = ref<string>("");

// pagination

const limit = 10;

const currentPage = ref(1);

const rangePage = ref(0);

const movingPage = ({
  conditional,
  targetPage,
}: {
  conditional: "prev" | "next" | "jumpToPage";
  targetPage?: number;
}) => {
  switch (conditional) {
    case "prev":
      currentPage.value -= 1;
      router.push({
        path: "/",
        query: {
          page: currentPage.value,
        },
      });
      break;

    case "next":
      currentPage.value += 1;
      router.push({
        path: "/",
        query: {
          page: currentPage.value,
        },
      });
      break;

    case "jumpToPage":
      currentPage.value = targetPage!;
      router.push({
        path: "/",
        query: {
          page: targetPage,
        },
      });
  }
};

onMounted(async () => {
  window.onpopstate = () => {
    currentPage.value = Number(route.query.page) || 1;
  };

  currentPage.value = Number(route.query.page) || 1;

  status.value = "loading";

  try {
    const response = await API.GET_Request<{ users: TUser[] } | undefined>(
      "https://dummyjson.com/users"
    );
    users.value = response?.users!;

    status.value = "settled";
    // set range page
    rangePage.value = Math.ceil(response?.users.length! / limit);
  } catch (error) {
    if (error instanceof Error) {
      status.value = "error";

      throw new Error(error.message);
    }
  }
});

const usersComputed = computed(() => {
  const startIndex = (currentPage.value - 1) * limit;

  const endIndex = startIndex + limit;

  return !searchQuery.value
    ? users.value.slice(startIndex, endIndex)
    : users.value.filter(
        (user) =>
          user.firstName
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase()) ||
          user.lastName
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
});
</script>

<template>
  <main class="m-10 text-xl">
    <h1 class="font-bold mb-1">USERS</h1>
    <hr />
    <h2 class="font-semibold my-2">LIST</h2>
    <span v-if="status === 'loading'">Loading ...</span>
    <div v-else-if="status === 'settled'">
      <input
        type="text"
        class="outline-none border-[1px] border-gray-300 rounded-md p-1 w-5/12 mb-2"
        placeholder="search"
        v-model="searchQuery"
      />
      <p
        v-if="users.length === 0"
        class="text-red-400 text-3xl text-center mt-[100px]"
      >
        You don't have user data
      </p>
      <div v-else>
        <table class="w-full border-2">
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
                <RouterLink
                  class="text-blue-400 uppercase"
                  :to="'/detail/' + user.id"
                  >{{ user?.firstName + " " + user?.lastName }}</RouterLink
                >
              </td>
              <td class="pl-2 py-2 border-r-2 uppercase">{{ user?.email }}</td>
              <td class="text-center uppercase">{{ user?.gender }}</td>
            </tr>
          </tbody>
        </table>
        <div
          v-show="usersComputed.length !== 0"
          class="my-6 float-right"
          aria-label="pagination"
        >
          <div
            class="border-[1px] border-gray-500 w-max rounded-md flex items-center justify-center"
          >
            <button
              :disabled="currentPage === 1"
              @click="movingPage({ conditional: 'prev' })"
              class="px-3 py-1 border-gray-500 text-[9px] rounded-l-md hover:bg-gray-500 hover:text-white"
            >
              &lt;&lt;
            </button>
            <button
              v-for="page in rangePage"
              :class="
                page === currentPage
                  ? 'bg-gray-500 text-white'
                  : 'text-gray-500'
              "
              class="px-3 py-2 bg border-l-[1px] border-gray-500 text-sm"
              @click="
                movingPage({ conditional: 'jumpToPage', targetPage: page })
              "
            >
              {{ page }}
            </button>
            <button
              @click="movingPage({ conditional: 'next' })"
              :disabled="currentPage === rangePage"
              class="px-3 py-1 text-black border-l-[1px] text-[8px] border-gray-500 rounded-r-md hover:bg-gray-500 hover:text-white"
            >
              >>
            </button>
          </div>
        </div>
      </div>
    </div>
    <span v-else>Error :(</span>
  </main>
</template>
