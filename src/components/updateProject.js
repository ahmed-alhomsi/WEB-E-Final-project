import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateProject = ({ token }) => {
    const { id: projectId } = useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert('User not found.');
            return;
        }

        const newUpdate = {
            project_id: parseInt(projectId), // ✅ Make sure it's an integer
            content: content.trim(),
            submitted_by: user.id,
        };

        try {
            const res = await fetch('http://localhost:8055/items/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newUpdate),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error('Directus Error:', data);
                throw new Error(data?.errors?.[0]?.message || 'Unknown error');
            }

            navigate(`/projects/${projectId}`);
        } catch (err) {
            alert('Update submission failed: ' + err.message);
            console.error('Error:', err);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-2">Submit a Progress Update</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    className="w-full border rounded p-2 mb-4"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="5"
                    placeholder="Write your progress update here..."
                    required
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default UpdateProject;
