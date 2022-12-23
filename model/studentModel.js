module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define("student", {
      id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
      },
      mobile: {
        type: DataTypes.STRING,
      },
      gender: {
        type: DataTypes.STRING,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "user",
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "pending",
      }
    });
  
    return Student;
  };