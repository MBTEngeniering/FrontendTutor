const TutorService = {
    getAllTutors: async() => {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL+`/api/nutzer/all`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log(process.env.REACT_APP_API_URL+`/api/nutzer/all`);

            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error('Error fetching tutors:', error);
            throw error;
        }
    }
};

export default TutorService;