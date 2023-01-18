module.exports = (sequelize, DataTypes) => {
    const ContactRequest = sequelize.define("contact_request", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        requester: {
            type: DataTypes.UUID
        },
        requestedUser: {
            type: DataTypes.UUID
        },
        permission: {
            type: DataTypes.TEXT,
            defaultValue: 'false'
        }
    });

    return ContactRequest;
};