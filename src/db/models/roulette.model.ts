import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface RouletteAttributes {
    id: number;
    playerId: number;
    outcome: string;
    details: string; // Additional details like effects or rewards
}

export type RouletteCreationAttributes = Optional<RouletteAttributes, 'id'>;

class Roulette extends Model<RouletteAttributes, RouletteCreationAttributes> implements RouletteAttributes {
    public id!: number;
    public playerId!: number;
    public outcome!: string;
    public details!: string;

    static initModel(sequelize: Sequelize) {
        Roulette.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            playerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'players',
                    key: 'id'
                }
            },
            outcome: {
                type: DataTypes.STRING,
                allowNull: false
            },
            details: {
                type: DataTypes.JSON,
                allowNull: true
            }
        }, {
            tableName: 'roulette',
            sequelize, // Pass the `sequelize` instance
            timestamps: true, // Automatically add createdAt and updatedAt timestamps
        });
    }
}

export default Roulette;
