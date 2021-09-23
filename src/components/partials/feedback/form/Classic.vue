<script setup lang="ts">
import { useFormData } from './composable'
const { fields, errors } = useFormData()
</script>

<template>
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
        />
        <span v-if="errors.email" class="alert alert-error mt-2">
            {{ errors.email }}
        </span>
    </div>
</template>