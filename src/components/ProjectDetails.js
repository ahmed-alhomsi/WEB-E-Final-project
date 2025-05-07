import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const ProjectDetails = ({ token }) => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [updates, setUpdates] = useState([]);
    const [user, setUser] = useState(null);

    const [supervisors, setSupervisors] = useState([]);


    const [finalEvaluation, setFinalEvaluation] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        // Fetch the project itself
        fetch(`http://localhost:8055/items/project/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch project');
                return res.json();
            })
            .then(data => setProject(data.data))
            .catch(err => console.error(err));

        // Fetch related updates
        fetch(`http://localhost:8055/items/update?filter[project_id][_eq]=${id}&sort=-date_created`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch updates');
                return res.json();
            })
            .then(data => setUpdates(data.data))
            .catch(err => console.error(err));
    }, [id, token]);




    useEffect(() => {
        if (user?.role?.name === 'committee_head') {
            fetch('http://localhost:8055/users?filter[role][name][_eq]=supervisor&fields=id,first_name,last_name', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(res => res.json())
                .then(data => setSupervisors(data.data))
                .catch(err => console.error('Failed to fetch supervisors', err));
        }
    }, [user, token]);




    const handleEvaluationSubmit = () => {
        fetch(`http://localhost:8055/items/project/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ final_evaluation: finalEvaluation }),
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to submit evaluation');
                return res.json();
            })
            .then(data => {
                alert('Evaluation submitted!');
                setProject(prev => ({ ...prev, final_evaluation: finalEvaluation }));
            })
            .catch(err => console.error(err));
    };

    if (!project) return <p>Loading...</p>;

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-2">{project.title}</h1>
            <p><strong>Description:</strong> {project.description}</p>
            <p><strong>Date added:</strong> {new Date(project.date_created).toLocaleString()}</p>
            <p><strong>Summary:</strong> {project.idea_summary}</p>
            <p><strong>Status:</strong> {project.status}</p>



            {user?.role?.name === 'committee_head' && (
                <div className="mt-4">
                    <label className="block font-semibold mb-1">Change Project Status:</label>
                    <select
                        value={project.status}
                        onChange={async (e) => {
                            const newStatus = e.target.value;

                            try {
                                const res = await fetch(`http://localhost:8055/items/project/${project.id}`, {
                                    method: 'PATCH',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${token}`,
                                    },
                                    body: JSON.stringify({ status: newStatus }),
                                });

                                if (!res.ok) throw new Error('Failed to update status');

                                // Update local state
                                setProject(prev => ({ ...prev, status: newStatus }));
                            } catch (err) {
                                console.error(err);
                                alert('Could not update project status.');
                            }
                        }}
                        className="border p-2 rounded"
                    >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="completed">completed</option>
                    </select>
                </div>
            )}






            <p><strong>Committee Head:</strong> {project.committee_head}</p>


            <p><strong>Student Notes:</strong> {project.student_notes}</p>
            <p><strong>Supervisor Notes:</strong> {project.supervisor_notes}</p>










            {project.project_supervisor && (
                <p className="mt-1 text-sm text-gray-600">
                    Currently assigned to: {
                        supervisors.find(s => s.id === project.project_supervisor)?.first_name
                    } {
                        supervisors.find(s => s.id === project.project_supervisor)?.last_name
                    }
                </p>
            )}









            {user?.role?.name === 'committee_head' && (
                <div className="mt-4">
                    <label className="block font-semibold mb-1">Assign Supervisor:</label>
                    <select
                        value={project.project_supervisor || ''}
                        onChange={(e) => {
                            const supervisorId = e.target.value;

                            fetch(`http://localhost:8055/items/project/${project.id}`, {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({ project_supervisor: supervisorId }),
                            })
                                .then(res => {
                                    if (!res.ok) throw new Error('Failed to assign supervisor');
                                    return res.json();
                                })
                                .then(() => {
                                    alert('Supervisor assigned!');
                                    setProject(prev => ({ ...prev, project_supervisor: supervisorId }));
                                })
                                .catch(err => {
                                    console.error(err);
                                    alert('Error assigning supervisor');
                                });
                        }}
                        className="border p-2 rounded w-64"
                    >
                        <option value="">-- Select Supervisor --</option>
                        {supervisors.map(s => (
                            <option key={s.id} value={s.id}>
                                {s.first_name} {s.last_name}
                            </option>
                        ))}
                    </select>
                </div>
            )}









            <p><strong>Final Evaluation:</strong> {project.final_evaluation}</p>
            {user?.role?.name === 'committee_head' && (
                <div className="mt-4">
                    <label htmlFor="final_evaluation" className="block font-semibold mb-1">Final Evaluation (out of 100):</label>
                    <input
                        type="number"
                        id="final_evaluation"
                        value={finalEvaluation}
                        onChange={(e) => setFinalEvaluation(e.target.value)}
                        className="border px-2 py-1 rounded w-24"
                    />
                    <button
                        onClick={handleEvaluationSubmit}
                        className="ml-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                    >
                        Submit Grade
                    </button>
                </div>
            )}


            {user?.role?.name === 'student' && (
                <li key={project.id} className="border p-2 rounded mt-4">
                    <Link to={`/projects/${project.id}/update`} className="text-blue-600 hover:underline">
                        Add update
                    </Link>
                </li>
            )}

            <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Progress Updates</h2>
                {updates.length === 0 ? (
                    <p>No updates submitted yet.</p>
                ) : (
                    <ul className="space-y-3">
                        {updates.map((update) => (
                            <li key={update.id} className="border p-3 rounded bg-gray-100">
                                <p>{update.content}</p>
                                <p className="text-sm text-gray-600 mb-1">
                                    Submitted on {new Date(update.date_created).toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ProjectDetails;
