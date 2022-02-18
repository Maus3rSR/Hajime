<script setup lang="ts">
import { FeedbackType, useFeedback } from '@/composables/feedback'
import { useI18n } from 'vue-i18n';

const { t } = useI18n()
const { fields, errors, submit } = useFeedback(FeedbackType.CLASSIC)
</script>

<template>
    <form @submit="submit">
        <div class="grid grid-cols-2 gap-4">
            <div class="form-control col-span-2">
                <label class="label">
                    <span class="label-text">
                        {{ t('common.message') }}
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
                        {{ t('common.email') }} <i>( {{ t('feedback.wantNotified') }} )</i>
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