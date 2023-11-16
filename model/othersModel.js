module.exports = (sequelize, DataTypes) => {
    const OtherInfo = sequelize.define("other_info", {
        id:{
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        studentId: {
            type: DataTypes.UUID
        },
        name: {
            type: DataTypes.STRING,
        },
        relation: {
            type: DataTypes.STRING,
        },
        mobile: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        whatsApp: {
            type: DataTypes.STRING
        },
        facebook: {
            type: DataTypes.STRING
        }
    }, {
        timestamps: false
      });

    return OtherInfo;
};