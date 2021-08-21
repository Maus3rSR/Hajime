/**
 * It can't be dynamic due to production replacement
 * @see https://vitejs.dev/guide/env-and-mode.html#production-replacement
 */

export const APP_NAME: String = import.meta.env.VITE_APP_NAME
export const APP_LOCALE_LIST: String =
    import.meta.env.VITE_APP_LOCALE_LIST.split(',').reduce(
        (list: Object, value: String) => {
            let iso, name
            ;[iso, name] = value.split(':')
            return { ...list, [iso]: name }
        },
        {}
    )
export const APP_LOCALE_DEFAULT: String = import.meta.env
    .VITE_APP_LOCALE_DEFAULT
export const APP_LOCALE_FALLBACK: String = import.meta.env
    .VITE_APP_LOCALE_FALLBACK
export const APP_COMPETITION_MINIMUM_ENTRANT: String = import.meta.env
    .VITE_APP_COMPETITION_MINIMUM_ENTRANT
export const APP_TEAM_PLACE_NUMBER_MIN: String = import.meta.env
    .VITE_APP_TEAM_PLACE_NUMBER_MIN
export const APP_TEAM_PLACE_NUMBER_MAX: String = import.meta.env
    .VITE_APP_TEAM_PLACE_NUMBER_MAX
export const APP_POOL_MIN_NUMBER: String = import.meta.env
    .VITE_APP_POOL_MIN_NUMBER
export const APP_POOL_MIN_SIZE: String = import.meta.env.VITE_APP_POOL_MIN_SIZE
export const APP_POOL_MAX_SIZE: String = import.meta.env.VITE_APP_POOL_MAX_SIZE
export const APP_LAST_POOL_OFFSET: String = import.meta.env
    .VITE_APP_LAST_POOL_OFFSET
export const APP_FIGHT_LIMIT_SCORE: String = import.meta.env
    .VITE_APP_FIGHT_LIMIT_SCORE
export const APP_FIGHT_NB_FOOL_GIVE_IPPON: String = import.meta.env
    .VITE_APP_FIGHT_NB_FOOL_GIVE_IPPON
export const APP_FIGHT_FOOL_CODE: String = import.meta.env
    .VITE_APP_FIGHT_FOOL_CODE
export const APP_FIGHT_SCORE_FOOL_CODE: String = import.meta.env
    .VITE_APP_FIGHT_SCORE_FOOL_CODE
export const APP_FIGHT_SCORE_FORFEIT_CODE: String = import.meta.env
    .VITE_APP_FIGHT_SCORE_FORFEIT_CODE
export const APP_FIGHT_SCORE_REACHED_CODE: String = import.meta.env
    .VITE_APP_FIGHT_SCORE_REACHED_CODE
export const ISSUE_EMAIL: String = import.meta.env.VITE_ISSUE_EMAIL
export const AUTHOR_PAGE: String = import.meta.env.VITE_AUTHOR_PAGE
export const GITHUB_PAGE: String = import.meta.env.VITE_GITHUB_PAGE
export const LICENSE_PAGE: String = import.meta.env.VITE_LICENSE_PAGE
export const PAYPAL_PAGE: String = import.meta.env.VITE_PAYPAL_PAGE
export const PATREON_PAGE: String = import.meta.env.VITE_PATREON_PAG
