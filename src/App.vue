<script setup>
import { RouterView } from "vue-router";
import { ref, provide } from "vue";
import FooterView from "@/components/FooterView.vue";
import PrivacyModal from "@/components/PrivacyModal.vue";

const privacyOpen = ref(false);

function openPrivacy() {
  privacyOpen.value = true;
}
function closePrivacy() {
  privacyOpen.value = false;
}

provide("openPrivacy", openPrivacy);
provide("closePrivacy", closePrivacy);
</script>

<template>
  <RouterView />
  <PrivacyModal v-model:open="privacyOpen" contact-email="aliya@nbcnm.cn" />
  <FooterView contact-email="aliya@nbcnm.cn" />
</template>
