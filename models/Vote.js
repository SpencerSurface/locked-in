const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Vote extends Model {}

Vote.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        vote: {
            type: DataType.INTEGER,
            references: {
                model: "user",
                key: "id"
            }
        },
        user_id: {
            type: DataType.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: "id"
            }
        },
        bet_id: {
            type: DataType.INTEGER,
            allowNull: false,
            references: {
                model: "bet",
                key: "id"
            }
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: "vote"
    }
);

module.exports = Vote;