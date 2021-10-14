<script setup lang="ts">
import { inject } from 'vue'
import { Form as VeeFormClassic, Field, ErrorMessage } from 'vee-validate'

const // Inject
    schema = inject('schema'),
    onSubmit = inject('onSubmit')
</script>

<template>
    <VeeFormClassic
        v-slot="{ handleSubmit }"
        :validation-schema="schema"
        as="div"
    >
        <form @submit="handleSubmit($event, onSubmit)">
            <div class="grid grid-cols-2 gap-4">
                <div class="form-control col-span-2">
                    <label class="label">
                        <span class="label-text">
                            Message
                            <span class="text-error">*</span>
                        </span>
                    </label>

                    <Field
                        class="textarea textarea-bordered textarea-sm"
                        name="message"
                        as="textarea"
                    ></Field>
                    <ErrorMessage
                        class="alert alert-error mt-2"
                        name="message"
                    />
                </div>

                <div class="form-control col-span-2">
                    <label class="label">
                        <span class="label-text">
                            Email <i>(if you want to be notified)</i>
                        </span>
                    </label>

                    <Field
                        class="input input-bordered input-sm"
                        name="email"
                        type="email"
                    ></Field>
                    <ErrorMessage class="alert alert-error mt-2" name="email" />
                </div>
            </div>
        </form>
    </VeeFormClassic>
</template>