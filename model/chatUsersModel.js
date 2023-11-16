module.exports = (sequelize, DataTypes) => {
    const ChatUsers = sequelize.define("chat_group_user", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        user: {
            type: DataTypes.UUID,
            required: true
        },        
        chat: {
            type: DataTypes.UUID,
            required: true
        },
        isGroupAdmin: {
            type: DataTypes.BOOLEAN,
            default: false
        }
    });

    return ChatUsers;
};