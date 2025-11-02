<script setup lang="ts">
import SearchBar from '@/components/SearchBar.vue';
import Trending from '@/components/Trending.vue';
</script>

<template>
  <div class="landing-container">
    <!-- Hero Section -->
    <div class="hero-section">
      <h1>Welcome to Qwidge</h1>
      <p class="hero-subheading">Connecting communities to services you may not know about</p>
      <button class="hero-button">Learn More</button>
    </div>

    <!-- Search Bar Section -->
    <div class="search-container">
      <p class="search-title">I want to...</p>
      <div class="search-bar-wrapper">
        <SearchBar />
      </div>
    </div>

    <!-- Trending Section -->
    <Trending />

    <!-- Offer Section -->
    <div class="offer-container">
      <p class="offer-title">Have something to offer?</p>
      <form action="http://localhost:8080/search" method="post" class="offer-form">
        <input type="text" name="url" class="offer-input" placeholder="Enter a service URL">
        <input type="submit" value="Submit Services" class="offer-submit">
      </form>
    </div>
  </div>
</template>

<style>
/* Global Dark Theme - Hardcoded */
body {
  font-family: 'Apercu', sans-serif;
  background-color: #121212 !important; /* Force the dark background */
  color: #f5f5f5 !important; /* Ensure text is light */
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

.landing-container {
  margin: 0 5vw; /* Added margin on both sides */
}

/* Hero Section */
.hero-section {
  position: relative;
  color: white;
  padding: 50px;
  text-align: center;
  height: 400px;
  background-image: url('https://www.busytourist.com/wp-content/uploads/2020/11/Things-To-Do-In-Rochester-NY.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed; /* Parallax effect */
}

.hero-section::after {
  content: '';
  position: absolute;
  bottom: 0; /* Stick to the bottom of the parent element */
  left: 0;
  margin: auto;
  width: 100%;
  height: 30%; /* This will cover 30% of the section from the bottom */
  background: linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%); /* Fade from bottom to top */
}

.hero-section h1 {
  font-size: 3rem;
  margin-bottom: 20px;
}

.hero-subheading {
  font-size: 1.2rem;
  margin-bottom: 30px;
}

.hero-button {
  padding: 15px 30px;
  background-color: #ff5722; /* Orange color */
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.hero-button:hover {
  background-color: #e64a19;
}

/* Search Section */
.search-container {
  margin: 50px auto;
  text-align: center;
}

.search-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.search-bar-wrapper {
  width: 50%;
  margin: 0 auto;
}

/* Offer Section */
.offer-container {
  background-color: #1e1e1e; /* Dark background for the offer section */
  padding: 50px;
  text-align: center;
}

.offer-title {
  font-size: 2rem; /* Increased font size */
  font-weight: bold; /* Made text bold */
  color: white; /* Changed text color to white */
  margin-bottom: 20px;
}

.offer-form {
  display: inline-block;
  margin-top: 20px;
}

.offer-input {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 250px;
  margin-right: 10px;
  background-color: #121212; /* Dark input background */
  color: white; /* Light input text color */
  font-size: 1rem;
}

.offer-submit {
  padding: 12px 20px;
  background-color: #ff5722;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
}

.offer-submit:hover {
  background-color: #e64a19;
}
</style>