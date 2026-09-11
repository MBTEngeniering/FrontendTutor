import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/RegisterForm.css';
import '../../styles/Register.css';
import countries from '../../data/countries';
import ApiService from "../../api/ApiService.js";

function RegisterStudent() {
    // const apiUrl = import.meta.env.VITE_API_URL;
    const [selectedSubject, setSelectedSubject] = useState("");
    const [subjects, setSubjects] = useState([]);
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        salutation: "",
        title: "",
        lastName: "",
        firstName: "",
        emailAddress: "",
        password: "",
        repeatPassword: "",
        street: "",
        houseNumber: "",
        postalCode: "",
        phoneNumber: "",
        city: "",
        country: "",
        dateOfBirth: "",
        placeOfBirth: "",
        bankCode: "",
        iban: "",
        description: "",
        picture: ""
    });

    useEffect(() => {
        // @TTODO: Use language from settings
        const lang = navigator.languages[1].substring(0, 2);
        ApiService.get(`/api/fach/trans/${lang}`)
            .then(response => setAvailableSubjects(response.data))
            .catch(function (error) {
                console.error("Fehler beim Laden der Fächer:", error.message);
                ApiService.get(`/api/fach`)
                    .then(response => setAvailableSubjects(response.data))
                    .catch(error => console.error("Fehler beim Laden der Fächer:", error.message))
            });
    }, []);

    const handleAddSubject = () => {
        const selectedSubjectData = availableSubjects.find((fach) => fach.fach === selectedSubject);

        if (selectedSubjectData && !subjects.some((subject) => subject.fach === selectedSubjectData.fach)) {
            setSubjects([...subjects, selectedSubjectData]);
            setSelectedSubject("");
        }
    };

    const handleRemoveSubject = (subjectToRemove) => {
        setSubjects(subjects.filter(subject => subject.fach !== subjectToRemove.fach));
    };
    const navigate = useNavigate();

    const handleRegistration = (e) => {
        e.preventDefault();

        const selectedFachIds = availableSubjects
            .filter(fach => subjects.some(subject => subject.fach === fach.fach))
            .map(fach => fach.id);
        if (formData.password !== formData.repeatPassword) {
            alert("Passwörter stimmen nicht überein!");
            return;
        }

        const studentData = {
            ...formData,
            accountActive: false,
            userRoleIds: [1],
            fachIds: selectedFachIds
        };

        ApiService.post(`/api/auth/register`, studentData)
            .then(response => {
                alert("Du hast dich erfolgreich registriert!");
                navigate("/login");
            })
            .catch(error => {
                console.error("Fehler bei der Registrierung:", error);
                setIsLoading(false);

                if (error.response) {
                    // Server responded with error status
                    if (error.response.data && error.response.data.message) {
                        alert(`Fehler: ${error.response.data.message}`);
                    } else {
                        alert(`Serverfehler: ${error.response.status}`);
                    }
                } else if (error.request) {
                    // No response received
                    alert("Keine Antwort vom Server. Bitte Netzwerkverbindung prüfen.");
                } else {
                    // Other errors
                    alert(`Fehler: ${error.message}`);
                }
            });
    };

    const validateForm = () => {
        const newErrors = {};
        // Required fields
        if (!formData.salutation) newErrors.salutation = "Anrede ist erforderlich";
        if (!formData.lastName) newErrors.lastName = "Name ist erforderlich";
        if (!formData.firstName) newErrors.firstName = "Vorname ist erforderlich";
        if (!formData.emailAddress) newErrors.emailAddress = "E-Mail ist erforderlich";
        if (!formData.password) newErrors.password = "Passwort ist erforderlich";
        if (!formData.repeatPassword) newErrors.repeatPassword = "Passwort wiederholen ist erforderlich";
        if (!formData.street) newErrors.street = "Straße ist erforderlich";
        if (!formData.houseNumber) newErrors.houseNumber = "Hausnummer ist erforderlich";
        if (!formData.postalCode) newErrors.postalCode = "Postleitzahl ist erforderlich";
        if (!formData.city) newErrors.city = "Stadt ist erforderlich";
        if (!formData.country) newErrors.country = "Land ist erforderlich";
        if (!formData.phoneNumber) newErrors.phoneNumber = "Telefonnummer ist erforderlich";

        // Format validation
        if (formData.emailAddress && !/^\S+@\S+\.\S+$/.test(formData.emailAddress)) {
            newErrors.emailAddress = "Gültige E-Mail ist erforderlich";
        }
        if (formData.password && formData.password.length < 8) {
            newErrors.password = "Passwort muss mindestens 8 Zeichen haben";
        }
        if (formData.password !== formData.repeatPassword) {
            newErrors.repeatPassword = "Passwörter stimmen nicht überein";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        handleRegistration(e);
    };

  if (apiError) {
    return (
      <div className="error-container">
        <h2>Fehler</h2>
        <p>{apiError}</p>
        <button onClick={() => window.location.reload()}>Seite neu laden</button>
      </div>
    );
  }

  return (
    <>
      <div className="registration-container">
            <div className="registration-card">
                <h2 className="registration-title">Schüler/Eltern Registrierung</h2>
                <p className="registration-subtitle">Erstellen Sie ein Konto für Nachhilfe</p>

                <form onSubmit={handleSubmit} className="registration-form" noValidate>
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
                            className={`form-input ${errors.street ? 'error' : ''}`}
                            value={formData.street || ""}
                            onChange={(e) => setFormData({...formData, street: e.target.value})}
                            required
                        />
                        {errors.street && <div className="error-message">{errors.street}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Hausnummer *</label>
                        <input
                            type="text"
                            className={`form-input ${errors.houseNumber ? 'error' : ''}`}
                            value={formData.houseNumber || ""}
                            onChange={(e) => setFormData({...formData, houseNumber: e.target.value})}
                            required
                        />
                        {errors.houseNumber && <div className="error-message">{errors.houseNumber}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Postleitzahl *</label>
                        <input
                            type="text"
                            className={`form-input ${errors.postalCode ? 'error' : ''}`}
                            value={formData.postalCode || ""}
                            onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                            required
                        />
                        {errors.postalCode && <div className="error-message">{errors.postalCode}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Stadt *</label>
                        <input
                            type="text"
                            className={`form-input ${errors.city ? 'error' : ''}`}
                            value={formData.city || ""}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                            required
                        />
                        {errors.city && <div className="error-message">{errors.city}</div>}
                    </div>


                    <div className="form-group">
                        <label className="form-label">Land *</label>
                        <input
                            list="countries"
                            className={`form-input ${errors.country ? 'error' : ''}`}
                            value={formData.country || ""}
                            onChange={(e) => setFormData({...formData, country: e.target.value})}
                            required
                        />
                        <datalist id="countries">
                            {countries.map((country) => (
                                <option key={country.code} value={country.name}></option>
                            ))}
                        </datalist>
                        {errors.country && <div className="error-message">{errors.country}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Telefonnummer *</label>
                        <input
                            type="tel"
                            className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
                            value={formData.phoneNumber || ""}
                            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                            required
                        />
                        {errors.phoneNumber && <div className="error-message">{errors.phoneNumber}</div>}
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
                                {availableSubjects.map((fach) => (
                                    <option key={fach.id} value={fach.fach}>
                                        {fach.translation ? fach.translation : fach.fach}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                className="submit-btn mt-3"
                                onClick={handleAddSubject}
                            >
                                Fach hinzufügen
                            </button>

                            <div className="subjects-list mt-1">
                                {subjects.map((subject, index) => (
                                    <div key={subject.fach || index} className="subject-tag">
                                        <span>{subject.translation || subject.fach}</span>
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
}

export default RegisterStudent;
