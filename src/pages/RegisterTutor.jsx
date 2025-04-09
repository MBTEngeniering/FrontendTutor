import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const RegisterTutor = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("");
    const [subjects, setSubjects] = useState([]);
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [countries, setCountries] = useState([]);
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
        iban: "",
        description: "",
        picture: "",
        taxId: "",
        hobbies: "",
        zoomLink: ""
    });

    useEffect(() => {
        axios.get(apiUrl+"/api/fach")
            .then(response => setAvailableSubjects(response.data))
            .catch(error => console.error("Fehler beim Laden der Fächer:", error));

        // Länder aus der API laden
        axios.get("https://restcountries.com/v3.1/all")
            .then(response => {
                // Länder alphabetisch sortieren
                const sortedCountries = response.data.sort((a, b) => {
                    const nameA = a.name.common.toLowerCase();
                    const nameB = b.name.common.toLowerCase();
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                });
                // console.log(sortedCountries);
                setCountries(sortedCountries);
            })
            .catch(error => console.error("Fehler beim Laden der Länder:", error));
    }, []);

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


    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!formData.salutation) newErrors.salutation = "Anrede ist erforderlich";
        if (!formData.lastName) newErrors.lastName = "Name ist erforderlich";
        if (!formData.firstName) newErrors.firstName = "Vorname ist erforderlich";
        if (!formData.emailAddress) newErrors.emailAddress = "E-Mail ist erforderlich";
        if (!formData.password) newErrors.password = "Passwort ist erforderlich";
        if (formData.password !== formData.repeatPassword) newErrors.repeatPassword = "Passwörter stimmen nicht überein";
        if (!formData.street) newErrors.street = "Straße ist erforderlich";
        if (!formData.houseNumber) newErrors.houseNumber = "Hausnummer ist erforderlich";
        if (!formData.postalCode) newErrors.postalCode = "PLZ ist erforderlich";
        if (!formData.city) newErrors.city = "Stadt ist erforderlich";
        if (!formData.country) newErrors.country = "Land ist erforderlich";
        if (subjects.length === 0) newErrors.subjects = "Mindestens ein Fach auswählen";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegistration = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error("Bitte füllen Sie alle erforderlichen Felder aus");
            return;
        }

        setIsLoading(true);
        
        const selectedFachIds = availableSubjects
            .filter(fach => subjects.includes(fach.fach))
            .map(fach => fach.id);

        const tutorData = {
            ...formData,
            accountActive: false,
            userRoleIds: [2],
            fachIds: selectedFachIds
        };

        axios.post(apiUrl+"/api/tutors", tutorData)
            .then(response => {
                toast.success("Registrierung erfolgreich! Sie können sich jetzt anmelden.");
                navigate("/login");
            })
            .catch(error => {
                console.error("Fehler bei der Registrierung:", error);
                toast.error("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <div className="page p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold mb-8 text-center text-primary">Lehrer werden</h2>
            <form className="space-y-8">
                {/* Personal Information Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Persönliche Informationen</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block font-medium text-gray-700">Anrede *</label>
                            <select 
                                className={`w-full border ${errors.salutation ? 'border-red-500' : 'border-gray-300'} p-3 rounded focus:ring-2 focus:ring-primary focus:border-transparent`} 
                                required 
                                value={formData.salutation || ""}
                                onChange={(e) => setFormData({...formData, salutation: e.target.value})}
                            >
                                <option value="">Bitte wählen</option>
                                <option value="Herr">Herr</option>
                                <option value="Frau">Frau</option>
                                <option value="Divers">Divers</option>
                            </select>
                            {errors.salutation && <p className="text-red-500 text-sm mt-1">{errors.salutation}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="block font-medium text-gray-700">Titel</label>
                            <input 
                                type="text" 
                                className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-primary focus:border-transparent" 
                                value={formData.title || ""}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                placeholder="z.B. Dr., Prof."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-medium text-gray-700">Name *</label>
                            <input 
                                type="text" 
                                className={`w-full border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} p-3 rounded focus:ring-2 focus:ring-primary focus:border-transparent`} 
                                required 
                                value={formData.lastName || ""}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            />
                            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="block font-medium text-gray-700">Vorname *</label>
                            <input 
                                type="text" 
                                className={`w-full border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} p-3 rounded focus:ring-2 focus:ring-primary focus:border-transparent`} 
                                required 
                                value={formData.firstName || ""}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            />
                            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                        </div>
                    </div>
                </div>

                {/* Contact Information Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Kontaktinformationen</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block font-medium text-gray-700">E-Mail *</label>
                            <input 
                                type="email" 
                                className={`w-full border ${errors.emailAddress ? 'border-red-500' : 'border-gray-300'} p-3 rounded focus:ring-2 focus:ring-primary focus:border-transparent`} 
                                required
                                value={formData.emailAddress || ""}
                                onChange={(e) => setFormData({...formData, emailAddress: e.target.value})}
                            />
                            {errors.emailAddress && <p className="text-red-500 text-sm mt-1">{errors.emailAddress}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="block font-medium text-gray-700">Telefonnummer *</label>
                            <input 
                                type="tel" 
                                className={`w-full border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} p-3 rounded focus:ring-2 focus:ring-primary focus:border-transparent`} 
                                required 
                                value={formData.phoneNumber || ""}
                                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                            />
                            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                        </div>
                    </div>
                </div>

                {/* Address Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Adresse</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block font-medium text-gray-700">Straße *</label>
                            <input 
                                type="text" 
                                className={`w-full border ${errors.street ? 'border-red-500' : 'border-gray-300'} p-3 rounded focus:ring-2 focus:ring-primary focus:border-transparent`} 
                                required 
                                value={formData.street || ""}
                                onChange={(e) => setFormData({...formData, street: e.target.value})}
                            />
                            {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="block font-medium text-gray-700">Hausnummer *</label>
                            <input 
                                type="text" 
                                className={`w-full border ${errors.houseNumber ? 'border-red-500' : 'border-gray-300'} p-3 rounded focus:ring-2 focus:ring-primary focus:border-transparent`} 
                                required 
                                value={formData.houseNumber || ""}
                                onChange={(e) => setFormData({...formData, houseNumber: e.target.value})}
                            />
                            {errors.houseNumber && <p className="text-red-500 text-sm mt-1">{errors.houseNumber}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="block font-medium text-gray-700">Postleitzahl *</label>
                            <input 
                                type="text" 
                                className={`w-full border ${errors.postalCode ? 'border-red-500' : 'border-gray-300'} p-3 rounded focus:ring-2 focus:ring-primary focus:border-transparent`} 
                                required 
                                value={formData.postalCode || ""}
                                onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                            />
                            {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="block font-medium text-gray-700">Stadt *</label>
                            <input 
                                type="text" 
                                className={`w-full border ${errors.city ? 'border-red-500' : 'border-gray-300'} p-3 rounded focus:ring-2 focus:ring-primary focus:border-transparent`} 
                                required 
                                value={formData.city || ""}
                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                            />
                            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="block font-medium text-gray-700">Land *</label>
                            <select
                                className={`w-full border ${errors.country ? 'border-red-500' : 'border-gray-300'} p-3 rounded focus:ring-2 focus:ring-primary focus:border-transparent`}
                                value={formData.country || ""}
                                onChange={(e) => setFormData({...formData, country: e.target.value})}
                                required
                            >
                                <option value="">Bitte wählen</option>
                                {countries.map((country, index) => (
                                    <option key={index} value={country.name.common}>
                                        {country.name.common}
                                    </option>
                                ))}
                            </select>
                            {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                        </div>
                    </div>
                </div>

                {/* Account Credentials Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Zugangsdaten</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block font-medium text-gray-700">Passwort *</label>
                            <input 
                                type="password" 
                                className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} p-3 rounded focus:ring-2 focus:ring-primary focus:border-transparent`} 
                                required
                                value={formData.password || ""}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                            <p className="text-sm text-gray-500 mt-1">Mindestens 8 Zeichen</p>
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="block font-medium text-gray-700">Passwort wiederholen *</label>
                            <input 
                                type="password" 
                                className={`w-full border ${errors.repeatPassword ? 'border-red-500' : 'border-gray-300'} p-3 rounded focus:ring-2 focus:ring-primary focus:border-transparent`} 
                                required
                                value={formData.repeatPassword || ""}
                                onChange={(e) => setFormData({...formData, repeatPassword: e.target.value})}
                            />
                            {errors.repeatPassword && <p className="text-red-500 text-sm mt-1">{errors.repeatPassword}</p>}
                        </div>
                    </div>
                </div>
{/*

                <div className="space-y-2">
                    <label className="block font-semibold">Land </label>
                    <input list="countries" name="country" id="country"/>
                    <datalist className="w-full border p-3 rounded" id="countries" value={selectedCountry}
                              style={{overflowY: "auto" }}
                              onChange={(e) => setSelectedCountry(e.target.value)}>
                        <option value="">Bitte wählen</option>
                        {countries.map((fach, index) => (
                            <option key={index} value={fach.name.common}/>
                        ))}
                    </datalist>
                </div>
*/}

                <div className="space-y-2">
                <label className="block font-semibold">Land </label>
                    <input type="text" className="w-full border p-3 rounded" required value={formData.country || ""}
                           onChange={(e) => setFormData({...formData, country: e.target.value})}/>
                    <br/><br/>
                </div>

                <div className="space-y-2">
                    <label className="block font-semibold">Telefonnummer </label>
                    <input type="tel" className="w-full border p-3 rounded" required value={formData.phoneNumber || ""}
                           onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}/>
                    <br/><br/>
                </div>
                {/* Subjects Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Fächer *</h3>
                    {errors.subjects && <p className="text-red-500 text-sm mb-2">{errors.subjects}</p>}
                    <div className="flex flex-col md:flex-row gap-4">
                        <select 
                            className="flex-grow border border-gray-300 p-3 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                        >
                            <option value="">Bitte wählen</option>
                            {availableSubjects.map((fach, index) => (
                                <option key={index} value={fach.fach}>{fach.fach}</option>
                            ))}
                        </select>
                        <button 
                            type="button" 
                            className="px-6 py-3 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                            onClick={handleAddSubject}
                        >
                            Fach hinzufügen
                        </button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {subjects.map((subject, index) => (
                            <div key={index} className="flex items-center bg-blue-100 text-blue-800 rounded-full px-4 py-2">
                                <span>{subject}</span>
                                <button
                                    type="button"
                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                    onClick={() => handleRemoveSubject(subject)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Additional Information Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Zusätzliche Informationen</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block font-medium text-gray-700">Geburtsdatum</label>
                            <input 
                                type="date" 
                                className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-primary focus:border-transparent" 
                                value={formData.dateOfBirth || ""}
                                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-medium text-gray-700">Geburtsort</label>
                            <input 
                                type="text" 
                                className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-primary focus:border-transparent" 
                                value={formData.placeOfBirth || ""}
                                onChange={(e) => setFormData({...formData, placeOfBirth: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-medium text-gray-700">Bankleitzahl</label>
                            <input 
                                type="text" 
                                className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-primary focus:border-transparent" 
                                value={formData.bankCode || ""}
                                onChange={(e) => setFormData({...formData, bankCode: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-medium text-gray-700">IBAN</label>
                            <input 
                                type="text" 
                                className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-primary focus:border-transparent" 
                                value={formData.iban || ""}
                                onChange={(e) => setFormData({...formData, iban: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="mt-6 space-y-2">
                        <label className="block font-medium text-gray-700">Beschreibung</label>
                        <textarea 
                            className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-primary focus:border-transparent h-32" 
                            value={formData.description || ""}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Erzählen Sie etwas über sich und Ihre Qualifikationen"
                        />
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col md:flex-row gap-4 justify-end">
                    <button
                        type="button"
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                        onClick={() => navigate(-1)}
                    >
                        Abbrechen
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-primary text-white rounded hover:bg-primary-dark transition-colors disabled:opacity-50"
                        onClick={handleRegistration}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Wird verarbeitet...
                            </span>
                        ) : 'Registrieren'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegisterTutor;
