<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

type TUser = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  phone: number;
};

const route = useRoute();

const user = ref<TUser>();

const status = ref<"loading" | "settled" | "error">();

async function GetUserAPI(): Promise<TUser | undefined> {
  const request = await fetch(
    // @ts-ignore
    `https://dummyjson.com/users/${route.params.id}`
  );
  if (!request.ok) {
    throw new Error("somthing went wrong!");
  }

  return await request.json();
}

onMounted(async () => {
  status.value = "loading";
  try {
    const response = await GetUserAPI();
    user.value = response!;
    status.value = "settled";
  } catch (error) {
    if (error instanceof Error) {
      status.value = "error";
      throw new Error(error.message);
    }
  }
});
</script>

<template>
  <main class="m-10">
    <h1 class="text-lg mb-1">DETAILS</h1>
    <hr />
    <h2 class="font-light my-2 tracking-widest">Information</h2>
    <span v-if="status === 'loading'">loading ...</span>
    <div v-else-if="status === 'settled'" class="w-5/12">
      <div class="flex border-2 border-gray-300 mb-5">
        <div class="flex-1">
          <p class="bg-gray-200 font-bold p-2 border-b-[1px] border-gray-300">
            Username
          </p>
          <p class="bg-gray-200 font-bold p-2 border-b-[1px] border-gray-300">
            Name
          </p>
          <p class="bg-gray-200 font-bold p-2 border-b-[1px] border-gray-300">
            GENDER
          </p>
          <p class="bg-gray-200 font-bold p-2 border-b-[1px] border-gray-300">
            Email
          </p>
          <p class="bg-gray-200 font-bold p-2">Mobile Phone</p>
        </div>
        <div class="flex-1">
          <p class="p-2 border-b-[1px] border-gray-300">{{ user?.username }}</p>
          <p class="p-2 border-b-[1px] border-gray-300">
            {{ user?.firstName + " " + user?.lastName }}
          </p>
          <p class="p-2 border-b-[1px] border-gray-300">{{ user?.gender }}</p>
          <p class="p-2 border-b-[1px] border-gray-300">{{ user?.email }}</p>
          <p class="p-2">{{ user?.phone }}</p>
        </div>
      </div>
      <RouterLink to="/" class="text-white bg-gray-500 px-7 py-2 float-right">
        Back
      </RouterLink>
    </div>
    <span v-else>Error :(</span>
  </main>
</template>
