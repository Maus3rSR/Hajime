import { FIGHT_FIGHTER_NUMBER_LIST } from '@root/constant'

export const getEntryListAssociation = (constant_type_list, competition_type) => {
    return competition_type === constant_type_list.TEAM ? "team" : "fighter"
}

export const getFightListAssociationList = (Sequelize, constant_type_list, competition_type) => {
    const entriable = competition_type === constant_type_list.TEAM ? "Team" : "Fighter"
    let fight_list_association_list = ["fighter_fight_meta","comment_list"]

    FIGHT_FIGHTER_NUMBER_LIST.forEach(number => {
        const include_fighter_list_in_team = entriable === "Team" ? "->fighter_list" : ""
        const score_list_include_option = { where: Sequelize.literal(`\`fight_list->${entriable.toLowerCase()}${number}${include_fighter_list_in_team}->score_given_list\`.\`fight_id\` = \`fight_list\`.\`id\``) }

        let fight_order_include_option = undefined
        if (entriable === "Team")
            fight_order_include_option = { where: Sequelize.literal(`\`fight_list->${entriable.toLowerCase()}${number}${include_fighter_list_in_team}->fight_order\`.\`fight_id\` = \`fight_list\`.\`id\``) }

        fight_list_association_list.push(getEntryAssociationWithScoreListAssociation(entriable, number, score_list_include_option, fight_order_include_option, Sequelize))
    })

    return fight_list_association_list
}

export const getFightAssociationList = (constant_type_list, fight_id, competition_type) => {
    const entriable = competition_type === constant_type_list.TEAM ? "Team" : "Fighter"
    let association_list = []

    FIGHT_FIGHTER_NUMBER_LIST.forEach(number => {
        const score_list_include_option = { where: { fight_id: parseInt(fight_id, 10) } }
        association_list.push(getEntryAssociationWithScoreListAssociation(entriable, number, score_list_include_option))
    })

    return association_list
}

export const getEntryAssociationWithScoreListAssociation = (entriable, number, score_association_option_list, fight_order_association_option_list, sequelize) => { // TODO : All attributes is not necessary... to improve perfs
    let association = {}
    const common_option = { required: false }

    if (entriable === "Team" ) {
        const fighter_list_association_list = [{ association: "score_given_list", ...common_option, ...score_association_option_list }]

        if (!!fight_order_association_option_list)
            fighter_list_association_list.push({ association: "fight_order", ...common_option, ...fight_order_association_option_list, attributes: ["order"] })

        association = {
            association: `${entriable.toLowerCase()}${number}`,
            include: {
                association: "fighter_list",
                required: false,
                where: { is_present: true },
                attributes: ["name", "club", "is_favorite"],
                include: fighter_list_association_list
            }
        }
    } else {
        association = {
            association: `${entriable.toLowerCase()}${number}`,
            include: { association: "score_given_list", ...common_option, ...score_association_option_list }
        }
    }

    return association
}