// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';

// const Projects = ({ user, token, onLogout }) => {
//     const [projects, setProjects] = useState([]);

//     useEffect(() => {
//         fetch('http://localhost:8055/items/project', {
//             headers: { Authorization: `Bearer ${token}` },
//         })
//             .then(res => {
//                 if (!res.ok) throw new Error('Failed to load projects');
//                 return res.json();
//             })
//             .then(data => setProjects(data.data))
//             .catch(err => console.error(err));
//     }, [token]);

//     return (
//         <div className="p-4">
//             <div className="flex justify-between items-center mb-4">
//                 <h1 className="text-xl font-bold">Welcome, {user?.first_name || 'User'}</h1>
//                 <button className="bg-red-500 text-white px-3 py-1" onClick={onLogout}>Logout</button>
//             </div>
//             <h2 className="text-lg mb-2">Your Projects</h2>
//             <ul className="space-y-2">
//                 {projects.map(project => (
//                     <li key={project.id} className="border p-2 rounded">
//                         <Link to={`/projects/${project.id}`}>{project.title}</Link>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default Projects;



import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Projects = ({ user, token, onLogout }) => {
    const [projects, setProjects] = useState([]);
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        if (token) {
            // Fetch user details
            fetch('http://localhost:8055/users/me', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch user');
                    return res.json();
                })
                .then(data => setUserDetails(data.data))
                .catch(err => console.error(err));

            // Fetch projects
            fetch('http://localhost:8055/items/project', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(res => {
                    if (!res.ok) throw new Error('Failed to load projects');
                    return res.json();
                })
                .then(data => setProjects(data.data))
                .catch(err => console.error(err));
        }
    }, [token]);

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">
                    Welcome, {userDetails?.first_name || user?.first_name || 'User'}
                </h1>
                <button className="bg-red-500 text-white px-3 py-1" onClick={onLogout}>Logout</button>
            </div>
            <h2 className="text-lg mb-2">Your Projects</h2>
            <ul className="space-y-2">
                {projects.map(project => (
                    <li key={project.id} className="border p-2 rounded">
                        <Link to={`/projects/${project.id}`}>{project.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Projects;
