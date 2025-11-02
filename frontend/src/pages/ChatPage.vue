<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import ServiceItem from '@/components/ServiceItem.vue';

// Define a reactive array to store the chat messages
const messages = ref<{ role: string, text: string }[]>([]);

// Function to start the stream
async function startStream() {
  try {
    // Step 1: Create a session with a POST request
    const sessionResponse = await fetch('http://localhost:8080/ai/create-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mode: 'general' }),  // Request body
    });

    if (!sessionResponse.ok) {
      throw new Error('Failed to create session');
    }

    // Step 2: Get the JSON response from the session creation
    const sessionData = await sessionResponse.json();
    console.log('Session created:', sessionData);  // Log session data if needed

    // Step 3: Start streaming after session is successfully created
    const streamResponse = await fetch('http://localhost:8080/ai/chat-with-gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionID: sessionData,  // Assuming sessionData contains sessionID
        message: 'explain to me how I can disable CORS in Node in twoa paragraphs.',
      }),
    });

    if (!streamResponse.ok) {
      throw new Error('Failed to start streaming');
    }

    // Step 4: Process the stream
    const reader = streamResponse.body?.getReader();
    const decoder = new TextDecoder('utf-8');
    let done = false;

    // Define a buffer to store the current chunk data before splitting
    let buffer = '';

    // Read the stream as chunks
    while (!done) {
      const { value, done: streamDone } = await reader!.read();
      done = streamDone;

      // Decode the chunk and append it to the buffer
      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;

      // Log the current buffer content (for debugging)
      console.log('Buffer:', buffer);

      // Split the buffer into smaller chunks (e.g., 100 characters per message)
      while (buffer.length > 1) {  // Adjust chunk size here as needed
        const chunkMessage = buffer.slice(0, 1);  // Take the first 100 characters
        buffer = buffer.slice(1);  // Remove the first 100 characters from the buffer

        // Add the smaller chunk to the messages array
        if (messages.value.length === 0 || messages.value[messages.value.length - 1].role !== 'bot') {
          // If the last message wasn't from the bot, start a new message entry for the bot
          messages.value.push({ role: 'bot', text: chunkMessage });
        } else {
          // If the last message was from the bot, append the chunk to it
          messages.value[messages.value.length - 1].text += chunkMessage;
        }
      }
    }

    // If there's any remaining text in the buffer, add it as the final message
    if (buffer.length > 0) {
      if (messages.value.length === 0 || messages.value[messages.value.length - 1].role !== 'bot') {
        // If the last message wasn't from the bot, start a new message entry for the bot
        messages.value.push({ role: 'bot', text: buffer });
      } else {
        // If the last message was from the bot, append the chunk to it
        messages.value[messages.value.length - 1].text += buffer;
      }
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

// Start the stream when the component is mounted
onMounted(() => {
  startStream();
});

// Watch messages array to auto-scroll the chat container to the bottom when new messages are added
watch(messages, async () => {
  await nextTick(); // Wait for DOM updates
  const chatBox = document.getElementById('chat-box');
  if (chatBox) {
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
  }
});
</script>

<template>
  <div id="service-framework">
    <ServiceItem />
  </div>
  <hr />
  <div id="chat-container">
    <ul id="chat-box">
      <li v-for="(msg, index) in messages" :key="index" :class="msg.role">
        <p>{{ msg.text }}</p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
#service-framework {
  padding: 20px 10vw;
}

#chat-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  height: 100vh;
  padding: 20px 10vw;
  box-sizing: border-box;
}

#chat-box {
  list-style-type: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  flex-grow: 1;
}

.bot,
.user {
  margin: 10px 0;
}

.bot p,
.user p {
  padding: 12px;
  border-radius: 20px;
  width: fit-content;
  max-width: 40%;
  word-wrap: break-word;
}

.bot {
  align-self: flex-start;
}

.bot p {
  background-color: #f0f0f0;
}

.user {
  align-self: flex-end;
  display: flex;
  justify-content: flex-end;
}

.user p {
  background-color: #1a73e8;
  color: white;
  max-width: 40%;
}
</style>