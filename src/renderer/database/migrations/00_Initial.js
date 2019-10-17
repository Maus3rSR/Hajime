import definition_list from '@database/definitions'

export default {
    up: query => {
        return new Promise((resolve, reject) => {
            let table_create_promise_list = []
            Object.keys(definition_list).forEach(def_name => {
                const def = definition_list[def_name]
                table_create_promise_list.push(query.createTable('def.name', def.getDefinition(true)))
            })

            table_create_promise_list.push(
                query.bulkInsert('Formula', [{
                    name: "Matchs de poule",
                    component_list: JSON.stringify(["Pool"])
                }, {
                    name: "Arbre éliminatoire",
                    component_list: JSON.stringify(["Tree"])
                }, {
                    name: "Matchs de poule & Arbre éliminatoire",
                    component_list: JSON.stringify(["Pool", "Tree"])
                }])
            )

            Promise.all(table_create_promise_list)
                .then(resolve)
                .reject(reject)
        })
    },
    down: query => query.dropAllTables()
}