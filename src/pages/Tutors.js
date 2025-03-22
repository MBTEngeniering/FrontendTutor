import React, { useState, useEffect } from 'react';
import tutorService from '../api/TutorService';

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
            <table>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Vorname</th>
                </tr>
                {tutors.map((tutor, key) => (
                    <tr key={tutor.id}>
                        <td>{tutor.id}</td><td>{tutor.nachname}</td><td>{tutor.vorname}</td>
                    </tr>
                ))}
            </table>
        </div>
    );
}

export default Tutors;
