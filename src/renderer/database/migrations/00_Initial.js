import definition_list from '@database/definitions'

const getCreateTablePromise = (queryInterface, definition) => {
    return queryInterface.createTable(definition.name, definition.getDefinition(true))
}

const getConstraintPromise = (queryInterface, table_name, constraint_option) => {
    return queryInterface.addConstraint(table_name, constraint_option.field_list, constraint_option.key)
}

export default {
    up: queryInterface => {

        const name_list = Object.keys(definition_list)
        const INSERT_DATA = [{
            name: "Matchs de poule",
            component_list: JSON.stringify(["Pool"])
        }, {
            name: "Arbre éliminatoire",
            component_list: JSON.stringify(["Tree"])
        }, {
            name: "Matchs de poule & Arbre éliminatoire",
            component_list: JSON.stringify(["Pool", "Tree"])
        }]

        let promise = getCreateTablePromise(queryInterface, definition_list[name_list[0]]) // Chaining promise to create tables in order
        for (let i = 1; i < name_list.length; i++)
            promise = promise.then(() => getCreateTablePromise(queryInterface, definition_list[name_list[i]]))
            
        name_list.forEach(name => { // Chaining promise to create tables constraints in order
            const def = definition_list[name]
            
            if (undefined === def.constraint_list)
                return
            
            def.constraint_list.forEach(constraint_option => promise = promise.then(() => getConstraintPromise(queryInterface, def.name, constraint_option)))
        })

        return promise.then(() => queryInterface.bulkInsert('Formula', INSERT_DATA))
    },
    down: queryInterface => queryInterface.dropAllTables()
}