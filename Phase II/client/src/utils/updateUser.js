import axios from "axios";

export const updateUser = (userId, fieldToUpdateParam, newValueParam) => {
    axios.put(`http://localhost:3001/update-user/${userId}`, { fieldToUpdate: fieldToUpdateParam, newValue: newValueParam })
        .then(() => {
            console.log("Successfuly updated user");
        })
        .catch((err) => {
            console.error(`Error updating User: ${err}`);
        });
}