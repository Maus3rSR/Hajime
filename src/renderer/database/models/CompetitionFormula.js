export default function(sequelize, DataTypes) {
  return sequelize.define('CompetitionFormula', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    competition_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      references: {
        model: 'Competition',
        key: 'id'
      }
    },
    element_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    element_type: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'CompetitionFormula'
  });
};
