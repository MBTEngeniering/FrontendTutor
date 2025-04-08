import React, { useEffect, useState } from 'react';
import tutorService from '../../api/TutorService.js';
import { Table } from "reactstrap";

const Tutors = () => {

  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTutors = async () => {
    try {
      const data = await tutorService.getAllTutors();
      setTutors(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
      <div className="page">
        <h2>Tutorenliste</h2>
        <Table bordered
               hover
               responsive
               striped>
          <thead>
            <tr>
              <th>Name</th>
              <th>Vorname</th>
              <th>Stadt</th>
            </tr>
          </thead>
          <tbody>
          {tutors.map((tutor) => (
              <tr key={tutor.id} className="table-row">
                <td>{tutor.lastName}</td>
                <td>{tutor.firstName}</td>
                <td>{tutor.city}</td>
              </tr>
          ))}
          </tbody>
        </Table>
      </div>
  );
}

export default Tutors;
