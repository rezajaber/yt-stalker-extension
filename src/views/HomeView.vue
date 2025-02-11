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
    class="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900"
  >
    <div
      class="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl dark:bg-gray-800 space-y-8"
    >
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white text-center">
        Channel Duration ⏱️
      </h1>

      <div class="flex gap-4">
        <input
          v-model="url"
          type="text"
          placeholder="Enter YouTube channel URL"
          @keyup.enter="calculateTime"
          class="flex-1 px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-gray-700 focus:ring-4 focus:ring-red-500/20 focus:border-red-500 dark:bg-gray-700/50 dark:text-white outline-none transition-all duration-200"
        />
        <button
          @click="calculateTime"
          :disabled="youtubeStore.isLoading"
          class="px-6 py-3 bg-black hover:bg-red-800 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-semibold rounded-xl transition-all duration-200 cursor-pointer disabled:cursor-not-allowed shadow-lg hover:shadow-red-500/30 disabled:shadow-none"
        >
          Calculate
        </button>
      </div>

      <div
        v-if="youtubeStore.isLoading"
        class="flex items-center justify-center space-x-3 py-8"
      >
        <div
          class="w-6 h-6 border-3 border-gray-200 border-t-red-500 rounded-full animate-spin"
        ></div>
        <span class="text-gray-600 dark:text-gray-300 font-medium"
          >Processing...</span
        >
      </div>

      <div
        v-if="youtubeStore.error"
        class="p-6 bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-center font-medium"
      >
        {{ youtubeStore.error }}
      </div>

      <div v-if="youtubeStore.videos.length" class="space-y-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Channel Stats
        </h2>
        <div class="space-y-4">
          <div
            class="flex justify-between items-center p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700"
          >
            <span class="text-gray-600 dark:text-gray-300 font-medium"
              >Total Videos</span
            >
            <span class="text-lg text-gray-900 dark:text-white font-bold">
              {{ youtubeStore.videos.length }}
            </span>
          </div>
          <div
            class="flex justify-between items-center p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700"
          >
            <span class="text-gray-600 dark:text-gray-300 font-medium"
              >Total Duration</span
            >
            <span class="text-lg text-gray-900 dark:text-white font-bold">
              {{ formatDuration(youtubeStore.totalDuration) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
