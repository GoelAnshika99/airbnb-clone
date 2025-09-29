import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const ProfilePage = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [gender, setGender] = useState("");
  const [language, setLanguage] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState("");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [languages, setLanguages] = useState(["English", "Spanish", "French", "German"]);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const geoNamesUsername = "anshikagoel";
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const { data } = await axios.get("https://restcountries.com/v3.1/all?fields=name,cca2");
        const countryList = data.map(({ name, cca2 }) => ({ name: name.common, code: cca2 }))
                                 .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(countryList);
      } catch (err) {
        console.error("Error fetching countries:", err);
      }
    };
    fetchCountries();
  }, []);
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/profile/view", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        
        const { phone, aboutMe, gender, language, country, state, city, profilePicture } = data;
        setPhoneNumber(phone);
        setAboutMe(aboutMe);
        setGender(gender);
        setLanguage(language);
        setCountry(country);
        setState(state);
        setCity(city);
        if (profilePicture) {
          setProfileImagePreview(`data:image/jpeg;base64,${profilePicture}`);
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    fetchUserProfile();
  }, []);
  const fetchStates = async (countryCode) => {
    try {
      const geonameId = await fetchCountryGeonameId(countryCode);
      if (!geonameId) return;

      const { data } = await axios.get(
        `http://api.geonames.org/childrenJSON?geonameId=${geonameId}&username=${geoNamesUsername}`
      );

      setStates(data.geonames.map(({ name, adminCode1 }) => ({ name, code: adminCode1 })));
    } catch (err) {
      console.error("Error fetching states:", err);
      setStates([]);
    }
  };
  const fetchCities = async (countryCode, stateCode) => {
    try {
      const { data } = await axios.get(
        `http://api.geonames.org/searchJSON?adminCode1=${stateCode}&country=${countryCode}&username=${geoNamesUsername}&maxRows=100`
      );
      setCities(data.geonames.map((city) => city.name));
    } catch (err) {
      console.error("Error fetching cities:", err);
      setCities([]);
    }
  };
  const fetchCountryGeonameId = async (countryCode) => {
    try {
      const { data } = await axios.get(
        `http://api.geonames.org/searchJSON?q=${countryCode}&countryCode=${countryCode}&maxRows=10&username=${geoNamesUsername}`
      );
      return data.geonames[1]?.countryId;
    } catch (err) {
      console.error("Error fetching geonameId:", err);
      return null;
    }
  };
  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);
    fetchStates(selectedCountry);
    setState("");
    setCity("");
  };
  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setState(selectedState);
    fetchCities(country, selectedState);
  };
  const validatePhoneNumber = (phone) => /^[0-9]{10}$/.test(phone);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhoneNumber(phoneNumber)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    if (!gender || !language || !country || !state || !city) {
      setError("All fields except 'About Me' and 'Profile Picture' are required.");
      return;
    }
    const formData = new FormData();
    formData.append("phone", phoneNumber);
    formData.append("aboutMe", aboutMe);
    formData.append("gender", gender);
    formData.append("language", language);
    formData.append("country", country);
    formData.append("state", state);
    formData.append("city", city);
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }
    try {
      const { status } = await axios.put("http://localhost:5000/api/profile/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (status === 200) {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error updating profile. Please try again.");
    }
  };
  return (
    <div className="container">
      <h2 className="mt-5">Complete Your Profile</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="text"
            className="form-control"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">About Me</label>
          <textarea
            className="form-control"
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Gender</label>
          <div>
            <input
              type="radio"
              id="male"
              name="gender"
              value="male"
              checked={gender === "male"}
              onChange={() => setGender("male")}
            />
            <label className="mr-3" htmlFor="male">Male</label>
            <input
              type="radio"
              id="female"
              name="gender"
              value="female"
              checked={gender === "female"}
              onChange={() => setGender("female")}
            />
            <label className="mr-3" htmlFor="female">Female</label>
            <input
              type="radio"
              id="prefer-not-to-say"
              name="gender"
              value="prefer-not-to-say"
              checked={gender === "prefer-not-to-say"}
              onChange={() => setGender("prefer-not-to-say")}
            />
            <label htmlFor="prefer-not-to-say">Prefer not to say</label>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Language</label>
          <select
            className="form-control"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            required
          >
            <option value="">Select Language</option>
            {languages.map((lang, idx) => (
              <option key={idx} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Country</label>
          <select
            className="form-control"
            value={country}
            onChange={handleCountryChange}
            required
          >
            <option value="">Select Country</option>
            {countries.map((c, idx) => (
              <option key={idx} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">State</label>
          <select
            className="form-control"
            value={state}
            onChange={handleStateChange}
            required
            disabled={!country}
          >
            <option value="">Select State</option>
            {states.map((s, idx) => (
              <option key={idx} value={s.code}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">City</label>
          <select
            className="form-control"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            disabled={!state}
          >
            <option value="">Select City</option>
            {cities.map((c, idx) => (
              <option key={idx} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Profile Picture</label>
          {profileImagePreview && (
            <img
              src={profileImagePreview}
              alt="Profile Preview"
              style={{
                width: "150px", 
                height: "150px", 
                objectFit: "cover", 
                marginBottom: "10px", 
                borderRadius: "8px"
              }}
            />
          )}
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setProfilePicture(file);
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setProfileImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Save Profile
        </button>
      </form>
    </div>
  );
};
export default ProfilePage;