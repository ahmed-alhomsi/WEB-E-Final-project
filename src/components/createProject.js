import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateProjectPage = ({ token, studentId }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        idea_summary: '',
        description: '',
        student_notes: '',
        student: studentId || '',
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('http://localhost:8055/items/project', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to create project');

            const result = await res.json();
            setSuccess(true);
            navigate(`/projects/${result.data.id}`);
        } catch (err) {
            console.error(err);
            setError('Failed to create project. Please try again.');
        }
    };

    return (
        <div className="p-4 max-w-lg mx-auto">
            <h2 className="text-2xl mb-4">Create a New Project</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="title"
                    placeholder="Project Title"
                    className="w-full border p-2"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="idea_summary"
                    placeholder="Idea Summary"
                    className="w-full border p-2"
                    value={formData.idea_summary}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Detailed Description"
                    className="w-full border p-2"
                    value={formData.description}
                    onChange={handleChange}
                />
                <textarea
                    name="student_notes"
                    placeholder="Any Notes"
                    className="w-full border p-2"
                    value={formData.student_notes}
                    onChange={handleChange}
                />

                <button type="submit" className="bg-green-600 text-white px-4 py-2">
                    Submit Project
                </button>

                {error && <p className="text-red-600">{error}</p>}
                {success && <p className="text-green-600">Project created successfully!</p>}
            </form>
        </div>
    );
};

export default CreateProjectPage;
