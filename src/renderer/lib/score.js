export default class ScoreLib {

    static checkScoreValidity(score) {
        if (Array.isArray(score)) return
        throw new Error("[ScoreLib] The score is not an array")
    }

    static isDraw(score_list_1, score_list_2) {
        this.checkScoreValidity(score_list_1) | this.checkScoreValidity(score_list_2)
        return score_list_1.length === score_list_2.length
    }

    static isFirstScoreFirst(score_list, against_score_list) {
        this.checkScoreValidity(score_list) | this.checkScoreValidity(against_score_list)

        if (score_list.length > 0 && against_score_list.length === 0)
            return true
        else if (score_list.length === 0)
            return false

        const score_date = score_list[0].createdAt
        const against_score_date = against_score_list[0].createdAt

        return score_date < against_score_date
    }

    static isThereOnlyOneScore(score_list, against_score_list) {
        this.checkScoreValidity(score_list) | this.checkScoreValidity(against_score_list)
        return score_list.length === 1 && against_score_list.length === 0
    }
    
    static isBetterThan(score_list, against_score_list) {
        this.checkScoreValidity(score_list) | this.checkScoreValidity(against_score_list)
        return score_list.length > against_score_list.length
    }
}