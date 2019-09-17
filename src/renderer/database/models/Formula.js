export default function(sequelize, DataTypes) {
  return sequelize.define('Formula', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    component_list: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'Formula'
  });
};
