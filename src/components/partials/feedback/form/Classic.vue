<script setup lang="ts">
import { FeedbackType, useFeedback } from '@/composables/feedback'
const { fields, errors, submit } = useFeedback(FeedbackType.CLASSIC)
</script>

<template>
    <form @submit="submit">
        <div class="grid grid-cols-2 gap-4">
            <div class="form-control col-span-2">
                <label class="label">
                    <span class="label-text">
                        Message
                        <span class="text-error">*</span>
                    </span>
                </label>
    
                <textarea
                    type="text"
                    class="textarea textarea-bordered textarea-sm"
                    name="description"
                    v-model="fields.message.value"
                ></textarea>
    
                <span v-if="errors.message" class="alert alert-error mt-2">
                    {{ errors.message }}
                </span>
            </div>
        
            <div class="form-control col-span-2">
                <label class="label">
                    <span class="label-text">
                        Email <i>(if you want to be notified)</i>
                    </span>
                </label>
    
                <input
                    type="email"
                    class="input input-bordered input-sm"
                    name="email"
                    v-model="fields.email.value"
                >
    
                <span v-if="errors.email" class="alert alert-error mt-2">
                    {{ errors.email }}
                </span>
            </div>
        </div>
    </form>
</template>