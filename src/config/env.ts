/**
 * It can't be dynamic due to production replacement
 * @see https://vitejs.dev/guide/env-and-mode.html#production-replacement
 */
export const APP_NAME: string = import.meta.env.VITE_APP_NAME
export const APP_LOCALE_LIST: string = import.meta.env.VITE_APP_LOCALE_LIST
export const APP_LOCALE_DEFAULT: string = import.meta.env.VITE_APP_LOCALE_DEFAULT
export const APP_LOCALE_FALLBACK: string = import.meta.env.VITE_APP_LOCALE_FALLBACK
export const APP_COMPETITION_MINIMUM_ENTRANT: string = import.meta.env.VITE_APP_COMPETITION_MINIMUM_ENTRANT
export const APP_TEAM_PLACE_NUMBER_MIN: string = import.meta.env.VITE_APP_TEAM_PLACE_NUMBER_MIN
export const APP_TEAM_PLACE_NUMBER_MAX: string = import.meta.env.VITE_APP_TEAM_PLACE_NUMBER_MAX
export const APP_POOL_MIN_NUMBER: string = import.meta.env.VITE_APP_POOL_MIN_NUMBER
export const APP_POOL_MIN_SIZE: string = import.meta.env.VITE_APP_POOL_MIN_SIZE
export const APP_POOL_MAX_SIZE: string = import.meta.env.VITE_APP_POOL_MAX_SIZE
export const APP_LAST_POOL_OFFSET: string = import.meta.env.VITE_APP_LAST_POOL_OFFSET
export const APP_FIGHT_LIMIT_SCORE: string = import.meta.env.VITE_APP_FIGHT_LIMIT_SCORE
export const APP_FIGHT_NB_FOOL_GIVE_IPPON: string = import.meta.env.VITE_APP_FIGHT_NB_FOOL_GIVE_IPPON
export const APP_FIGHT_FOOL_CODE: string = import.meta.env.VITE_APP_FIGHT_FOOL_CODE
export const APP_FIGHT_SCORE_FOOL_CODE: string = import.meta.env.VITE_APP_FIGHT_SCORE_FOOL_CODE
export const APP_FIGHT_SCORE_FORFEIT_CODE: string = import.meta.env.VITE_APP_FIGHT_SCORE_FORFEIT_CODE
export const APP_FIGHT_SCORE_REACHED_CODE: string = import.meta.env.VITE_APP_FIGHT_SCORE_REACHED_CODE
export const ISSUE_EMAIL: string = import.meta.env.VITE_ISSUE_EMAIL
export const AUTHOR_PAGE: string = import.meta.env.VITE_AUTHOR_PAGE
export const GITHUB_PAGE: string = import.meta.env.VITE_GITHUB_PAGE
export const LICENSE_PAGE: string = import.meta.env.VITE_LICENSE_PAGE
export const PAYPAL_PAGE: string = import.meta.env.VITE_PAYPAL_PAGE
export const PATREON_PAGE: string = import.meta.env.VITE_PATREON_PAG