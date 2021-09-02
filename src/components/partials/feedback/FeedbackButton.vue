<script setup lang="ts">
import type { ChildComponent } from 'vue'
import { ref } from 'vue'

const // Initialization
    currentYear = new Date().getFullYear(),
    // Refs
    modal = ref<ChildComponent>()
</script>


<template>
    <button
        v-bind="$attrs"
        class="btn btn-xs btn-primary"
        @click="modal.show()"
    >
        <FontAwesomeIcon
            :icon="['far', 'handshake']"
            class="mr-1"
        ></FontAwesomeIcon>
        Feedback
    </button>

    <ModalForm ref="modal">
        <div class="form-control">
            <label class="label">
                <span class="label-text">Username</span>
            </label>
            <textarea
                v-model="message"
                type="text"
                placeholder="Message"
                class="textarea textarea-bordered textarea-sm"
            ></textarea>
        </div>

        <template #title>Feedback</template>
    </ModalForm>
</template>
