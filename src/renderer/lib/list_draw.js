export default class ListDrawLib {

    constructor(logging) {
        this.logging = undefined === logging ? false : true
        this.reset()
    }

    get logger() {
        return {
            info: this.logging ? console.log : () => {},
            warn: this.logging ? console.warn : () => {},
            error: this.logging ? console.error : () => {},
        }
    }

    get list() {
        return this.List;
    }

    set list(list) {
        this.reset()
        this.List = JSON.parse(JSON.stringify(list));
    }

    reset() {
        this.blocked_entry_list = []
    }

    is_list_valid() {
        this.logger.info("[ListDrawLib.is_list_valid] Start verification")

        let list_matrice = {}

        this.List.forEach((entry_list, list_index) => 
            entry_list.forEach(entry => {
                if (undefined === list_matrice[entry[this.field]]) list_matrice[entry[this.field]] = {}
                list_matrice[entry[this.field]][list_index] = (list_matrice[entry[this.field]][list_index] || 0) + 1
            })
        )

        this.logger.info("[ListDrawLib.is_list_valid] Matrice compiled", list_matrice)

        for (let field_value in list_matrice) {

            const occurence_list = Object.values(list_matrice[field_value])
            const is_full = occurence_list.length === this.List.length
            const have_duplicates = -1 !== occurence_list.findIndex(occurence_number => occurence_number > 1)

            this.logger.info(`[ListDrawLib.is_list_valid] ${this.field} ${field_value} => Filled all the list : ${is_full} | Duplicates : ${have_duplicates}`)

            if (!is_full && have_duplicates) {
                this.logger.warn("[ListDrawLib.is_list_valid] There are still duplicates, verification failed")
                return false
            }
        }
   
        this.logger.info("[ListDrawLib.is_list_valid] Everything is OK, verification succeed")
        return true
    }

    repulse(field) {
        if (undefined === field) throw new Error("[ListDrawLib.repulse] field is undefined")

        this.logger.info("[ListDrawLib.repulse] Repulsing...")

        this.field = field

        do {
            let entry_duo_list = { entry1: null, entry1_index_origin: null, entry2: null, entry2_index_origin: null }
            let index_list_origin = null

            // SEARCH 2 INDEXES TO REPULSE
            list_loop:
            for (let index_list = 0; index_list < this.List.length; index_list++) {

                const entry_list = this.List[index_list]
                let field_value_list = {}

                for (let index_entry = 0; index_entry < entry_list.length; index_entry++) {
                    const entry = entry_list[index_entry]

                    if (undefined !== field_value_list[entry[this.field]] && field_value_list[entry[this.field]].length > 0) {
                        entry_duo_list.entry1 = entry
                        entry_duo_list.entry1_index_origin = index_entry
                        entry_duo_list.entry2 = entry_list[field_value_list[entry[this.field]][0]]
                        entry_duo_list.entry2_index_origin = field_value_list[entry[this.field]][0]
                        index_list_origin = index_list

                        this.logger.info(`[ListDrawLib.repulse] Found 2 similar entries with the same field ${this.field} (value : ${entry[this.field]})`, entry_duo_list)

                        break list_loop
                    }

                    if (undefined === field_value_list[entry[this.field]]) field_value_list[entry[this.field]] = []
                    field_value_list[entry[this.field]].push(index_entry)
                }
            }

            if (null === index_list_origin) {
                this.logger.warn("[ListDrawLib.repulse] There is nothing to repulse")
                break
            }

            this.logger.info("[ListDrawLib.repulse] Repulsing phase")
            // REPULSE INDEXES FAR AWAY !
            this.repulse_entry(entry_duo_list.entry1, index_list_origin, entry_duo_list.entry1_index_origin)
            this.repulse_entry(entry_duo_list.entry2, index_list_origin, entry_duo_list.entry2_index_origin, true)
            
        } while (!this.is_list_valid())

        this.logger.info("[ListDrawLib.repulse] That's all folks!", this.List)
    }

    repulse_entry(entry, index_list_origin, index_entry_origin, reverse_loop) {
        this.logger.info("[ListDrawLib.repulse_entry] Start repulsing entry", entry)

        reverse_loop = undefined === reverse_loop ? false : true

        const canLoop = start => reverse_loop ? start >= 0 : start < this.List.length
        let index_list = reverse_loop ? this.List.length - 1 : 0
        let loop_step = reverse_loop ? -1 : 1
        let entry_index_to_remove = null
        let list_index_found = null
        
        list_loop:
        for (index_list; canLoop(index_list); index_list += loop_step) {
            const entry_list = this.List[index_list]
            if (-1 !== entry_list.findIndex(e => e[this.field] === entry[this.field])) continue
            
            for (let index_entry = 0; index_entry < entry_list.length; index_entry++) {
                if (-1 !== this.List[index_list_origin].findIndex(entry => entry[this.field] === entry_list[index_entry][this.field])) continue
                entry_index_to_remove = index_entry
                list_index_found = index_list
                break list_loop
            }

            this.logger.warn("[ListDrawLib.repulse_entry] There is no place in the list to insert entry without having duplicates", JSON.parse(JSON.stringify(this.List[index_list])))
        }

        if (null === entry_index_to_remove) return

        // SWITCH
        this.logger.info(`[ListDrawLib.repulse_entry] Switch with an entry at list[${list_index_found}][${entry_index_to_remove}]`, this.List[list_index_found][entry_index_to_remove])
        const removed_entry = this.List[list_index_found].splice(entry_index_to_remove, 1, entry)[0]
        this.List[index_list_origin].splice(index_entry_origin, 1, removed_entry)

        this.logger.info("[ListDrawLib.repulse_entry] Repulse done")
    }
}