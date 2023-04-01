<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { TUser } from "@/types";
import * as API from "@/libs";

const route = useRoute();

const router = useRouter();

const user = ref<TUser>();

const status = ref<"loading" | "settled" | "error">();

onMounted(async () => {
  status.value = "loading";
  try {
    const response = await API.GET_Request<TUser | undefined>(
      `https://dummyjson.com/users/${route.params.id}`
    );
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
  <main class="m-10 text-xl">
    <h1 class="mb-1">DETAILS</h1>
    <hr />
    <h2 class="font-light my-2 tracking-widest">Information</h2>
    <span v-if="status === 'loading'">loading ...</span>
    <div v-else-if="status === 'settled'" class="w-7/12">
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
          <p class="p-2 border-b-[1px] border-gray-300 uppercase">
            {{ user?.username }}
          </p>
          <p class="p-2 border-b-[1px] border-gray-300 uppercase">
            {{ user?.firstName + " " + user?.lastName }}
          </p>
          <p class="p-2 border-b-[1px] border-gray-300 uppercase">
            {{ user?.gender }}
          </p>
          <p class="p-2 border-b-[1px] border-gray-300 uppercase">
            {{ user?.email }}
          </p>
          <p class="p-2">{{ user?.phone }}</p>
        </div>
      </div>
      <button
        @click="router.go(-1)"
        class="text-white font-light text-sm tracking-widest bg-gray-500 px-7 py-2 float-right rounded-md"
      >
        Back
      </button>
    </div>
    <span v-else>Error :(</span>
  </main>
</template>
