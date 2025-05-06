import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ProjectDetails = ({ token }) => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetch(`http://localhost:8055/items/project/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch project');
                return res.json();
            })
            .then(data => setProject(data.data))
            .catch(err => console.error(err));
    }, [id, token]);

    if (!project) return <p>Loading...</p>;

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-2">{project.title}</h1>
            <p><strong>Description:</strong> {project.description}</p>
            <p><strong>Date added:</strong> {project.date_created}</p>
            <p><strong>Summary:</strong> {project.idea_summary}</p>
            <p><strong>Status:</strong> {project.status}</p>
            <p><strong>Student Notes:</strong> {project.student_notes}</p>
            <p><strong>Supervisor:</strong> {project.project_supervisor}</p>
            <p><strong>Supervisor Notes:</strong> {project.supervisor_notes}</p>
            <p><strong>Committee Head:</strong> {project.committee_head}</p>
            <p><strong>Final Evaluation:</strong> {project.final_evaluation}</p>
            {/* {user?.role === 'student' && (
                <li key={project.id} className="border p-2 rounded">
                    <Link to={`/projects/${project.id}/update`}>Add update</Link>
                </li>
            )} */}
        </div>
    );
};

export default ProjectDetails;





// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';

// const ProjectDetails = ({ token }) => {
//     const { id } = useParams();
//     const [project, setProject] = useState(null);

//     useEffect(() => {
//         const fetchProjectDetails = async () => {
//             try {
//                 const res = await fetch(`http://localhost:8055/items/project/${id}`, {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });

//                 if (!res.ok) throw new Error('Failed to fetch project');

//                 const projectData = await res.json();
//                 const project = projectData.data;

//                 // Fetch supervisor and committee head user data
//                 const [supervisorRes, committeeRes] = await Promise.all([
//                     fetch(`http://localhost:8055/users/${project.project_supervisor}`, {
//                         headers: { Authorization: `Bearer ${token}` },
//                     }),
//                     fetch(`http://localhost:8055/users/${project.committee_head}`, {
//                         headers: { Authorization: `Bearer ${token}` },
//                     }),
//                 ]);

//                 if (!supervisorRes.ok || !committeeRes.ok) throw new Error('Failed to fetch user data');

//                 const [supervisorData, committeeData] = await Promise.all([
//                     supervisorRes.json(),
//                     committeeRes.json(),
//                 ]);

//                 // Add names to the project object
//                 setProject({
//                     ...project,
//                     project_supervisor_name: `${supervisorData.first_name} ${supervisorData.last_name}`,
//                     committee_head_name: `${committeeData.first_name} ${committeeData.last_name}`,
//                 });
//             } catch (err) {
//                 console.error(err);
//             }
//         };

//         fetchProjectDetails();
//     }, [id, token]);

//     if (!project) return <p>Loading...</p>;

//     return (
//         <div className="p-4">
//             <h1 className="text-xl font-bold mb-2">{project.title}</h1>
//             <p><strong>Description:</strong> {project.description}</p>
//             <p><strong>Date added:</strong> {project.date_created}</p>
//             <p><strong>Summary:</strong> {project.idea_summary}</p>
//             <p><strong>Status:</strong> {project.status}</p>
//             <p><strong>Student Notes:</strong> {project.student_notes}</p>
//             <p><strong>Supervisor:</strong> {project.project_supervisor_name}</p>
//             <p><strong>Supervisor Notes:</strong> {project.supervisor_notes}</p>
//             <p><strong>Committee Head:</strong> {project.committee_head_name}</p>
//             <p><strong>Final Evaluation:</strong> {project.final_evaluation}</p>
//         </div>
//     );
// };

// export default ProjectDetails;
