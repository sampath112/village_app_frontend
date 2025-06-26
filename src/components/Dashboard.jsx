// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import ProfileCard from './ProfileCard';

// function Dashboard() {
//   const [profiles, setProfiles] = useState([]);
//   const [filters, setFilters] = useState({
//     employmentStatus: '',
//     qualification: '',
//     sort: 'asc',
//   });

//   const qualifications = [
//     'Below 10th', '10th Pass', 'Intermediate', 'TTC', 'ITI', 'ITI+Apprenticeship',
//     'Diploma', 'B.Tech', 'B.Sc', 'B.Com', 'B.Ed', 'Other Degree', 'MA', 'M.Com', 'M.Tech'
//   ];

//   useEffect(() => {
//     fetchProfiles();
//   }, [filters]);

//   const fetchProfiles = async () => {
//     try {
//       const res = await axios.get('http://localhost:8000/api/profiles', {
//         params: filters,
//       });
//       setProfiles(res.data);
//     } catch (err) {
//       console.error('Error fetching profiles:', err);
//     }
//   };

//   const handleFilterChange = (e) => {
//     setFilters({ ...filters, [e.target.name]: e.target.value });
//   };

//   return (
//     <div className="min-h-screen bg-neutral py-8 sm:py-12 lg:py-16">
//       <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text mb-8 text-center animate-fade-in">
//           Chinnabondapalli Youth Dashboard
//         </h2>

//         {/* Filters */}
//         <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-slide-up">
//           <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-between">
//             <div className="flex-1">
//               <label className="block text-sm font-medium text-text mb-2">Employment Status</label>
//               <select
//                 name="employmentStatus"
//                 value={filters.employmentStatus}
//                 onChange={handleFilterChange}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
//               >
//                 <option value="">All</option>
//                 <option value="Employed">Employed</option>
//                 <option value="Unemployed">Unemployed</option>
//               </select>
//             </div>
//             <div className="flex-1">
//               <label className="block text-sm font-medium text-text mb-2">Qualification</label>
//               <select
//                 name="qualification"
//                 value={filters.qualification}
//                 onChange={handleFilterChange}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
//               >
//                 <option value="">All</option>
//                 {qualifications.map((q) => (
//                   <option key={q} value={q}>{q}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="flex-1">
//               <label className="block text-sm font-medium text-text mb-2">Sort by Name</label>
//               <select
//                 name="sort"
//                 value={filters.sort}
//                 onChange={handleFilterChange}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
//               >
//                 <option value="asc">A-Z</option>
//                 <option value="desc">Z-A</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Profile Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {profiles.length === 0 ? (
//             <p className="text-center text-text text-lg col-span-full animate-fade-in">
//               No profiles found. Try adjusting the filters!
//             </p>
//           ) : (
//             profiles.map((profile) => (
//               <ProfileCard key={profile._id} profile={profile} />
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

// src/components/Dashboard.js
import { useState } from 'react';
import * as XLSX from 'xlsx';
import ProfileCard from './ProfileCard';

function Dashboard() {
  const [profiles, setProfiles] = useState(() => {
    return JSON.parse(localStorage.getItem('profiles') || '[]');
  });
  const [filters, setFilters] = useState({
    employmentStatus: '',
    qualification: '',
    sort: 'asc',
  });

  const qualifications = [
    'Below 10th', '10th Pass', 'Intermediate', 'TTC', 'ITI', 'ITI+Apprenticeship',
    'Diploma', 'B.Tech', 'B.Sc', 'B.Com', 'B.Ed', 'Other Degree', 'MA', 'M.Com', 'M.Tech'
  ];

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      try {
        // Filter out the profile with the given ID
        const updatedProfiles = profiles.filter((profile) => profile._id !== id);
        // Update state and localStorage
        setProfiles(updatedProfiles);
        localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
        alert('Profile deleted successfully!');
      } catch (err) {
        console.error('Error deleting profile:', err);
        alert('Error deleting profile');
      }
    }
  };

  const filteredProfiles = profiles
    .filter((profile) => {
      if (filters.employmentStatus && profile.employmentStatus !== filters.employmentStatus) {
        return false;
      }
      if (filters.qualification && profile.qualification !== filters.qualification) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (filters.sort === 'asc') {
        return nameA < nameB ? -1 : 1;
      } else {
        return nameA > nameB ? -1 : 1;
      }
    });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearData = () => {
    if (window.confirm('Are you sure you want to clear all profiles?')) {
      localStorage.removeItem('profiles');
      setProfiles([]);
      alert('All profiles cleared!');
    }
  };

  const downloadExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(profiles);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Profiles');
      XLSX.writeFile(workbook, 'Chinnabondapalli_Profiles.xlsx');
      alert('Profiles exported successfully!');
    } catch (err) {
      console.error('Error exporting Excel:', err);
      alert('Error exporting profiles');
    }
  };

  return (
    <div className="min-h-screen bg-neutral py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text mb-8 text-center animate-fade-in">
          Chinnabondapalli Youth Dashboard
        </h2>

        <div className="mb-4 text-center">
         
          <button
            onClick={downloadExcel}
            className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-green-500 transition-all mr-4"
          >
            Export to Excel
          </button>
          {/* <button
            onClick={clearData}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
          >
            Clear All Profiles
          </button> */}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-slide-up">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-between">
            <div className="flex-1">
              <label className="block text-sm font-medium text-text mb-2">Employment Status</label>
              <select
                name="employmentStatus"
                value={filters.employmentStatus}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              >
                <option value="">All</option>
                <option value="Employed">Employed</option>
                <option value="Unemployed">Unemployed</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-text mb-2">Qualification</label>
              <select
                name="qualification"
                value={filters.qualification}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              >
                <option value="">All</option>
                {qualifications.map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-text mb-2">Sort by Name</label>
              <select
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              >
                <option value="asc">A-Z</option>
                <option value="desc">Z-A</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.length === 0 ? (
            <p className="text-center text-text text-lg col-span-full animate-fade-in">
              No profiles found. Submit profiles on the Home page!
            </p>
          ) : (
            filteredProfiles.map((profile) => (
              <ProfileCard key={profile._id} profile={profile} onDelete={handleDelete} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;