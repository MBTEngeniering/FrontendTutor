const apiUrl = import.meta.env.VITE_API_URL; 

const TutorService = {

    getAllTutors: async () => {
        try {
            const response = await fetch(apiUrl + `/api/tutors`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }


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
