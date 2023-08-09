import { useState } from 'react';
import axios from 'axios';

import { AlertError } from './views/AlertError';
import { AlertSuccess } from './views/AlertSuccess';

const PORT = process.env.REACT_APP_PORT_BACKEND || 5001;
const ADDRESS = process.env.REACT_APP_ADDRESS_BACKEND;

const Form = () => {
    const initialFormData = {
        search_text: '',
    };

    const [formData, setFormData] = useState(initialFormData);
    const [formSuccess, setFormSuccess] = useState('');
    const [formErrors, setFormErrors] = useState([]);
    const [searchKey, setSearchKey] = useState('');
    const [formResults, setFormResults] = useState([]);
    const [searching, setSearching] = useState('');

    const handleSubmit = async (e) => {
        // This will stop the form from executing the default behavior and redirect you to another page.
        e.preventDefault();

        // setFormErrors([]);
        setFormSuccess('');
        setSearchKey('')
        setFormResults([]);

        // Display "Searching..." message while searching
        setSearching('Searching ...')

        try {
            // Send POST request to the backend API
            await axios.post(`http://${ADDRESS}:${PORT}/api/v2/search`, formData).then((res) => {

                setSearchKey(formData);

                // receive the search results from the backend
                const searchResult = res.data;
                // searchResult is currently an object of objects.
                // Expand it to a list of objects
                setFormResults([...searchResult]);

                // HTTP req successful
                setFormSuccess('Data received correctly');

                // Stop displaying "Searching" once the search is done
                setSearching('')
            }).catch((error) => {
                handleErrors(error);
            });
        } catch (err) {
            handleErrors(err);
        }
        // Reset form data
        setSearching('')
        setFormData(initialFormData);
    };

    const handleButton = () => {
        setFormSuccess('');
        setSearchKey('')
        setFormResults([]);
        setSearching('')
    }

    const handleErrors = (err) => {
        if (err.response.data && err.response.data.errors) {
            // Handle validation errors
            const { errors } = err.response.data;

            let errorMsg = [];
            for (let error of errors) {
                const { msg } = error;
                errorMsg.push(msg);
            }

            setFormErrors(errorMsg);
        } else {
            // Handle generic error
            setFormErrors(['Oops, there was an error!']);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setFormErrors([]);
        setFormSuccess('');
        setSearchKey('')
        setFormResults([]);
        setSearching('')
    };

    let key_label;
    let result_label;
    if (searchKey.search_text) {
        key_label = <h2>Search Key</h2>
        result_label = <h2>Search Results</h2>
    }

    let searching_label;
    if (searching !== "") {
        searching_label = <div className='searching-label'><h1>{searching}</h1></div>
    }


    return (
        <div>
            {/* <form onSubmit={handleSubmit} className="form"> */}
            <form className="form">
                <h1><label>Search</label></h1>

                <AlertError errors={formErrors} />

                <div>
                    <textarea
                        type="text"
                        name="search_text"
                        className="input"
                        value={formData.search_text}
                        onInput={handleChange}
                    />
                </div>

                {/* <input type="submit" className="button" value="Submit" /> */}

                {/* Multiple buttons */}
                <button onClick={handleSubmit}>Submit</button>
                <button onClick={handleButton}>Reset</button>

                <div className='Search-Result'>
                    {key_label}
                    {searchKey.search_text}
                    {searching_label}
                    {result_label}

                    {/* Loop for all items in formResults */}
                    {formResults.map(result => (
                        <li className='menu-item' key={result.id}><i><b>{result.id}:</b></i> <i>{result.metadata.text}</i></li>
                    ))}

                </div>

            </form>
        </div >
    );
};

export default Form;