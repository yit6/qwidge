<script setup lang="ts">
let list = [
  "hire someone to clean your house...",
  "book a dog walker...",
  "find a handyman to fix a leaky faucet...",
  "hire a personal shopper...",
  "book a lawn care service...",
  "hire a moving company...",
  "book a professional organizer...",
  "find a plumber for bathroom repairs...",
  "hire a photographer for family portraits...",
  "book a freelance graphic designer...",
  "hire a personal chef for a dinner party...",
  "book a car detailer...",
  "find someone to assemble furniture...",
  "hire an event planner...",
  "book a housekeeper for deep cleaning...",
  "find a babysitter for the weekend...",
  "hire a personal trainer for fitness sessions...",
  "book a massage therapist...",
  "find a pet sitter for vacation...",
  "hire a tutor for math lessons...",
  "book a home security installation service...",
  "hire a web developer for a website redesign...",
  "find someone to run errands...",
  "hire a landscaper to redesign the garden...",
  "book a party DJ for an event...",
  "hire a handyman to fix electrical issues...",
  "find a mover to help with packing...",
  "book a house painter...",
  "hire a cleaner for post-construction work...",
  "find a local chef for catering...",
  "hire someone to walk your dog and train them..."
];

let placeholder = list[Math.floor(Math.random() * list.length)];
</script>

<template>
    <div id="searchbar">
      <div id="searchbar-logo">
        <img src="../assets/ailogo.svg" width="32" height="32" alt="">
      </div>
      <input :placeholder="placeholder"/>
    </div>
</template>

<style scoped>
#searchbar {
  width: 100%;
  height: max-content;
  display: flex;
  border: 3px solid black;
  border-radius: 12px;
  margin: auto;
}

#searchbar input {
  width: 100%;
  border: 0;
  border-radius: 0 10px 10px 0;
  font-size: medium;
}

#searchbar input:focus {
  outline: none;
}

#searchbar:has(input:focus) {
  filter: brightness(0.95);
}

#searchbar-logo {
  background-color: white;
  border-radius: 10px 0 0 10px;
  height: 100%;
  display: flex;
}

#searchbar-logo img {
  margin: auto 10px;
}
</style>