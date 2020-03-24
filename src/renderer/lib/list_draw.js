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
        this.List = JSON.parse(JSON.stringify(list))
    }

    reset() {
        this.field_list = []
        this.blocked_entry_list = []
        this.ignore_value_list = []
    }

    is_list_valid() {
        this.logger.info("[ListDrawLib.is_list_valid] Start verification")

        for (let index_field = 0; index_field < this.field_list.length; index_field++) {
            const field = this.field_list[index_field]
            let list_matrice = {}

            this.List.forEach((entry_list, list_index) => 
                entry_list.forEach(entry => {

                    if (Array.isArray(field.ignore_value_list) && field.ignore_value_list.includes(entry[field.name])) return

                    if (undefined === list_matrice[entry[field.name]]) list_matrice[entry[field.name]] = {}
                    list_matrice[entry[field.name]][list_index] = (list_matrice[entry[field.name]][list_index] || 0) + 1
                })
            )
    
            this.logger.info(`[ListDrawLib.is_list_valid] Matrice compiled for field ${field.name}`, list_matrice)
    
            for (let field_value in list_matrice) {
    
                const occurence_list = Object.values(list_matrice[field_value])
                const is_full = occurence_list.length === this.List.length
                const have_duplicates = -1 !== occurence_list.findIndex(occurence_number => occurence_number > 1)
    
                this.logger.info(`[ListDrawLib.is_list_valid] ${field.name} ${field_value} => Filled all the list : ${is_full} | Duplicates : ${have_duplicates}`)
    
                if (!is_full && have_duplicates) {
                    this.logger.warn("[ListDrawLib.is_list_valid] There are still duplicates, verification failed")
                    return false
                }
            }
        }
   
        this.logger.info("[ListDrawLib.is_list_valid] Everything is OK, verification succeed")
        return true
    }

    repulse(field_list) {
        if (undefined === field_list || !Array.isArray(field_list) || field_list.length < 1) throw new Error("[ListDrawLib.repulse] field_list is not valid")

        this.logger.info("[ListDrawLib.repulse] --- START REPULSE ---")

        this.field_list = field_list

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

                    for (let index_field = 0; index_field < this.field_list.length; index_field++) {
                        const field = this.field_list[index_field]

                        if (Array.isArray(field.ignore_value_list) && field.ignore_value_list.includes(entry[field.name])) continue

                        const searching_pattern = `${field.name}_${entry[field.name]}`

                        if (undefined !== field_value_list[searching_pattern] && field_value_list[searching_pattern].length > 0) {
                            entry_duo_list.entry1 = entry
                            entry_duo_list.entry1_index_origin = index_entry
                            entry_duo_list.entry2 = entry_list[field_value_list[searching_pattern][0]]
                            entry_duo_list.entry2_index_origin = field_value_list[searching_pattern][0]
                            index_list_origin = index_list
    
                            this.logger.info(`[ListDrawLib.repulse] Found 2 similar entries with the same field ${field.name} (value : ${entry[field.name]})`, entry_duo_list)
    
                            break list_loop
                        }
    
                        if (undefined === field_value_list[searching_pattern]) field_value_list[searching_pattern] = []
                        field_value_list[searching_pattern].push(index_entry)
                    }

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

        this.logger.info("[ListDrawLib.repulse] --- THAT'S ALL FOLKS! ---", this.List)
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
            
            for (let index_field = 0; index_field < this.field_list.length; index_field++) { // If we find an entry with one same of repulse's criteria, we can't switch in this pool

                const field = this.field_list[index_field]
                const j = entry_list.findIndex(e => e[field.name] === entry[field.name])

                if (-1 !== j) {
                    if (Array.isArray(field.ignore_value_list) && field.ignore_value_list.includes(entry_list[j][field.name])) continue // false positive
                    
                    this.logger.warn(`[ListDrawLib.repulse_entry] Entry at list[${index_list}][${j}] has a similar field ${field.name}. Continue to the next pool`, this.List[index_list][j])
                    continue list_loop
                }
            }

            const entry_list_shuffled = this.shuffle(entry_list)
            for (let index_entry = 0; index_entry < entry_list_shuffled.length; index_entry++) { // Find the entry to switch with
                if (this.blocked_entry_list.includes(entry_list_shuffled[index_entry].id)) continue

                entry_index_to_remove = entry_list.findIndex(e => parseInt(e.id, 10) === parseInt(entry_list_shuffled[index_entry].id, 10))
                list_index_found = index_list
                
                break list_loop
            }
        }

        if (null === entry_index_to_remove) {
            this.logger.warn("[ListDrawLib.repulse_entry] There is no place in the list to insert entry without having duplicates", JSON.parse(JSON.stringify(this.List)))
            return
        } 

        // SWITCH
        this.logger.info(`[ListDrawLib.repulse_entry] Switch with an entry at list[${list_index_found}][${entry_index_to_remove}]`, this.List[list_index_found][entry_index_to_remove])

        const removed_entry = this.List[list_index_found].splice(entry_index_to_remove, 1, entry)[0]
        this.List[index_list_origin].splice(index_entry_origin, 1, removed_entry)
        this.blocked_entry_list.push(entry.id)

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