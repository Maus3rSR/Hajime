import Sequelize from 'sequelize'

export default {
    created_at: {
        type: Sequelize.DATE,
        allowNull: false
    },
    updated_at: {
        type: Sequelize.DATE,
        allowNull: false
    },
    deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
    }
}