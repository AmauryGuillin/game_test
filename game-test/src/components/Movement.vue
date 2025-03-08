<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

let alreadyX = 0;
let alreadyY = 0;

const character = ref<HTMLElement | null>(null);
const obstacle1 = ref<HTMLElement | null>(null);

if (route.params.positionX) {
  alreadyX = Number(route.params.positionX);
}

if (route.params.positionY) {
  alreadyY = Number(route.params.positionY);
}

const positionX = alreadyX !== 0 ? ref(alreadyX) : ref(window.innerWidth / 2);
const positionY = alreadyY !== 0 ? ref(alreadyY) : ref(window.innerHeight / 2);

const obstacle1PosX = 25;
const obstacle1PosY = 40;

function checkCollision(newX: number, newY: number) {
  const player = character.value;
  const obstacle = obstacle1.value;

  if (player && obstacle) {
    const charRect = player.getBoundingClientRect();
    const obsRect = obstacle.getBoundingClientRect();

    const nextCharRect = {
      left: charRect.left + (newX - positionX.value),
      right: charRect.right + (newX - positionX.value),
      top: charRect.top + (newY - positionY.value),
      bottom: charRect.bottom + (newY - positionY.value),
    };

    return !(
      nextCharRect.right < obsRect.left ||
      nextCharRect.left > obsRect.right ||
      nextCharRect.bottom < obsRect.top ||
      nextCharRect.top > obsRect.bottom
    );
  }
  return false;
}

function moveDot(input: KeyboardEvent) {
  let newX = positionX.value;
  let newY = positionY.value;

  if (input.key === "ArrowUp") {
    newY -= 20;
    if (!checkCollision(newX, newY)) {
      positionY.value = newY;
    }
  } else if (input.key === "ArrowDown") {
    newY += 20;
    if (!checkCollision(newX, newY)) {
      positionY.value = newY;
    }
  } else if (input.key === "ArrowLeft") {
    newX -= 20;
    if (!checkCollision(newX, newY)) {
      positionX.value = newX;
    }
  } else if (input.key === "ArrowRight") {
    newX += 20;
    if (!checkCollision(newX, newY)) {
      positionX.value = newX;
    }
  }

  if (positionX.value >= window.innerWidth - 100) {
    console.log("hors limites X droite");
    positionX.value = window.innerWidth - positionX.value;
    router.push(`/map3/${positionX.value}/${positionY.value}`);
  }

  if (positionX.value < 0) {
    console.log("hors limites X gauche");
    positionX.value = window.innerWidth - positionX.value - 200;
    router.push(`/map2/${positionX.value}/${positionY.value}`);
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
    class="h-screen max-h-screen w-full max-w-full overflow-x-hidden relative bg-[url(/maps/route-101.png)] bg-no-repeat bg-cover bg-center"
  >
    <div class="text-white">Movement</div>
    <div
      id="character"
      ref="character"
      class="h-24 w-24 absolute z-50 flex justify-center items-center"
      :style="{ left: `${positionX}px`, top: `${positionY}px` }"
    >
      <img src="/test-char.gif" alt="player image" class="w-24 h-24" />
    </div>
    <div
      id="obstacle1"
      ref="obstacle1"
      class="absolute w-[95px] h-[92px] flex justify-center items-center"
      :style="{ left: `${obstacle1PosX}%`, top: `${obstacle1PosY}%` }"
    ></div>
  </section>
</template>
