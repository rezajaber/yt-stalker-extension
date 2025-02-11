<script setup lang="ts">
import { useYouTubeStore } from "@/stores/youtube";
import { ref } from "vue";

const youtubeStore = useYouTubeStore();
const url = ref("");

const calculateTime = async () => {
  if (!url.value) return;
  await youtubeStore.fetchVideos(url.value);
};

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}
</script>

<template>
  <div
    class="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg dark:bg-gray-800"
  >
    <h1
      class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center"
    >
      Channel 🕙 Calculator
    </h1>

    <div class="flex gap-3 mb-6">
      <input
        v-model="url"
        type="text"
        placeholder="Enter YouTube channel URL"
        @keyup.enter="calculateTime"
        class="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white outline-none transition-all"
      />
      <button
        @click="calculateTime"
        :disabled="youtubeStore.isLoading"
        class="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
      >
        Calculate
      </button>
    </div>

    <div
      v-if="youtubeStore.isLoading"
      class="flex items-center justify-center space-x-2 my-8 text-gray-600 dark:text-gray-300"
    >
      <div
        class="w-5 h-5 border-2 border-gray-200 border-t-red-600 rounded-full animate-spin"
      ></div>
      <span>Loading...</span>
    </div>

    <div
      v-if="youtubeStore.error"
      class="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-center my-4"
    >
      {{ youtubeStore.error }}
    </div>

    <div
      v-if="youtubeStore.videos.length"
      class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6"
    >
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Results
      </h2>
      <div class="space-y-3">
        <div
          class="flex justify-between items-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm"
        >
          <span class="text-gray-600 dark:text-gray-300 font-medium"
            >Total Videos</span
          >
          <span class="text-gray-900 dark:text-white font-bold">{{
            youtubeStore.videos.length
          }}</span>
        </div>
        <div
          class="flex justify-between items-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm"
        >
          <span class="text-gray-600 dark:text-gray-300 font-medium"
            >Total Watch Time</span
          >
          <span class="text-gray-900 dark:text-white font-bold">{{
            formatDuration(youtubeStore.totalDuration)
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
