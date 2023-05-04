module.exports = (sequelize, DataTypes) => {
    const JobInfo = sequelize.define("job_info", {
        id:{
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        studentId: {
            type: DataTypes.UUID
        },
        post: {
            type: DataTypes.STRING,
        },
        company: {
            type: DataTypes.STRING,
        },
        education: {
            type: DataTypes.STRING,
        },
        location: {
            type: DataTypes.STRING,
        },
        contact: {
            type: DataTypes.STRING
        },
        requerment: {
            type: DataTypes.STRING
        }
    }, {
        timestamps: false
      });

    return JobInfo;
};