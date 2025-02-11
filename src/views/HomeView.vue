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
  <div class="container">
    <h1>YouTube Time Calculator</h1>

    <div class="input-group">
      <input
        v-model="url"
        type="text"
        placeholder="Enter YouTube channel URL"
        @keyup.enter="calculateTime"
      />
      <button @click="calculateTime" :disabled="youtubeStore.isLoading">
        Calculate
      </button>
    </div>

    <div v-if="youtubeStore.isLoading" class="loading">
      <span class="loader"></span>
      Loading...
    </div>

    <div v-if="youtubeStore.error" class="error">
      {{ youtubeStore.error }}
    </div>

    <div v-if="youtubeStore.videos.length" class="results">
      <h2>Results</h2>
      <div class="stats">
        <div class="stat-item">
          <span class="stat-label">Total Videos:</span>
          <span class="stat-value">{{ youtubeStore.videos.length }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Total Watch Time:</span>
          <span class="stat-value">{{
            formatDuration(youtubeStore.totalDuration)
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 350px;
  min-height: 250px;
  padding: 16px;
  background-color: #ffffff;
  font-family: Arial, sans-serif;
}

h1 {
  font-size: 1.5rem;
  color: #1a1a1a;
  margin-bottom: 1rem;
  text-align: center;
}

.input-group {
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;
}

input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

button {
  padding: 8px 16px;
  background-color: #ff0000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #cc0000;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  margin: 2rem 0;
  color: #666;
}

.loader {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #ff0000;
  border-radius: 50%;
  margin-right: 8px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error {
  color: #ff0000;
  text-align: center;
  padding: 1rem;
  background-color: #ffebee;
  border-radius: 4px;
  margin: 1rem 0;
}

.results {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8f8f8;
  border-radius: 4px;
}

.results h2 {
  font-size: 1.2rem;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-label {
  color: #666;
  font-weight: 500;
}

.stat-value {
  color: #1a1a1a;
  font-weight: bold;
}
</style>
