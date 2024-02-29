const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Bet extends Model {}

Bet.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataType.STRING,
            allowNull: false
        },
        amount: {
            type: DataType.DECIMAL,
            allowNull: false
        },
        date_created: {
            type: DataType.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        status: {
            type: DataType.STRING
        },
        winner: {
            type: DataType.INTEGER,
            references: {
                model: "user",
                key: "id"
            }
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: "bet"
    }
);

module.exports = Bet;