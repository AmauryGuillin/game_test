<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

let alreadyX = 0;
let alreadyY = 0;

const character = ref<HTMLElement | null>(null);
const obstacle1 = ref<HTMLElement | null>(null);
const obstacle2 = ref<HTMLElement | null>(null);
const obstacle3 = ref<HTMLElement | null>(null);
const obstacle4 = ref<HTMLElement | null>(null);
const obstacle5 = ref<HTMLElement | null>(null);

if (route.params.positionX) {
  alreadyX = Number(route.params.positionX);
}

if (route.params.positionY) {
  alreadyY = Number(route.params.positionY);
}

const positionX = alreadyX !== 0 ? ref(alreadyX) : ref(window.innerWidth / 4);
const positionY = alreadyY !== 0 ? ref(alreadyY) : ref(window.innerHeight / 2);

const obstacle1PosX = 25.3;
const obstacle1PosY = 44;

const obstacle2PosX = 40;
const obstacle2PosY = 71;

const obstacle3PosX = 35;
const obstacle3PosY = 28.6;

const obstacle4PosX = 32.5;
const obstacle4PosY = 28.6;

const obstacle5PosX = 10;
const obstacle5PosY = 34;

function checkCollision(newX: number, newY: number) {
  const player = character.value;
  const obstacles = [
    obstacle1.value,
    obstacle2.value,
    obstacle3.value,
    obstacle4.value,
    obstacle5.value,
  ];

  if (player) {
    const charRect = player.getBoundingClientRect();

    const nextCharRect = {
      left: charRect.left + (newX - positionX.value),
      right: charRect.right + (newX - positionX.value),
      top: charRect.top + (newY - positionY.value),
      bottom: charRect.bottom + (newY - positionY.value),
    };

    for (const obstacle of obstacles) {
      if (obstacle) {
        const obsRect = obstacle.getBoundingClientRect();

        if (
          !(
            nextCharRect.right < obsRect.left ||
            nextCharRect.left > obsRect.right ||
            nextCharRect.bottom < obsRect.top ||
            nextCharRect.top > obsRect.bottom
          )
        ) {
          return true;
        }
      }
    }
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

  if (positionX.value >= 1150 - 100) {
    console.log("hors limites X droite");
    //positionX.value = 1150 - positionX.value;
    alert("Work in progress :)\nPlayer position is reset");
    positionX.value = window.innerWidth / 4;
    positionY.value = window.innerHeight / 2;
    //router.push(`/map3/${positionX.value}/${positionY.value}`);
  }

  if (positionX.value < 0) {
    console.log("hors limites X gauche");
    //positionX.value = 1150 - positionX.value - 200;
    alert("Work in progress :)\nPlayer position is reset");
    positionX.value = window.innerWidth / 4;
    positionY.value = window.innerHeight / 2;
    //router.push(`/map2/${positionX.value}/${positionY.value}`);
  }

  if (positionY.value >= 920 - 100) {
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
  <section class="bg-black h-screen flex justify-center items-center">
    <section
      class="h-[920px] w-[1150px] max-w-[1150px] mx-auto overflow-x-hidden relative bg-[url(/maps/route-101.png)] bg-no-repeat bg-cover bg-center"
    >
      <div class="text-white">Movement</div>
      <div
        id="character"
        ref="character"
        class="h-20 w-20 absolute z-50 flex justify-center items-center"
        :style="{ left: `${positionX}px`, top: `${positionY}px` }"
      >
        <img src="/test-char.gif" alt="player image" class="w-20 h-20" />
      </div>
      <div
        id="obstacle1"
        ref="obstacle1"
        class="absolute w-[50px] h-[52px]"
        :style="{ left: `${obstacle1PosX}%`, top: `${obstacle1PosY}%` }"
      ></div>
      <div
        id="obstacle2"
        ref="obstacle2"
        class="absolute w-[230px] h-[35px]"
        :style="{ left: `${obstacle2PosX}%`, top: `${obstacle2PosY}%` }"
      ></div>
      <div
        id="obstacle3"
        ref="obstacle3"
        class="absolute w-[250px] h-[35px]"
        :style="{ left: `${obstacle3PosX}%`, top: `${obstacle3PosY}%` }"
      ></div>
      <div
        id="obstacle4"
        ref="obstacle4"
        class="absolute w-[35px] h-[86px]"
        :style="{ left: `${obstacle4PosX}%`, top: `${obstacle4PosY}%` }"
      ></div>
      <div
        id="obstacle5"
        ref="obstacle5"
        class="absolute w-[260px] h-[35px]"
        :style="{ left: `${obstacle5PosX}%`, top: `${obstacle5PosY}%` }"
      ></div>
    </section>
  </section>
</template>
