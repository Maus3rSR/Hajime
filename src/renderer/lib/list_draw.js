const TRY_COUNT = 60

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

    reset() {
        this.list = []
        this.field_list = []
        this.moved_entry_id_list = []
        this.locked_entry_id_list = []
    }

    is_list_valid() {
        this.logger.info("[ListDrawLib.is_list_valid] --- START VERIFICATION ---")

        for (let index_field = 0; index_field < this.field_list.length; index_field++) {
            const field = this.field_list[index_field]
            let list_matrice = {}

            this.list.forEach((entry_list, list_index) => 
                entry_list.forEach(entry => {

                    if (Array.isArray(field.ignore_value_list) && field.ignore_value_list.includes(entry[field.name])) return

                    if (undefined === list_matrice[entry[field.name]]) list_matrice[entry[field.name]] = {}
                    list_matrice[entry[field.name]][list_index] = (list_matrice[entry[field.name]][list_index] || 0) + 1
                })
            )
    
            this.logger.info(`[ListDrawLib.is_list_valid] Matrice compiled for field ${field.name}`, list_matrice)
    
            for (let field_value in list_matrice) {
    
                const occurence_list = Object.values(list_matrice[field_value])
                const is_full = occurence_list.length === this.list.length
                const have_duplicates = -1 !== occurence_list.findIndex(occurence_number => occurence_number > 1)
    
                this.logger.info(`[ListDrawLib.is_list_valid] ${field.name} ${field_value} => Filled all the list : ${is_full} | Duplicates : ${have_duplicates}`)
    
                if (!is_full && have_duplicates) {
                    this.logger.warn("[ListDrawLib.is_list_valid] There are still duplicates", "--- VERIFICATION FAILED ---")
                    return false
                }
            }
        }
   
        this.logger.info("[ListDrawLib.is_list_valid] --- VERIFICATION SUCCEED ---")
        return true
    }

    repulse(list, field_list) {
        if (undefined === list || !Array.isArray(list)) throw new Error("[ListDrawLib.repulse] list is not valid")
        if (undefined === field_list || !Array.isArray(field_list) || field_list.length < 1) throw new Error("[ListDrawLib.repulse] field_list is not valid")
        
        this.reset()
        this.list = JSON.parse(JSON.stringify(list))
        this.field_list = field_list

        this.logger.info("[ListDrawLib.repulse] --- START REPULSE ---")

        let loop_count = 0
        do {

            let entry_list_duo_list = []

            // SEARCH 2 INDEXES TO REPULSE
            this.logger.info("[ListDrawLib.repulse] Searching phase...")

            for (let index_list = 0; index_list < this.list.length; index_list++) { // LIST LOOP

                const entry_list = this.list[index_list]
                let field_value_stack = {}

                entry_loop:
                for (let index_entry = 0; index_entry < entry_list.length; index_entry++) { // ENTRY LOOP
                    const entry = entry_list[index_entry]

                    for (let index_field = 0; index_field < this.field_list.length; index_field++) { // CRITERIA LOOP

                        const field = this.field_list[index_field]
                        const entry_value = entry[field.name]

                        if (Array.isArray(field.ignore_value_list) && field.ignore_value_list.includes(entry_value)) continue // false positive

                        if (this.moved_entry_id_list.includes(entry.id)) {
                            this.logger.warn(`[ListDrawLib.repulse] Can't compare with entry at list[${index_list}][${index_entry}] cause it was already moved. Continue to the next entry`, entry)
                            continue entry_loop
                        }

                        const searching_pattern = `${field.name}_${entry_value}`
                        if (undefined === field_value_stack[searching_pattern]) field_value_stack[searching_pattern] = []

                        if (field_value_stack[searching_pattern].length > 0) {
                            const entry_similar_index = field_value_stack[searching_pattern][0]
                            const entry_similar = entry_list[entry_similar_index]
                            const entry_duo_list = {
                                entry1: entry,
                                entry1_index_origin: index_entry,
                                entry2: entry_similar,
                                entry2_index_origin: entry_similar_index,
                                index_list_origin: index_list
                            }

                            entry_list_duo_list.push(entry_duo_list)
                            field_value_stack[searching_pattern].splice(entry_similar_index, 1)
                            this.locked_entry_id_list.push(entry.id, entry_similar.id)
    
                            this.logger.info(`[ListDrawLib.repulse] Found 2 similar entries with the same field ${field.name} (value : ${entry_value}) at list => [${index_list}][${index_entry}] and [${index_list}][${entry_similar_index}]`, entry_duo_list)
                        } else
                            field_value_stack[searching_pattern].push(index_entry) // We registered each index_entry per value of a field to know if there exist a similar entry for the current_entry in the loop
                            
                    } // END CRITERIA LOOP

                } // END ENTRY LOOP

            } // END LIST LOOP

            if (entry_list_duo_list.length === 0) {
                this.logger.warn("[ListDrawLib.repulse] There is nothing to repulse")
                break
            }

            this.logger.info("[ListDrawLib.repulse] Repulsing phase...")
            entry_list_duo_list.forEach(entry_duo_list => {
                this.logger.info("[ListDrawLib.repulse] --- START REPULSE PAIR ---")
                this.repulse_entry(entry_duo_list.entry1, entry_duo_list.index_list_origin, entry_duo_list.entry1_index_origin)
                this.repulse_entry(entry_duo_list.entry2, entry_duo_list.index_list_origin, entry_duo_list.entry2_index_origin, true)
                this.logger.info("[ListDrawLib.repulse] --- END REPULSE PAIR ---")
            })
            
        } while (!this.is_list_valid() && loop_count++ < TRY_COUNT)

        this.logger.info("[ListDrawLib.repulse] --- THAT'S ALL FOLKS! ---", this.list)

        if (loop_count > TRY_COUNT)
            throw new Error("[ListDrawLib.repulse] Too many loops... Prevent infinite loop issue.")

        return this.list
    }

    repulse_entry(entry, index_list_origin, index_entry_origin, reverse_loop) {
        this.logger.info("[ListDrawLib.repulse_entry] Start repulsing entry", entry)

        reverse_loop = undefined === reverse_loop ? false : true

        const canLoop = start => reverse_loop ? start >= 0 : start < this.list.length
        let index_list = reverse_loop ? this.list.length - 1 : 0
        let loop_step = reverse_loop ? -1 : 1
        let entry_index_to_remove = null
        let list_index_found = null
        
        list_loop:
        for (index_list; canLoop(index_list); index_list += loop_step) {
            const entry_list = this.list[index_list]
            
            // STEP 1 : If we find an entry with one same of repulse's criteria, we can't switch in this entry list
            for (let index_field = 0; index_field < this.field_list.length; index_field++) {
                const field = this.field_list[index_field]
                const j = entry_list.findIndex(e => e[field.name] === entry[field.name])

                if (-1 !== j) {
                    if (Array.isArray(field.ignore_value_list) && field.ignore_value_list.includes(entry_list[j][field.name])) continue // false positive
                    
                    this.logger.warn(`[ListDrawLib.repulse_entry] Entry at list[${index_list}][${j}] has a similar field ${field.name}. Continue to the next entry list`, this.list[index_list][j])
                    continue list_loop
                }
            }

            // STEP 2 : Find the entry to switch with
            const entry_list_shuffled = this.shuffle(entry_list)
            for (let index_entry = 0; index_entry < entry_list_shuffled.length; index_entry++) {

                if (parseInt(entry.id, 10) === parseInt(entry_list_shuffled[index_entry].id, 10)) continue // Can't switch with itself :-)

                if (this.moved_entry_id_list.includes(entry_list_shuffled[index_entry].id)) {
                    this.logger.warn(`[ListDrawLib.repulse_entry] Can't switch with entry at list[${index_list}][${index_entry}] cause it was already moved. Continue to the next entry`, entry_list_shuffled[index_entry])
                    continue
                }

                if (this.locked_entry_id_list.includes(entry_list_shuffled[index_entry].id)) {
                    this.logger.warn(`[ListDrawLib.repulse_entry] Can't switch with entry at list[${index_list}][${index_entry}] cause the entry will move later. Continue to the next entry`, entry_list_shuffled[index_entry])
                    continue
                }

                entry_index_to_remove = entry_list.findIndex(e => parseInt(e.id, 10) === parseInt(entry_list_shuffled[index_entry].id, 10))
                list_index_found = index_list
                
                break list_loop
            }
        }

        if (null === entry_index_to_remove) {
            this.logger.info("[ListDrawLib.repulse_entry] There is no place in the list to insert entry without having duplicates. Repulse done", JSON.parse(JSON.stringify(this.list)))
            return
        } 

        // SWITCH
        this.logger.info(`[ListDrawLib.repulse_entry] Switch with an entry at list[${list_index_found}][${entry_index_to_remove}]`, this.list[list_index_found][entry_index_to_remove])

        const removed_entry = this.list[list_index_found].splice(entry_index_to_remove, 1, entry)[0]
        this.list[index_list_origin].splice(index_entry_origin, 1, removed_entry)
        this.moved_entry_id_list.push(entry.id)

        this.logger.info("[ListDrawLib.repulse_entry] Repulse done")
    }
    shuffle(list) {
        if (!Array.isArray(list)) throw new Error("[ListDrawLib.shuffle] list is not an array")

        let list_shuffled = JSON.parse(JSON.stringify(list))

        for (let i = list_shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [list_shuffled[i], list_shuffled[j]] = [list_shuffled[j], list_shuffled[i]];
        }

        return list_shuffled
    }
}