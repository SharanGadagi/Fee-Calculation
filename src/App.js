import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import data from "./data/data.json";
import { courses, levels } from "./constants/constants";

function App() {
  const [selectedFeeType, setSelectedFeeType] = useState("");
  const [selectedNationality, setSelectedNationality] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [feeAmount, setFeeAmount] = useState(null);

  const feesTypeOptions = Object.keys(data);
  const [nationalityOptions, setNationalityOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [levelOptions, setLevelOptions] = useState([]);

  // console.log(data, courses, levels);

  const handleFeeTypeChange = (e) => {
    const value = e.target.value;
    setSelectedFeeType(e.target.value);
    setSelectedNationality("");
    setSelectedCourse("");
    setSelectedLevel("");

    setNationalityOptions([]);
    setCourseOptions([]);
    setLevelOptions([]);

    setFeeAmount(null);

    if (value !== "") {
      setNationalityOptions(Object.keys(data[value]));
    } else {
      setNationalityOptions([]);
    }
  };
  const handleNationalityChange = (e) => {
    const value = e.target.value;
    setSelectedNationality(e.target.value);
    setSelectedCourse("");
    setSelectedLevel("");

    setCourseOptions([]);
    setLevelOptions([]);

    setFeeAmount(null);

    if (selectedFeeType && value !== "") {
      const getOptions = Object.keys(data[selectedFeeType][value]);
      const courseData = data[selectedFeeType]?.[value];
      // Check if ALL_COURSES exists
      const hasAllCourses = courseData.hasOwnProperty("ALL_COURSES");
      //If ALL_COURSES exists set options are static courses other wise set related options
      const realOptions = hasAllCourses ? courses : getOptions;

      setCourseOptions(realOptions);
    } else {
      setCourseOptions([]);
    }
  };
  const handleCourseChange = (e) => {
    const value = e.target.value;
    setSelectedCourse(value);
    setSelectedLevel("");
    setLevelOptions([]);
    setFeeAmount(null);

    if (selectedFeeType && selectedNationality && value !== "") {
      const courseData = data[selectedFeeType]?.[selectedNationality];
      // Check if ALL_COURSES exists
      const hasAllCourses = courseData.hasOwnProperty("ALL_COURSES");

      //*ALL_COURSES exists then check it has ALL_LEVEL , is ALL_LEVEL exist set static level otherwise same exist levels for all courses
      //*ALL_COURSES not exists set selected course levels
      const levelOptions = hasAllCourses
        ? courseData["ALL_COURSES"]?.hasOwnProperty("ALL_LEVEL")
          ? levels
          : Object.keys(courseData["ALL_COURSES"])
        : Object.keys(courseData[value]);
      setLevelOptions(levelOptions);
    } else {
      setLevelOptions([]);
    }
  };

  const handleLevelChange = (e) => {
    const value = e.target.value;
    setSelectedLevel(value);
    setFeeAmount(null);

    if (selectedFeeType && selectedNationality && selectedCourse && value) {
      const courseData = data[selectedFeeType]?.[selectedNationality];

      if (courseData) {
        let amount = null;
        const hasAllCourses = courseData.hasOwnProperty("ALL_COURSES");

        // If ALL_COURSES exist
        if (hasAllCourses) {
          const hasAllLevels =
            courseData["ALL_COURSES"]?.hasOwnProperty("ALL_LEVEL");

          // If ALL_LEVEL exists
          if (hasAllLevels) {
            //set that ALL_LEVEL amount
            amount = courseData["ALL_COURSES"]["ALL_LEVEL"]?.amount || null;
          } else {
            // Otherwise, get the amount for the selected level
            amount = courseData["ALL_COURSES"]?.[value]?.amount || null;
          }
        } else {
          // If ALL_COURSES not exist
          // For a selected course, get the amount for the selected level
          amount = courseData[selectedCourse]?.[value]?.amount || null;
        }
        setFeeAmount(amount);
      } else {
        setFeeAmount(null);
      }
    } else {
      setFeeAmount(null);
    }
  };

  return (
    <div className="App">
      <div className="main-container">
        <div className="box-container">
          <h2>Fee Calculation</h2>
          <div className="input-main-container">
            <div className="input-container">
              <label>Fee Type : </label>
              <select
                value={selectedFeeType}
                onChange={handleFeeTypeChange}
                multiple={false}
              >
                <option value="">Select Fees Type</option>
                {feesTypeOptions.length > 0 &&
                  feesTypeOptions.map((fees) => (
                    <option key={fees} value={fees}>
                      {fees}
                    </option>
                  ))}
              </select>
            </div>

            <div className="input-container">
              <label>Nationality : </label>
              <select
                value={selectedNationality}
                onChange={handleNationalityChange}
                multiple={false}
              >
                <option value="">Select Nationality</option>

                {nationalityOptions.length > 0 &&
                  nationalityOptions.map((nationality) => (
                    <option key={nationality} value={nationality}>
                      {nationality}
                    </option>
                  ))}
              </select>
            </div>

            <div className="input-container">
              <label>Course : </label>
              <select
                value={selectedCourse}
                onChange={handleCourseChange}
                multiple={false}
              >
                <option value="">Select Course</option>

                {courseOptions.length > 0 &&
                  courseOptions.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
              </select>
            </div>

            <div className="input-container">
              <label>Level : </label>
              <select
                value={selectedLevel}
                onChange={handleLevelChange}
                multiple={false}
              >
                <option value="">Select Level</option>

                {levelOptions.length > 0 &&
                  levelOptions.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
              </select>
            </div>
            {feeAmount !== null && <h3>Amount: ₹{feeAmount} </h3>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
