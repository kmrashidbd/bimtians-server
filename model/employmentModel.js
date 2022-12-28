module.exports = (sequelize, DataTypes) => {
    const EmploymentInfo = sequelize.define("employment_info", {
        id:{
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        student: {
            type: DataTypes.UUID
        },
        companyName: {
            type: DataTypes.STRING,
        },
        groupName: {
            type: DataTypes.STRING,
        },
        designation: {
            type: DataTypes.STRING,
        },
        department: {
            type: DataTypes.STRING,
        },        
        city: {
            type: DataTypes.STRING,
        },        
        country: {
            type: DataTypes.STRING,
        },   
        joiningYear: {
            type: DataTypes.STRING,
        }     
    }, {
        timestamps: false
      });

    return EmploymentInfo;
};