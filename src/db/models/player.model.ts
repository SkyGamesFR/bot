import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface PlayerAttributes {
    id: number;
    username: string;
    deaths: number; // Store inventory as a JSON string or use a JSON type if supported
}

export type PlayerCreationAttributes = Optional<PlayerAttributes, 'id'>;

class Player extends Model<PlayerAttributes, PlayerCreationAttributes> implements PlayerAttributes {
    public id!: number;
    public username!: string;
    public deaths!: number;

    static initModel(sequelize: Sequelize) {
        Player.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false
            },
            deaths: {
                type: DataTypes.INTEGER, // Use JSON type to store inventory
                allowNull: true
            }
        }, {
            tableName: 'players',
            sequelize, // Pass the `sequelize` instance
            timestamps: true, // Automatically add createdAt and updatedAt timestamps
        });
    }
}

export default Player;
