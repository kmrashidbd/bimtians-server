module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define("notification", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        isGroupChat: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        senderName: {
            type: DataTypes.STRING
        },
        receiverId:{
            type: DataTypes.UUID
        },
        groupName: {
            type: DataTypes.STRING
        },
        chatId:{
            type: DataTypes.UUID
        },
    });

    return Notification;
};