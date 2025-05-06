import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const AddUpdate = ({ token }) => {
    const { id: projectId } = useParams();
    const [content, setContent] = useState('');
    const [studentNote, setStudentNote] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        try {
            const res = await fetch('http://localhost:8055/items/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    content,
                    project: projectId,
                    student_note: studentNote,
                }),
            });

            if (!res.ok) throw new Error('Failed to add update');

            setSuccess(true);
            setContent('');
            setStudentNote('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="p-4 max-w-xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Add Update</h2>
            {success && <p className="text-green-600 mb-2">Update added successfully!</p>}
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Update content"
                    className="w-full border p-2 h-24"
                    required
                />
                <textarea
                    value={studentNote}
                    onChange={(e) => setStudentNote(e.target.value)}
                    placeholder="Student note (optional)"
                    className="w-full border p-2 h-16"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Submit Update
                </button>
            </form>
        </div>
    );
};

export default AddUpdate;
