module.exports = (sequelize, DataTypes) => {
    const JobInfo = sequelize.define("job_info", {
        id:{
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        postedBy: {
            type: DataTypes.UUID
        },
        position: {
            type: DataTypes.STRING,
        },
        department:{
            type: DataTypes.STRING
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
        },
        salary:{
            type: DataTypes.STRING
        },
        photo:{
            type: DataTypes.STRING
        },
        link:{
            type: DataTypes.STRING
        },
        description:{
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'pending',
        },
        availability:{
            type: DataTypes.DATEONLY
        }
    });

    return JobInfo;
};