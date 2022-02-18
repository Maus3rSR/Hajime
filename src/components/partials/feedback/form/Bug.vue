<script setup lang="ts">
import { FeedbackType, useFeedback } from '@/composables/feedback'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { fields, errors, submit } = useFeedback(FeedbackType.BUG)

const onFileChange = (event: Event) => {
    if (!(event.target instanceof HTMLInputElement) || !event.target.files) return
    fields.screenshot.value = event.target.files[0]
}
</script>

<template>
    <form @submit="submit">
        <div class="grid grid-cols-2 gap-4">
            <div class="form-control col-span-2">
                <label class="label">
                    <span class="label-text">
                        {{ t('feedback.describeBug') }}
                        <span class="text-error">*</span>
                    </span>
                </label>
    
                <textarea
                    type="text"
                    class="textarea textarea-bordered textarea-sm"
                    name="description"
                    v-model="fields.description.value"
                ></textarea>
    
                <span v-if="errors.description" class="alert alert-error mt-2">
                    {{ errors.description }}
                </span>
            </div>
        
            <div class="form-control col-span-2 sm:col-auto">
                <label class="label">
                    <span class="label-text">
                        {{ t('feedback.stepsReproduce') }}
                        <span class="text-error">*</span>
                    </span>
                </label>
    
                <textarea
                    type="text"
                    class="textarea textarea-bordered textarea-sm"
                    name="reproduce"
                    v-model="fields.reproduce.value"
                ></textarea>
    
                <span v-if="errors.reproduce" class="alert alert-error mt-2">
                    {{ errors.reproduce }}
                </span>
            </div>
        
            <div class="form-control col-span-2 sm:col-auto">
                <label class="label">
                    <span class="label-text">
                        {{ t('feedback.expected') }}
                        <span class="text-error">*</span>
                    </span>
                </label>
    
                <textarea
                    type="text"
                    class="textarea textarea-bordered textarea-sm"
                    name="expected"
                    v-model="fields.expected.value"
                ></textarea>
    
                <span v-if="errors.expected" class="alert alert-error mt-2">
                    {{ errors.expected }}
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
        
            <div class="form-control col-span-2">
                <label class="label">
                    <span class="label-text">{{ t('common.screenshot') }}</span>
                </label>
                <input
                    type="file"
                    name="screenshot"
                    class="input input-bordered input-sm"
                    @change="onFileChange"
                >

                <span v-if="errors.screenshot" class="alert alert-error mt-2">
                    {{ errors.screenshot }}
                </span>
            </div>
        </div>
    </form>
</template>