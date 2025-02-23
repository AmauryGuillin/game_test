<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const positionX = ref(Number(route.params.positionX));
const positionY = ref(Number(route.params.positionY));

function moveDot(input: KeyboardEvent) {
  if (input.key === "ArrowUp") {
    positionY.value -= 20;
  } else if (input.key === "ArrowDown") {
    positionY.value += 20;
  } else if (input.key === "ArrowLeft") {
    positionX.value -= 20;
  } else if (input.key === "ArrowRight") {
    positionX.value += 20;
  }

  if (positionX.value >= window.innerWidth - 100) {
    console.log("hors limites X droite");
    positionX.value = window.innerWidth - positionX.value;
    router.push(`/${positionX.value}/${positionY.value}`);
  }

  if (positionX.value < 0) {
    console.log("hors limites X gauche");
  }

  if (positionY.value >= window.innerHeight - 100) {
    console.log(window.innerHeight);
    console.log("hors limites Y inférieure");
  }

  if (positionY.value < 0) {
    console.log("hors limites Y supérieure");
  }
}

onMounted(() => {
  window.addEventListener("keydown", moveDot);
});

onUnmounted(() => {
  window.removeEventListener("keydown", moveDot);
});
</script>

<template>
  <section
    class="h-screen max-h-screen w-full max-w-full overflow-x-hidden bg-gray-700 relative"
  >
    <div class="text-white">Map 2</div>
    <div
      id="character"
      class="h-40 w-40 absolute"
      :style="{ left: `${positionX}px`, top: `${positionY}px` }"
    >
      <img src="/character.gif" alt="player image" class="w-full" />
    </div>
  </section>
</template>
