export default function(sequelize, DataTypes) {
  return sequelize.define('CompetitionFighter', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    license: {
      type: DataTypes.STRING(16),
      allowNull: false,
      unique: true
    },
    competition_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      references: {
        model: 'Competition',
        key: 'id'
      }
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    grade: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    club: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    team: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    is_present: {
      type: DataTypes.INTEGER(3).UNSIGNED,
      allowNull: true,
      defaultValue: '0'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'CompetitionFighter'
  });
};
