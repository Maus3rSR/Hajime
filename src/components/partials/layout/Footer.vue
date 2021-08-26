<script lang="ts">
import type { ChildComponent } from 'vue'
import { defineComponent, ref } from 'vue'
import {
    APP_NAME,
    //AUTHOR_PAGE,
    WEBSITE_PAGE,
    GITHUB_PAGE,
    LICENSE_PAGE,
    PAYPAL_PAGE,
    PATREON_PAGE,
} from '/config/env.ts'

export default defineComponent({
    name: 'Footer',
    setup() {
        const currentYear = new Date().getFullYear(),
            modalConfirmation = ref<ChildComponent>()

        return {
            APP_VERSION: __APP_VERSION__,
            APP_NAME,
            WEBSITE_PAGE,
            LICENSE_PAGE,
            GITHUB_PAGE,
            PAYPAL_PAGE,
            PATREON_PAGE,
            currentYear,
            modalConfirmation,
        }
    },
})
</script>

<template>
    <footer
        class="
            flex
            place-content-between
            items-center
            py-1
            px-6
            bg-neutral
            text-neutral-content text-xs
        "
    >
        <div class="flex items-center">
            <span class="btn btn-xs btn-ghost no-animation">
                <font-awesome-icon
                    :icon="['fas', 'code']"
                    class="mr-1"
                ></font-awesome-icon>
                {{ APP_VERSION }}
            </span>
            <a
                :href="PAYPAL_PAGE"
                class="btn btn-xs btn-ghost no-animation"
                target="_blank"
            >
                <font-awesome-icon
                    class="mr-1"
                    :icon="['fab', 'paypal']"
                ></font-awesome-icon>
                Paypal
            </a>
            <a
                :href="PATREON_PAGE"
                class="btn btn-xs btn-ghost no-animation"
                target="_blank"
            >
                <font-awesome-icon
                    class="mr-1"
                    :icon="['fab', 'patreon']"
                ></font-awesome-icon>
                Patreon
            </a>
        </div>

        <div class="flex items-center">
            <button
                class="btn btn-xs btn-primary"
                @click="modalConfirmation.show()"
            >
                <FontAwesomeIcon
                    :icon="['far', 'handshake']"
                    class="mr-1"
                ></FontAwesomeIcon>
                Feedback
            </button>
            <ModalConfirmation
                danger
                ref="modalConfirmation"
            ></ModalConfirmation>
        </div>

        <div class="flex items-center">
            {{ currentYear }} - Opensource
            <a
                :href="LICENSE_PAGE"
                title="License"
                class="link link-primary font-bold link-hover ml-1 mr-1"
                target="_blank"
            >
                MIT
            </a>
            Licensed project
            <a
                :href="WEBSITE_PAGE"
                :title="APP_NAME"
                class="link link-primary font-bold link-hover ml-1 mr-1"
                target="_blank"
            >
                {{ APP_NAME }}
            </a>
            -
            <a
                :href="GITHUB_PAGE"
                class="link ml-1"
                title="Github"
                target="_blank"
            >
                <FontAwesomeIcon :icon="['fab', 'github']"></FontAwesomeIcon>
            </a>
        </div>
    </footer>
</template>