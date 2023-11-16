module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define("message", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        message: {
            type: DataTypes.STRING
        },
        senderId:{
            type: DataTypes.UUID
        },
        chat: {
            type: DataTypes.UUID
        }
    });

    return Message;
};