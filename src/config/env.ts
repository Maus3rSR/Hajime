/**
 * It can't be dynamic due to production replacement
 * @see https://vitejs.dev/guide/env-and-mode.html#production-replacement
 */
export const APP_NAME: string = import.meta.env.VITE_APP_NAME as string
export const APP_LOCALE_LIST: string =
    (import.meta.env.VITE_APP_LOCALE_LIST as string).split(',').reduce(
        (list: Object, value: string) => {
            let iso, name
                ;[iso, name] = value.split(':')
            return { ...list, [iso]: name }
        },
        {}
    ) as string
export const APP_LOCALE_DEFAULT: string = import.meta.env.VITE_APP_LOCALE_DEFAULT as string
export const APP_LOCALE_FALLBACK: string = import.meta.env.VITE_APP_LOCALE_FALLBACK as string
export const APP_COMPETITION_MINIMUM_ENTRANT: string = import.meta.env.VITE_APP_COMPETITION_MINIMUM_ENTRANT as string
export const APP_TEAM_PLACE_NUMBER_MIN: string = import.meta.env.VITE_APP_TEAM_PLACE_NUMBER_MIN as string
export const APP_TEAM_PLACE_NUMBER_MAX: string = import.meta.env.VITE_APP_TEAM_PLACE_NUMBER_MAX as string
export const APP_POOL_MIN_NUMBER: string = import.meta.env.VITE_APP_POOL_MIN_NUMBER as string
export const APP_POOL_MIN_SIZE: string = import.meta.env.VITE_APP_POOL_MIN_SIZE as string
export const APP_POOL_MAX_SIZE: string = import.meta.env.VITE_APP_POOL_MAX_SIZE as string
export const APP_LAST_POOL_OFFSET: string = import.meta.env.VITE_APP_LAST_POOL_OFFSET as string
export const APP_FIGHT_LIMIT_SCORE: string = import.meta.env.VITE_APP_FIGHT_LIMIT_SCORE as string
export const APP_FIGHT_NB_FOOL_GIVE_IPPON: string = import.meta.env.VITE_APP_FIGHT_NB_FOOL_GIVE_IPPON as string
export const APP_FIGHT_FOOL_CODE: string = import.meta.env.VITE_APP_FIGHT_FOOL_CODE as string
export const APP_FIGHT_SCORE_FOOL_CODE: string = import.meta.env.VITE_APP_FIGHT_SCORE_FOOL_CODE as string
export const APP_FIGHT_SCORE_FORFEIT_CODE: string = import.meta.env.VITE_APP_FIGHT_SCORE_FORFEIT_CODE as string
export const APP_FIGHT_SCORE_REACHED_CODE: string = import.meta.env.VITE_APP_FIGHT_SCORE_REACHED_CODE as string
export const WEBHOOK_FEEDBACK_URL: string = import.meta.env.VITE_WEBHOOK_FEEDBACK_URL as string
export const AUTHOR_PAGE: string = import.meta.env.VITE_AUTHOR_PAGE as string
export const WEBSITE_PAGE: string = import.meta.env.VITE_WEBSITE_PAGE as string
export const GITHUB_PAGE: string = import.meta.env.VITE_GITHUB_PAGE as string
export const LICENSE_PAGE: string = import.meta.env.VITE_LICENSE_PAGE as string
export const PAYPAL_PAGE: string = import.meta.env.VITE_PAYPAL_PAGE as string
export const PATREON_PAGE: string = import.meta.env.VITE_PATREON_PAGE as string
