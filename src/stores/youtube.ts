import { ref } from "vue";
import { defineStore } from "pinia";

interface Video {
  id: string;
  title: string;
  duration: number;
}

export const useYouTubeStore = defineStore("youtube", () => {
  const channelUrl = ref("");
  const videos = ref<Video[]>([]);
  const totalDuration = ref(0);
  const isLoading = ref(false);
  const error = ref("");
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

  async function fetchVideos(url: string) {
    try {
      isLoading.value = true;
      error.value = "";
      videos.value = [];

      // 1. Get channel ID
      const channelId = await getChannelId(url);
      if (!channelId) throw new Error("Invalid channel URL");

      // 2. Get video IDs
      const videoIds = await fetchVideoIds(channelId);
      if (!videoIds.length) throw new Error("No videos found");

      // 3. Get video durations
      await fetchVideoDurations(videoIds);
      calculateTotalDuration();
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Error fetching videos";
    } finally {
      isLoading.value = false;
    }
  }

  async function getChannelId(url: string) {
    try {
      const username = url.split("@")[1]?.split("/")[0];
      if (!username) throw new Error("Invalid channel URL");

      const response = await fetch(
        `https://youtube.googleapis.com/youtube/v3/channels?part=id&forUsername=${username}&key=${apiKey}`
      );
      const data = await response.json();
      return data.items[0]?.id;
    } catch (e) {
      throw new Error("Could not find channel");
    }
  }

  async function fetchVideoIds(channelId: string) {
    const videoIds: string[] = [];
    let pageToken = "";

    while (true) {
      const response = await fetch(
        `https://youtube.googleapis.com/youtube/v3/search?part=id&channelId=${channelId}&maxResults=50&type=video&key=${apiKey}${
          pageToken ? `&pageToken=${pageToken}` : ""
        }`
      );
      const data = await response.json();

      videoIds.push(...data.items.map((item: any) => item.id.videoId));

      if (!data.nextPageToken) break;
      pageToken = data.nextPageToken;
    }

    return videoIds;
  }

  async function fetchVideoDurations(videoIds: string[]) {
    // Process in chunks of 50 videos (API limit)
    for (let i = 0; i < videoIds.length; i += 50) {
      const chunk = videoIds.slice(i, i + 50);
      const response = await fetch(
        `https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${chunk.join(
          ","
        )}&key=${apiKey}`
      );
      const data = await response.json();

      const processedVideos = data.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        duration: parseDuration(item.contentDetails.duration),
      }));

      videos.value.push(...processedVideos);
    }
  }

  function parseDuration(duration: string) {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1] || "0");
    const minutes = parseInt(match[2] || "0");
    const seconds = parseInt(match[3] || "0");

    return hours * 60 + minutes + Math.ceil(seconds / 60);
  }

  function calculateTotalDuration() {
    totalDuration.value = videos.value.reduce(
      (acc, video) => acc + video.duration,
      0
    );
  }

  return {
    channelUrl,
    videos,
    totalDuration,
    isLoading,
    error,
    fetchVideos,
  };
});
