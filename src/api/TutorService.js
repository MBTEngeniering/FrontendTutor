const apiUrl = import.meta.env.VITE_API_URL;

const TutorService = {
    getAllTutors: async () => {
        try {
            const response = await fetch(apiUrl + `/api/nutzer/all`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            //console.log(apiUrl+`/api/nutzer/all`);

            const data = await response.json();            
            return data;
        } catch (error) {
            console.error('Error fetching tutors:', error);
            throw error;
        }
    }
};

export default TutorService;