// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './Dashboard.css'; // Import the CSS file
// import { useNavigate } from 'react-router-dom';
// interface User {
//   id: number;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   gender: string;
//   userType: string;
//   agencyId: number | null;
// }
// const Dashboard: React.FC = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate()

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const token = localStorage.getItem('token');

//         if (!token) {
//           setError('No token found. Please log in.');
//           return;
//         }

//         const response = await axios.get<{ userList: User[] }>('http://localhost:9000/api/dashboard', {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setUsers(response.data.userList);
//       } catch (error) {
//         const errorMessage = axios.isAxiosError(error) && error.response
//           ? error.response.data.message || 'Error fetching users'
//           : 'Error fetching users';
//         setError(errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);
//   const handleLogout = () => {
//     try {
//       navigate('/login')
//     } catch (error) {
//       console.log(error)
//     }
//   }
//   const renderContent = () => {
//     if (loading) return <div className="loading-message">Loading...</div>;
//     if (error) return <div className="error-message">{error}</div>;

//     return (
//       <div className="user-cards">
//         {users.map(user => (
//           <div className="user-card" key={user.id}>
//             <h2 className="user-name">{`${user.firstName} ${user.lastName}`}</h2>
//             <p className="user-info"><strong>Email:</strong> {user.email}</p>
//             <p className="user-info"><strong>Phone:</strong> {user.phone}</p>
//             <p className="user-info"><strong>Gender:</strong> {user.gender}</p>
//             <p className="user-info"><strong>User Type:</strong> {user.userType === '1' ? 'Job Seeker' : 'Agency'}</p>
//             <button onClick={handleLogout}>Logout</button>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="dashboard-container">
//       <h1 className="dashboard-title">User Dashboard</h1>
//       {renderContent()}
//     </div>
//   );
// };

// export default Dashboard;


//////***** */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  userType: string; // '1' for Job Seeker, '2' for Agency
  agencyId: number | null;
}

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [currentUserType, setCurrentUserType] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('No token found. Please log in.');
          return;
        }

        // Fetch current user's info to determine user type
        const userResponse = await axios.get<{ userType: string }>('http://localhost:9000/api//agencies', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCurrentUserType(userResponse.data.userType);

        // Fetch relevant users based on user type
        const usersResponse = await axios.get<{ userList: User[] }>(
          currentUserType === '1' ? 'http://localhost:9000/api/agencies' : 'http://localhost:9000/api//dashboard',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUsers(usersResponse.data.userList);
      } catch (error) {
        const errorMessage = axios.isAxiosError(error) && error.response
          ? error.response.data.message || 'Error fetching users'
          : 'Error fetching users';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token from local storage
    setUsers([]); // Reset the users state
    navigate('/login'); // Navigate to the login page
  };

  const renderContent = () => {
    if (loading) return <div className="loading-message">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
      <div className="user-cards">
        {users.map(user => (
          <div className="user-card" key={user.id}>
            <h2 className="user-name">{`${user.firstName} ${user.lastName}`}</h2>
            <p className="user-info"><strong>Email:</strong> {user.email}</p>
            <p className="user-info"><strong>Phone:</strong> {user.phone}</p>
            <p className="user-info"><strong>Gender:</strong> {user.gender}</p>
            <p className="user-info"><strong>User Type:</strong> {user.userType === '1' ? 'Job Seeker' : 'Agency'}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">User Dashboard</h1>
      {renderContent()}
    </div>
  );
};

export default Dashboard;
