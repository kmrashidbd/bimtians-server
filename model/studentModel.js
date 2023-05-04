module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define("student", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    numericId:{
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
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
    photo: {
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
    },
    course: {
      type: DataTypes.STRING,
    },
    intake: {
      type: DataTypes.INTEGER,
    },
    academicStatus: {
      type: DataTypes.STRING,
      defaultValue: "student",
    },
    passingYear: {
      type: DataTypes.INTEGER,
    },
    shareContact: {
      type: DataTypes.STRING,
      defaultValue: "yes",
    }
  });
  return Student;
};