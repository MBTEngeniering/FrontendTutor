import React, { useEffect, useState } from "react";
import ApiService from "../api/ApiService.js";

function Restricted() {


  const [student, setStudent] = useState([]);

  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiService.get("/api/statuss/students")
        const students = response.data
        console.log(students)
        setStudent(students);
      } catch (error) {
        alert(error.response.data.message);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  return (
      <div className="page">
        {(student.length > 0) ? (
            <div>
                <h2>Restricted</h2>
                <p>Hier sind die Daten der Schüler:</p>
                <ul>
                {student.map((student) => (
                    <li key={student.id}>
                    {student.firstName} {student.lastName}
                    </li>
                ))}
                </ul>
            </div>
            ) : (
            <p>Loading...</p>
            )}
      </div>
  );
}

export default Restricted;
