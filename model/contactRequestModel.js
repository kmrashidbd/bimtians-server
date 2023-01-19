module.exports = (sequelize, DataTypes) => {
    const ContactRequest = sequelize.define("contact_request", {
        requestBy: {
            type: DataTypes.UUID
        },
        requestedTo: {
            type: DataTypes.UUID
        },
        permission: {
            type: DataTypes.STRING,
            defaultValue: 'no'
        }
    });

    return ContactRequest;
};