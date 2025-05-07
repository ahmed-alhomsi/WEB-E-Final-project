import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Projects = ({ user, token, onLogout }) => {
    const [projects, setProjects] = useState([]);
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        if (!token) return;

        fetch('http://localhost:8055/users/me?fields=*,role.id,role.name', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                const userData = data.data;
                setUserDetails(userData);

                fetch('http://localhost:8055/items/project?fields=*,user_created.id,project_supervisor.id', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                    .then(res => res.json())
                    .then(data => {
                        const allProjects = data.data;
                        const role = userData.role?.name;
                        let filtered = [];

                        if (role === 'student') {
                            filtered = allProjects.filter(
                                p => p.user_created?.id === userData.id
                            );
                        } else if (role === 'supervisor') {
                            filtered = allProjects.filter(
                                p => p.project_supervisor?.id === userData.id
                            );
                        } else if (role === 'committee_head') {
                            filtered = allProjects;
                        }

                        setProjects(filtered);
                    })
                    .catch(err => console.error('Error fetching projects:', err));
            })
            .catch(err => console.error('Error fetching user details:', err));
    }, [token]);

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">
                    Welcome, {userDetails?.first_name || user?.first_name || 'User'}
                </h1>
                <button className="bg-red-500 text-white px-3 py-1" onClick={onLogout}>
                    Logout
                </button>
            </div>
            <h2 className="text-lg mb-2">Your Projects</h2>
            {projects.length === 0 ? (
                <p className="text-gray-600">No projects to display.</p>
            ) : (
                <ul className="space-y-2">
                    {projects.map(project => (
                        <li key={project.id} className="border p-2 rounded">
                            <Link to={`/projects/${project.id}`}>{project.title}</Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Projects;
