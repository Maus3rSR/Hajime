<script setup lang="ts">
import { inject } from 'vue'
import { Form as VeeFormBug, Field, ErrorMessage } from 'vee-validate'

const // Inject
    schema = inject('schema'),
    onSubmit = inject('onSubmit')
</script>

<template>
    <VeeFormBug v-slot="{ handleSubmit }" :validation-schema="schema" as="div">
        <form @submit="handleSubmit($event, onSubmit)">
            <div class="grid grid-cols-2 gap-4">
                <div class="form-control col-span-2">
                    <label class="label">
                        <span class="label-text">
                            Describe the bug
                            <span class="text-error">*</span>
                        </span>
                    </label>

                    <Field
                        class="textarea textarea-bordered textarea-sm"
                        name="description"
                        as="textarea"
                    ></Field>
                    <ErrorMessage
                        class="alert alert-error mt-2"
                        name="description"
                    />
                </div>

                <div class="form-control col-span-2 sm:col-auto">
                    <label class="label">
                        <span class="label-text">
                            Steps to reproduce the behavior
                            <span class="text-error">*</span>
                        </span>
                    </label>

                    <Field
                        class="textarea textarea-bordered textarea-sm"
                        name="reproduce"
                        as="textarea"
                    ></Field>
                    <ErrorMessage
                        class="alert alert-error mt-2"
                        name="reproduce"
                    />
                </div>

                <div class="form-control col-span-2 sm:col-auto">
                    <label class="label">
                        <span class="label-text">
                            Expected behavior
                            <span class="text-error">*</span>
                        </span>
                    </label>

                    <Field
                        class="textarea textarea-bordered textarea-sm"
                        name="expected"
                        as="textarea"
                    ></Field>
                    <ErrorMessage
                        class="alert alert-error mt-2"
                        name="expected"
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

                <div class="form-control col-span-2">
                    <label class="label">
                        <span class="label-text">Screenshot</span>
                    </label>

                    <Field
                        name="screenshot"
                        v-slot="{ handleChange, handleBlur }"
                    >
                        <input
                            type="file"
                            class="input input-bordered input-sm"
                            @change="handleChange"
                            @blur="handleBlur"
                        />
                    </Field>
                </div>
            </div>
        </form>
    </VeeFormBug>
</template>