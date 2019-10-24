import definition_list from '@database/definitions'

const getPromise = (queryInterface, definition) => queryInterface.createTable(definition.name, definition.getDefinition(true))

export default {
    up: queryInterface => {
        const insert_data = [{
            name: "Matchs de poule",
            component_list: JSON.stringify(["Pool"])
        }, {
            name: "Arbre éliminatoire",
            component_list: JSON.stringify(["Tree"])
        }, {
            name: "Matchs de poule & Arbre éliminatoire",
            component_list: JSON.stringify(["Pool", "Tree"])
        }]

        const definition_name_list = Object.keys(definition_list)

        let promise = getPromise(queryInterface, definition_list[definition_name_list[0]])
        for (let i = 1; i < definition_name_list.length; i++)
            promise = promise.then(() => getPromise(queryInterface, definition_list[definition_name_list[i]]))

        return promise.then(() => queryInterface.bulkInsert('Formula', insert_data))
    },
    down: queryInterface => queryInterface.dropAllTables()
}