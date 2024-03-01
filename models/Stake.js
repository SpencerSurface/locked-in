const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Stake extends Model {}

Stake.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        amount: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: "id"
            }
        },
        bet_id: {
            type: DataTypes.INTEGER,
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
        modelName: "stake"
    }
);

module.exports = Stake;