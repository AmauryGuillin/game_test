<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const video = ref<HTMLVideoElement | null>(null);

function goToVideoTitle() {
  if (video.value && video.value.currentTime < 52) {
    video.value.currentTime = 52;
  }

  if (
    video.value &&
    video.value.currentTime > 52 &&
    video.value.currentTime <= 60
  ) {
    video.value.currentTime = 60;
  }

  if (video.value && video.value.currentTime > 60) {
    const playerUsername = prompt("enter a nickname");

    router.push(`/movement/${playerUsername}`);
  }
}

onMounted(() => {
  video.value = document.getElementById("intro-video") as HTMLVideoElement;
});
</script>

<template>
  <section
    class="bg-black min-h-screen flex flex-col justify-center items-center"
  >
    <section
      class="h-[920px] w-[1150px] max-w-[1150px] mx-auto overflow-x-hidden rounded-3xl"
    >
      <video
        id="intro-video"
        class="h-[900px] w-[1150px] max-w-[1150px]"
        mute
        autoplay
        loop
        preload="auto"
        @click="goToVideoTitle()"
      >
        <source src="/videos/Pokemon Emerald Opening.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  </section>
</template>
