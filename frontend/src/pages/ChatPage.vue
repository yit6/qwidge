<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import ServiceItem from '@/components/ServiceItem.vue';
import { marked } from 'marked';
import { host } from "@/ServicesService.js"
import { defineProps } from 'vue';

const props = defineProps({
  existingMessage: {
    type: String,
    required: false,
  },
});

const messages = ref<{ role: string, text: string, parsedText?: string }[]>([]);
const flavor = "Hi, thanks for visiting! I am here to help you learn about services!"
messages.value.push({role:"bot",text:flavor,parsedText:flavor})
const userInput = ref('');
let sessionData = '';

// Function to start stream, which includes parsing bot's response as markdown
async function startStream(msg: string) {
  try {
    const sessionResponse = await fetch(host+'/ai/create-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mode: 'general' }),
    });

    if (!sessionResponse.ok) {
      throw new Error('Failed to create session');
    }

    sessionData = await sessionResponse.json();

    const streamResponse = await fetch(host+'/ai/chat-with-gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionID: sessionData,
        message: msg,
      }),
    });

    if (!streamResponse.ok) {
      throw new Error('Failed to start streaming');
    }

    const reader = streamResponse.body?.getReader();
    const decoder = new TextDecoder('utf-8');
    let done = false;
    let buffer = '';

    while (!done) {
      const { value, done: streamDone } = await reader.read();
      done = streamDone;
      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;

      while (buffer.length > 1) {
        const chunkMessage = buffer.slice(0, 1);
        buffer = buffer.slice(1);

        if (messages.value.length === 0 || messages.value[messages.value.length - 1].role !== 'bot') {
          messages.value.push({ role: 'bot', text: chunkMessage });
        } else {
          messages.value[messages.value.length - 1].text += chunkMessage;
        }
      }
    }

    if (buffer.length > 0) {
      if (messages.value.length === 0 || messages.value[messages.value.length - 1].role !== 'bot') {
        messages.value.push({ role: 'bot', text: buffer });
      } else {
        messages.value[messages.value.length - 1].text += buffer;
      }
    }

    // After receiving the full response, parse the bot's text as markdown
    messages.value.forEach((msg) => {
      if (msg.role === 'bot') {
        msg.parsedText = marked(msg.text); // Convert markdown to HTML
      }
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

// Function to send user messages
async function sendUserMessage() {
  if (userInput.value.trim() !== '') {
    messages.value.push({ role: 'user', text: userInput.value });
    startStream(userInput.value);
    userInput.value = '';
  }
}

if (props.existingMessage) {
    messages.value.push({ role: 'user', text: props.existingMessage });
    startStream(props.existingMessage)
}

watch(messages, async () => {
  await nextTick();
  const chatBox = document.getElementById('chat-box');
  if (chatBox) {
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});
</script>

<template>
  <hr />
  <div id="chat-container">
    <ul id="chat-box">
      <li v-for="(msg, index) in messages" :key="index" :class="msg.role">
        <p v-if="msg.role === 'user'">{{ msg.text }}</p>
        <p v-else>{{ msg.text }}</p>
      </li>
    </ul>
    <div id="input-container">
      <input v-model="userInput" @keyup.enter="sendUserMessage" placeholder="Type a message..." />
      <button @click="sendUserMessage">Send</button>
    </div>
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
  height: 70vh;
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

#input-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

#input-container input {
  width: 80%;
  padding: 10px;
  font-size: 16px;
  border-radius: 20px;
  border: 1px solid #ccc;
}

#input-container button {
  padding: 10px 20px;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}

#input-container button:hover {
  background-color: #0f5bb5;
}
</style>
