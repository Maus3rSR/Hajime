export default class FightLib {
    
    constructor(entry_list, min_per_pool) {
        if (!Array.isArray(entry_list))
            throw new Error("entry_list is not an array")
        
        this.matrix = {}
        this.min_per_pool = min_per_pool
        this.entry_list = entry_list
        this.createMatrix()
    }

    static findFighterFightMeta(model, fighter1, fighter2) {
        const fighter1_id = !!fighter1 ? fighter1.id : null
        const fighter2_id = !!fighter2 ? fighter2.id : null
    
        return !!model.fighter_fight_meta_list ?
            model.fighter_fight_meta_list.find(ffm => ffm.fighter1_id === fighter1_id && ffm.fighter2_id === fighter2_id) :
            undefined
    }

    static isLocked(fight, fighter1, fighter2) {
        const fighter_fight_meta = this.findFighterFightMeta(fight, fighter1, fighter2)
        return !!fighter_fight_meta && fighter_fight_meta.locked
    }

    static getComment(fight, fighter1, fighter2) {
        const fighter_fight_meta = this.findFighterFightMeta(fight, fighter1, fighter2)
        return !!fighter_fight_meta && !!fighter_fight_meta.comment ? fighter_fight_meta.comment : undefined
    }

    createMatrix() {
        this.entry_list.forEach(entry => this.matrix[entry.number] = this.entry_list.map(e => e.number).filter(n => n !== entry.number))
    }

    getEntry(entry_list, pool_entry_number) {
        return entry_list.find(entry => entry.number === pool_entry_number)
    }

    compile() {
        if (this.entry_list.length < this.min_per_pool)
            return []

        const total_fight = this.entry_list.length * (this.entry_list.length - 1) / 2
        let fight_list = []

        const change_j_each = 2
        let j_cooldown = change_j_each - 1 // switch directly after one loop
        let n = 1 // number of the pool
        let j = 0 // array index in the matrix
        do {
            if (n > this.entry_list.length)
                n = n - this.entry_list.length

            while (this.matrix[n].length === 0) {
                if (n === this.entry_list.length)
                    n = 0
                n++
            }

            if (j_cooldown === 0) {
                j = j === 0 ? j = 1 : 0
                j_cooldown = change_j_each
            }

            if (j !== 0)
                j = this.matrix[n].length - 1

            /**
             * FIND FIGHTER 1 VS FIGHTER 2
             */
            let n2 = this.matrix[n].splice(j, 1)[0] // retrieve n2 and remove from the row n
            this.matrix[n2].splice(this.matrix[n2].findIndex(el => el === n), 1) // remove the value n from the row n2 too because a fight is not two-legged

            let fight = [this.getEntry(this.entry_list, n), this.getEntry(this.entry_list, n2)]

            if (n2 < n) // ordering
                fight.reverse()

            fight_list.push(fight)
            /**
             * END FIND FIGHTER 1 VS FIGHTER 2
             */

            j_cooldown--
            n += 2
        } while (fight_list.length !== total_fight)

        return fight_list
    }
}