// import React, { useState } from 'react';

// const LoginPage = ({ onLogin }) => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onLogin(email, password);
//     };

//     return (
//         <div className="p-4 max-w-md mx-auto">
//             <h2 className="text-xl mb-4">Login</h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <input type="email" placeholder="Email" className="w-full border p-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
//                 <input type="password" placeholder="Password" className="w-full border p-2" value={password} onChange={(e) => setPassword(e.target.value)} required />
//                 <button type="submit" className="bg-blue-500 text-white px-4 py-2">Login</button>
//             </form>
//         </div>
//     );
// };

// export default LoginPage;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import this

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // ✅ Initialize

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await onLogin(email, password); // ✅ Check if login succeeded
        if (success) {
            navigate('/projects'); // ✅ Redirect on success
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h2 className="text-xl mb-4">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="email" placeholder="Email" className="w-full border p-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" className="w-full border p-2" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;
