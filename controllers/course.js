const { CourseModel } = require("../models");
const jwt = require("jsonwebtoken");
module.exports.fetchCourse = async (req, res) => {
  // only fetch single course needs to populate reviews
  const { courseId } = req.params;

  const course = await CourseModel.findOne({ _id: courseId })
    .populate("reviews")
    .populate("instructor", "username");

  if (!course) {
    // not suppose to find nothing
    return res
      .status(404)
      .send({ success: false, message: "course not found" });
  }

  res.status(200).send({ course });
};

module.exports.fetchCourses = async (req, res) => {
  const { filterType, userId, keyWord } = req.query;

  const queryInput =
    filterType === "instructor"
      ? { instructor: userId }
      : filterType === "student"
      ? { students: { $in: [userId] } }
      : {};

  const courses = await CourseModel.find(queryInput)
    .populate("instructor", "username")
    .populate("reviews", "rating");
  if (!keyWord) {
    return res.status(200).send({ courses });
  }
  const fieldList = [
    "title",
    "description",
    "category",
    "content",
    "instructor",
  ];
  const keyWordFilteredCoures = keyWordFilter(courses, keyWord.toLowerCase());
  function keyWordFilter(courses, keyWord) {
    const keyWordCoures = [];
    for (const courseObj of courses) {
      for (const field of fieldList) {
        if (
          typeof courseObj[field] === "object" &&
          typeof courseObj[field].username === "string" &&
          courseObj[field].username.toLowerCase().includes(keyWord)
        ) {
          keyWordCoures.push(courseObj);
          break;
        }
        if (
          typeof courseObj[field] === "string" &&
          courseObj[field].toLowerCase().includes(keyWord)
        ) {
          keyWordCoures.push(courseObj);
          break;
        }
      }
    }
    return keyWordCoures;
  }

  res.status(200).send({ courses: keyWordFilteredCoures });
};

module.exports.createCourse = async (req, res) => {
  // needs jwt token
  const { formValues } = req.body;
  const token = req.headers["authorization"];
  const decoded = jwt.decode(token.split(" ")[1]);
  const newCourse = new CourseModel(formValues);
  newCourse.instructor = decoded.userId; // insturcotr is creator
  newCourse
    .save()
    .then((result) => {
      res.status(201).send({ success: true, message: "new course created" });
    })
    .catch((err) => {
      res.status(400).send({
        success: false,
        message: "fail to create new course",
        error: err,
      });
    });
};

module.exports.subscribeCourse = async (req, res) => {
  const { courseId } = req.params;
  const { userId } = res.locals.user;
  CourseModel.findOne({ _id: courseId })
    .then((course) => {
      const courseIndex = course.students.indexOf(userId);
      if (courseIndex >= 0) {
        res.status(400).send({
          success: false,
          message: "already subscribed!",
        });
        return;
      } else {
        course.students.push(userId);
        course.save().then(() => {
          res.status(200).send({
            success: true,
            message: "successfully subscribed!",
            course,
          });
        });
      }
    })
    .catch((err) => {
      res.status(400).send({
        success: false,
        message: "fail to subscribe course",
        error: err,
      });
    });
};

module.exports.unsubscribeCourse = async (req, res) => {
  const { courseId } = req.params;
  const { userId } = res.locals.user;
  CourseModel.findOne({ _id: courseId })
    .then((course) => {
      const courseIndex = course.students.indexOf(userId);
      if (courseIndex === -1) {
        res.status(400).send({
          success: false,
          message: "fail to unsubscribe, no course found!",
        });
        return;
      } else {
        course.students.splice(courseIndex, 1);
        course.save().then(() => {
          res.status(200).send({
            success: true,
            message: "successfully unsubscribed!",
            course,
          });
        });
      }
    })
    .catch((err) => {
      res.status(400).send({
        success: false,
        message: "fail to unsubscribe course",
        error: err,
      });
    });
};

module.exports.editCourse = async (req, res) => {
  const { courseId } = req.params;
  const { formValues } = req.body;

  CourseModel.findOneAndUpdate(
    {
      instructor: res.locals.user.userId,
      _id: courseId,
    },
    formValues
  )
    .then((result) => {
      res.status(200).send({ success: true, message: "course updated" });
    })
    .catch((err) => {
      res.status(400).send({
        success: false,
        message: "fail to update new course",
        error: err,
      });
    });
};
