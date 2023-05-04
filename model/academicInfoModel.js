module.exports = (sequelize, DataTypes) => {
    const AcademicInfo = sequelize.define("academic_info", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        studentId: {
            type: DataTypes.UUID
        },
        studentName:{
            type: DataTypes.STRING
        },
        course: {
            type: DataTypes.STRING,
        },
        intake: {
            type: DataTypes.INTEGER,
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "student",
        },
        passingYear: {
            type: DataTypes.INTEGER,
        },
    }, {
        timestamps: false
    });

    return AcademicInfo;
};