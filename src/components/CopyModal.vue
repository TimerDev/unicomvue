<template>
  <div class="fixed inset-0 z-50" v-show="open">
    <div class="absolute inset-0 bg-zinc-900/50 dark:bg-black/80"></div>
    <div class="relative mx-auto mt-24 w-[92vw] max-w-md">
      <div class="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">复制凭证</div>
            <div class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{{ packageName || "选择要复制的凭证类型" }}</div>
          </div>
          <button
            type="button"
            @click="close"
            class="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition"
          >
            ✕
          </button>
        </div>

        <div class="mt-6 space-y-3">
          <!-- AppID -->
          <button
            type="button"
            @click="copyAppId"
            class="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-left transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-750"
          >
            <div class="flex items-center justify-between gap-3">
              <div>
                <div class="text-xs font-medium text-zinc-500 dark:text-zinc-400">AppID</div>
                <div class="mt-1 font-mono text-sm text-zinc-900 break-all dark:text-zinc-100">
                  {{ appId ? (appId.length > 40 ? appId.substring(0, 40) + '...' : appId) : '—' }}
                </div>
              </div>
              <span class="shrink-0 text-lg">📋</span>
            </div>
          </button>

          <!-- ECS Token -->
          <button
            type="button"
            @click="copyEcsToken"
            class="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-left transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-750"
          >
            <div class="flex items-center justify-between gap-3">
              <div>
                <div class="text-xs font-medium text-zinc-500 dark:text-zinc-400">ECS Token</div>
                <div class="mt-1 font-mono text-sm text-zinc-900 break-all dark:text-zinc-100">
                  {{ ecsToken ? (ecsToken.length > 40 ? ecsToken.substring(0, 40) + '...' : ecsToken) : '—' }}
                </div>
              </div>
              <span class="shrink-0 text-lg">🔐</span>
            </div>
          </button>

          <!-- Token Online -->
          <button
            type="button"
            @click="copyTokenOnline"
            class="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-left transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-750"
          >
            <div class="flex items-center justify-between gap-3">
              <div>
                <div class="text-xs font-medium text-zinc-500 dark:text-zinc-400">Token Online</div>
                <div class="mt-1 font-mono text-sm text-zinc-900 break-all dark:text-zinc-100">
                  {{ tokenOnline ? (tokenOnline.length > 40 ? tokenOnline.substring(0, 40) + '...' : tokenOnline) : '—' }}
                </div>
              </div>
              <span class="shrink-0 text-lg">✨</span>
            </div>
          </button>
        </div>

        <div v-if="copyStatus" class="mt-4 rounded-lg px-3 py-2 text-xs font-medium" :class="copyStatus.success ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'">
          {{ copyStatus.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  open: { type: Boolean, required: true },
  packageName: { type: String, default: "" },
  appId: { type: String, default: "" },
  ecsToken: { type: String, default: "" },
  tokenOnline: { type: String, default: "" },
});

const emit = defineEmits(["update:open"]);

const copyStatus = ref(null);

function close() {
  emit("update:open", false);
  copyStatus.value = null;
}

async function copyToClipboard(text, label) {
  if (!text) {
    copyStatus.value = { success: false, message: `${label} 不可用` };
    setTimeout(() => { copyStatus.value = null; }, 2000);
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    copyStatus.value = { success: true, message: `${label} 已复制到剪贴板` };
    setTimeout(() => { copyStatus.value = null; }, 2000);
  } catch (e) {
    copyStatus.value = { success: false, message: `${label} 复制失败` };
    setTimeout(() => { copyStatus.value = null; }, 2000);
  }
}

function copyAppId() {
  copyToClipboard(props.appId, "AppID");
}

function copyEcsToken() {
  copyToClipboard(props.ecsToken, "ECS Token");
}

function copyTokenOnline() {
  copyToClipboard(props.tokenOnline, "Token Online");
}
</script>
