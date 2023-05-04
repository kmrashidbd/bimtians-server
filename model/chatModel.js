module.exports = (sequelize, DataTypes) => {
    const Chat = sequelize.define("chat", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        sender: {
            type: DataTypes.UUID
        },
        receiver: {
            type: DataTypes.UUID
        },
        message: {
            type: DataTypes.STRING,
        }
    });

    return Chat;
};