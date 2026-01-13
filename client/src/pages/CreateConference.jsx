import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateConference.module.css";
import conferenceRequests from "../api/conferenceRequests";
import userRequests from "../api/userRequests";

export default function CreateConference() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    reviewer1: "",
    reviewer2: "",
    reviewer3: "",
  });

  const [reviewers, setReviewers] = useState([]);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchReviewers = async () => {
      try {
        const data = await userRequests.getAllReviewers();
        setReviewers(data);
      } catch (error) {
        console.error("Failed to fetch reviewers:", error);
      }
    };

    fetchReviewers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const getAvailableReviewers = (currentField) => {
    const selectedReviewers = [
      formData.reviewer1,
      formData.reviewer2,
      formData.reviewer3,
    ].filter((id) => id !== "" && id !== formData[currentField]);

    return reviewers.filter(
      (reviewer) => !selectedReviewers.includes(reviewer.id)
    );
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const conferenceData = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reviewers: [
        formData.reviewer1,
        formData.reviewer2,
        formData.reviewer3,
      ].filter((id) => id !== ""),
    };

    try {
      const createdConference = await conferenceRequests.create(conferenceData);
      console.log("Success! Conference created:", createdConference);

      // Redirect to home page
      navigate("/");
    } catch (error) {
      console.error("Failed to create conference:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Create Conference</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? styles.inputError : ""}
          />
          {errors.title && <span className={styles.error}>{errors.title}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="startDate">Start date *</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={errors.startDate ? styles.inputError : ""}
          />
          {errors.startDate && (
            <span className={styles.error}>{errors.startDate}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="endDate">End date *</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={errors.endDate ? styles.inputError : ""}
          />
          {errors.endDate && (
            <span className={styles.error}>{errors.endDate}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="reviewer1">Reviewer 1</label>
          <select
            id="reviewer1"
            name="reviewer1"
            value={formData.reviewer1}
            onChange={handleChange}
          >
            <option value="">Select a reviewer</option>
            {getAvailableReviewers("reviewer1").map((reviewer) => (
              <option key={reviewer.id} value={reviewer.id}>
                {reviewer.name} ({reviewer.email})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="reviewer2">Reviewer 2</label>
          <select
            id="reviewer2"
            name="reviewer2"
            value={formData.reviewer2}
            onChange={handleChange}
          >
            <option value="">Select a reviewer</option>
            {getAvailableReviewers("reviewer2").map((reviewer) => (
              <option key={reviewer.id} value={reviewer.id}>
                {reviewer.name} ({reviewer.email})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="reviewer3">Reviewer 3</label>
          <select
            id="reviewer3"
            name="reviewer3"
            value={formData.reviewer3}
            onChange={handleChange}
          >
            <option value="">Select a reviewer</option>
            {getAvailableReviewers("reviewer3").map((reviewer) => (
              <option key={reviewer.id} value={reviewer.id}>
                {reviewer.name} ({reviewer.email})
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className={styles.submitButton}>
          Create conference
        </button>
      </form>
    </div>
  );
}
