module.exports = (sequelize, DataTypes) => {
    const Chat = sequelize.define("chat", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        groupName: {
            type: DataTypes.STRING,
        },
        isGroupChat: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        senderId: {
            type: DataTypes.UUID
        },
        receiverId:{
            type: DataTypes.UUID
        },
        groupAdminId: {
            type: DataTypes.UUID
        },
        latestMessageId: {
            type: DataTypes.UUID
        }
    });

    return Chat;
};