<template>
  <div class="q-pa-md row justify-center content-end">
    <div class="col-12 text-center q-mb-md">
      <q-select
        v-model="selectedModel"
        :options="['gpt-3.5-turbo', 'gpt-4']"
        label="Model selection"
        outlined
      />
    </div>
    <div style="width: 100%; max-width: 100%">
      <q-chat-message
        v-for="(message, index) in messages"
        :key="index"
        :name="message.name"
        :text="[message.text]"
        :sent="message.sent"
      />
      <div class="row justify-center">
        <q-input
          v-model="userMessage"
          @keyup.enter="handleUserMessage"
          placeholder="Type your message and press Enter111"
          style="min-width: 165px"
        />
        <q-btn
          icon="fas fa-microphone"
          color="primary"
          @mousedown="startVoiceRecognition"
          @mouseup="stopVoiceRecognition"
          @touchend.prevent="toggleVoiceRecognition"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getChatbotResponse } from "../services/chatbotService";
import { QSelect } from "quasar";

function getSpeechRecognition() {
  return (
    window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition ||
    window.oSpeechRecognition
  );
}

export default {
  components: {
    QSelect,
  },
  data() {
    return {
      userMessage: "",
      messages: [
        // { name: 'me', text: 'hey, how are you?', sent: true },
        // { name: 'Jane', text: 'doing fine, how r you?', sent: false },
      ],
      recognition: null,
      isListening: false,
      selectedModel: "gpt-3.5-turbo",
    };
  },
  methods: {
    async handleUserMessage() {
      if (!this.userMessage) return;

      this.messages.push({ name: "me", text: this.userMessage, sent: true });
      const chatbotResponse = await getChatbotResponse(
        this.messages.map(({ name, text }) => ({
          role: name === "me" ? "user" : "assistant",
          content: text,
        })),
        {
          model: this.selectedModel,
        }
      );
      this.messages.push({
        name: "Emilia",
        text: chatbotResponse,
        sent: false,
      });
      this.userMessage = "";
    },
    startVoiceRecognition() {
      const SpeechRecognition = getSpeechRecognition();
      if (!SpeechRecognition) {
        alert("Voice recognition is not supported in your browser.");
        return;
      }

      this.recognition = new SpeechRecognition();
      this.recognition.lang = "ru-RU";
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      this.recognition.onresult = (event) => {
        console.log("Voice recognition result:", event);
        const transcript = event.results[0][0].transcript;
        this.userMessage = transcript;
      };

      this.recognition.onend = () => {
        console.log("Voice recognition ended");
        if (this.userMessage) {
          this.handleUserMessage();
        }
      };

      this.recognition.onerror = (error) => {
        console.error("Voice recognition error:", error);
        alert("Voice recognition error: " + JSON.stringify(error));
      };

      console.log("Voice recognition started");

      this.recognition.start();
    },

    stopVoiceRecognition() {
      if (this.recognition) {
        this.recognition.stop();
        this.recognition = null;
      }
    },

    toggleVoiceRecognition() {
      if (this.isListening) {
        this.stopVoiceRecognition();
      } else {
        this.startVoiceRecognition();
      }
      this.isListening = !this.isListening;
    },
  },
};
</script>
