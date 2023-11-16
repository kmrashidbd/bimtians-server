module.exports = (sequelize, DataTypes) => {
    const PersonalInfo = sequelize.define("personal_info", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        studentId: {
            type: DataTypes.UUID
        },
        father: {
            type: DataTypes.STRING,
        },
        mother: {
            type: DataTypes.STRING,
        },
        nId: {
            type: DataTypes.STRING,
        },
        dateOfBirth: {
            type: DataTypes.STRING,
        },
        bloodGroup: {
            type: DataTypes.STRING
        },
        whatsApp: {
            type: DataTypes.STRING
        },
        facebook: {
            type: DataTypes.STRING
        },
        linkedIn: {
            type: DataTypes.STRING
        },
        presentRoad: {
            type: DataTypes.STRING
        },
        presentDistrict: {
            type: DataTypes.STRING
        },
        presentCountry: {
            type: DataTypes.STRING
        },
        permanentRoad: {
            type: DataTypes.STRING,
        },
        permanentDistrict: {
            type: DataTypes.STRING,
        },
        permanentCountry: {
            type: DataTypes.STRING,
        },
        employmentStatus: {
            type: DataTypes.STRING,
        }
    }, {
        timestamps: false
    });

    return PersonalInfo;
};