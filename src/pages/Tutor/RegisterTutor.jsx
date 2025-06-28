import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../../styles/RegisterForm.css';

const RegisterTutor = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [selectedSubject, setSelectedSubject] = useState("");
    const [subjects, setSubjects] = useState([]);
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [countries, setCountries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        salutation: "",
        title: "",
        lastName: "",
        firstName: "",
        emailAddress: "",
        password: "",
        street: "",
        houseNumber: "",
        postalCode: "",
        phoneNumber: "",
        city: "",
        country: "",
        dateOfBirth: "",
        placeOfBirth: "",
        bankCode: "",
        description: "",
        picture: "",
        hobbies: ""
    });

    useEffect(() => {
        // @TTODO: Use language from settings
        const lang = navigator.languages[1].substring(0, 2);
        axios.get(`${apiUrl}/api/fach/trans/${lang}`, {withCredentials: true})
            .then(response => setAvailableSubjects(response.data))
            .catch(function (error) {
                console.error("Fehler beim Laden der Fächer:", error.message);
                axios.get(`${apiUrl}/api/fach`)
                    .then(response => setAvailableSubjects(response.data))
                    .catch(error => console.error("Fehler beim Laden der Fächer:", error))
            });


    }, [apiUrl]);

    const handleAddSubject = () => {
        if (selectedSubject && !subjects.includes(selectedSubject)) {
            setSubjects([...subjects, selectedSubject]);
            setSelectedSubject("");
        }
    };
    const navigate = useNavigate();

    const handleRemoveSubject = (subjectToRemove) => {
        setSubjects(subjects.filter(subject => subject !== subjectToRemove));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.salutation) newErrors.salutation = "Anrede ist erforderlich";
        if (!formData.lastName) newErrors.lastName = "Name ist erforderlich";
        if (!formData.firstName) newErrors.firstName = "Vorname ist erforderlich";
        if (!formData.emailAddress || !/^\S+@\S+\.\S+$/.test(formData.emailAddress))
            newErrors.emailAddress = "Gültige E-Mail ist erforderlich";
        if (!formData.password || formData.password.length < 8)
            newErrors.password = "Passwort muss mindestens 8 Zeichen haben";
        if (formData.password !== formData.repeatPassword)
            newErrors.repeatPassword = "Passwörter stimmen nicht überein";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        handleRegistration(e);
    };

    const handleRegistration = () => {
        const selectedFachIds = availableSubjects
            .filter(fach => subjects.includes(fach.fach))
            .map(fach => fach.id);

        const tutorData = {
            ...formData,
            accountActive: false,
            userRoleIds: [2],
            fachIds: selectedFachIds
        };

        axios.post(`${apiUrl}/api/allusers`, tutorData)
            .then(() => {
                alert("Tutor erfolgreich registriert!");
                navigate("/login");
            })
            .catch(error => {
                console.error("Fehler bei der Registrierung:", error);
                alert("Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <>
          <div className="registration-container">
            <div className="registration-card">
                <h2 className="registration-title">Tutor Registrierung</h2>
                <p className="registration-subtitle">Werden Sie Nachhilfelehrer</p>

                <form onSubmit={handleSubmit} className="registration-form">
                <div className="form-group">
                    <label className="form-label">Anrede *</label>
                    <select
                        className={`form-input ${errors.salutation ? 'error' : ''}`}
                        value={formData.salutation || ""}
                        onChange={(e) => setFormData({...formData, salutation: e.target.value})}
                        required
                    >
                        <option value="">Bitte wählen</option>
                        <option value="Herr">Herr</option>
                        <option value="Frau">Frau</option>
                        <option value="Divers">Divers</option>
                    </select>
                    {errors.salutation && <div className="error-message">{errors.salutation}</div>}
                </div>
                <div className="form-group">
                    <label className="form-label">Titel</label>
                    <input
                        type="text"
                        className="form-input"
                        value={formData.title || ""}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Name *</label>
                    <input
                        type="text"
                        className={`form-input ${errors.lastName ? 'error' : ''}`}
                        value={formData.lastName || ""}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        required
                    />
                    {errors.lastName && <div className="error-message">{errors.lastName}</div>}
                </div>

                <div className="form-group">
                    <label className="form-label">Vorname *</label>
                    <input
                        type="text"
                        className={`form-input ${errors.firstName ? 'error' : ''}`}
                        value={formData.firstName || ""}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        required
                    />
                    {errors.firstName && <div className="error-message">{errors.firstName}</div>}
                </div>

                <div className="form-group full-width">
                    <label className="form-label">E-Mail *</label>
                    <input
                        type="email"
                        className={`form-input ${errors.emailAddress ? 'error' : ''}`}
                        value={formData.emailAddress || ""}
                        onChange={(e) => setFormData({...formData, emailAddress: e.target.value})}
                        required
                    />
                    {errors.emailAddress && <div className="error-message">{errors.emailAddress}</div>}
                </div>

                <div className="form-group">
                    <label className="form-label">Passwort *</label>
                    <input
                        type="password"
                        className={`form-input ${errors.password ? 'error' : ''}`}
                        value={formData.password || ""}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                    />
                    {errors.password && <div className="error-message">{errors.password}</div>}
                </div>

                <div className="form-group">
                    <label className="form-label">Passwort wiederholen *</label>
                    <input
                        type="password"
                        className={`form-input ${errors.repeatPassword ? 'error' : ''}`}
                        value={formData.repeatPassword || ""}
                        onChange={(e) => setFormData({...formData, repeatPassword: e.target.value})}
                        required
                    />
                    {errors.repeatPassword && <div className="error-message">{errors.repeatPassword}</div>}
                </div>

                <div className="form-group">
                    <label className="form-label">Straße *</label>
                    <input
                        type="text"
                        className="form-input"
                        value={formData.street || ""}
                        onChange={(e) => setFormData({...formData, street: e.target.value})}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Hausnummer *</label>
                    <input
                        type="text"
                        className="form-input"
                        value={formData.houseNumber || ""}
                        onChange={(e) => setFormData({...formData, houseNumber: e.target.value})}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Postleitzahl *</label>
                    <input
                        type="text"
                        className="form-input"
                        value={formData.postalCode || ""}
                        onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Stadt *</label>
                    <input
                        type="text"
                        className="form-input"
                        value={formData.city || ""}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Land *</label>
                    <input
                        list="countries"
                        className="form-input"
                        value={formData.country || ""}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        required
                    />
                        <datalist id="countries">
                        {countries.map((country, index) => (
                            <option key={index} value={country.name.common}></option>
                        ))}
                        </datalist>
                </div>

                <div className="form-group">
                    <label className="form-label">Telefonnummer *</label>
                    <input
                        type="tel"
                        className="form-input"
                        value={formData.phoneNumber || ""}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        required
                        pattern="[0-9]{10,15}"
                    />
                    <small className="text-gray-500">Format: 1234567890 (10-15 digits)</small>
                </div>
                <div className="form-group full-width">
                    <label className="form-label">Fächer</label>
                    <div className="subjects-container">
                        <select
                            className="form-input"
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                        >
                            <option value="">Bitte wählen</option>
                            {availableSubjects.map((f, index) => (
                                <option key={index} value={f.fach}>
                                    {f.translation ? f.translation : f.fach}
                                </option>
                            ))}
                        </select>
                        <button 
                            type="button" 
                            className="submit-btn"
                            onClick={handleAddSubject}
                        >
                            Fach hinzufügen
                        </button>
                        <div className="subjects-list">
                            {subjects.map((subject, index) => (
                                <div key={index} className="subject-tag">
                                    <span>{subject}</span>
                                  <button
                                      type="button"
                                      className="remove-subject"
                                      onClick={() => handleRemoveSubject(subject)}
                                  >
                                    ×
                                  </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="form-group full-width">
                    <label className="form-label">Beschreibung</label>
                    <textarea
                        className="form-input"
                        rows="4"
                        value={formData.description || ""}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Erzählen Sie etwas über sich und Ihre Qualifikationen"
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className={`submit-btn ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Wird verarbeitet...' : 'Registrieren'}
                    </button>
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => navigate('/')}
                    >
                        Abbrechen
                    </button>
                </div>
            </form>
            </div>
          </div>
        </>
    );
};

export default RegisterTutor;
