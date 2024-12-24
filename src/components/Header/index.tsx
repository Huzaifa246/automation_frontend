import React, { useState } from 'react';
import axios from 'axios';

const Header = ({ className }: { className: string }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false); // For showing a loading state
  const [error, setError] = useState<string | null>(null); // For error handling

  const handleSearch = async () => {
    if (!searchQuery) {
      setError('Please enter a search query.');
      return;
    }

    setLoading(true);
    setError(null); // Clear any previous error
    try {
      const res = await axios.get(`http://localhost:5000/search?q=${encodeURIComponent(searchQuery)}`);
      console.log('Search results:', res.data.results);
      alert('Articles saved successfully! Check your Firebase database for saved results.');
    } catch (err) {
      console.error('Error fetching search results:', err);
      setError('An error occurred while searching. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-row justify-between bg-gray-700 items-center px-12 py-4`}>
      <h1 className="text-2xl text-white">AutoWriter</h1>
      <input
        type="text"
        className="border-0 bg-slate-200 w-90 py-2 px-3 rounded-lg outline-none"
        placeholder="Search articles..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button
        className={`ml-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={handleSearch}
        disabled={loading}
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default Header;
