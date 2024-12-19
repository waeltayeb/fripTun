import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/ComponentClient/NavBar';
import { Link } from 'react-router-dom';
import Chatbox from '../../components/ComponentClient/chatClient';
import PubImage from '../../components/PubImage';

function Profile() {
  const [userData, setUserData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    city: '',
    avenue: '',
    postal: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [isPersonalEdit, setIsPersonalEdit] = useState(false);
  const [isAddressEdit, setIsAddressEdit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('identifier');
        
        if (!token || !id) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/client/profile/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUserData(response.data);
      } catch (error) {
        console.error('Profile fetch error:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const saveChanges = async () => {
    try {
      const token = localStorage.getItem('token');
      const id = localStorage.getItem('identifier');
      await axios.put(
        `http://localhost:5000/api/client/profile/${id}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert('Profile updated successfully!');
      setIsPersonalEdit(false);
      setIsAddressEdit(false);
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Failed to update profile.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:px-52 lg:mt-20 px-1">
        <h2 className="text-title-md2 font-semibold text-black">Profile</h2>
        <nav>
          <ol className="flex items-center gap-2 p-2">
            <li>
              <Link className="font-medium" to="/">
                Dashboard /
              </Link>
            </li>
            <li className="font-medium text-primary">Profile</li>
          </ol>
        </nav>
      </div>

      <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:px-52 px-1">
        {/* Personal Profile Section */}
        <div className="block border mb-6 border-stroke bg-white shadow-default p-6">
          <h2 className="flex justify-between text-title-md2 font-semibold text-black">
            Personal Profile
            <button
              className="text-primary text-lg"
              onClick={() => {
                if (isPersonalEdit) saveChanges();
                setIsPersonalEdit(!isPersonalEdit);
              }}
            >
              {isPersonalEdit ? 'Save' : 'Edit'}
            </button>
          </h2>
          <input
            type="text"
            name="firstname"
            value={userData.firstname}
            onChange={handleInputChange}
            disabled={!isPersonalEdit}
            className={`w-full border p-2 mt-2 ${
              isPersonalEdit ? 'border-primary' : 'border-transparent'
            }`}
          />
          <input
            type="text"
            name="lastname"
            value={userData.lastname}
            onChange={handleInputChange}
            disabled={!isPersonalEdit}
            className={`w-full border p-2 mt-2 ${
              isPersonalEdit ? 'border-primary' : 'border-transparent'
            }`}
          />
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            disabled={!isPersonalEdit}
            className={`w-full border p-2 mt-2 ${
              isPersonalEdit ? 'border-primary' : 'border-transparent'
            }`}
          />
        </div>

        {/* Shipping Address Section */}
        <div className="block border mb-6 border-stroke bg-white shadow-default p-6">
          <h2 className="flex justify-between text-title-md2 font-semibold text-black">
            Shipping Address
            <button
              className="text-primary text-lg"
              onClick={() => {
                if (isAddressEdit) saveChanges();
                setIsAddressEdit(!isAddressEdit);
              }}
            >
              {isAddressEdit ? 'Save' : 'Edit'}
            </button>
          </h2>
          <input
            type="number"
            name="phone"
            value={userData.phone}
            onChange={handleInputChange}
            disabled={!isAddressEdit}
            className={`w-full border p-2 mt-2 ${
              isAddressEdit ? 'border-primary' : 'border-transparent'
            }`}
          />
          <input
            type="text"
            name="city"
            value={userData.city}
            onChange={handleInputChange}
            disabled={!isAddressEdit}
            className={`w-full border p-2 mt-2 ${
              isAddressEdit ? 'border-primary' : 'border-transparent'
            }`}
          />
          <input
            type="text"
            name="avenue"
            value={userData.avenue}
            onChange={handleInputChange}
            disabled={!isAddressEdit}
            className={`w-full border p-2 mt-2 ${
              isAddressEdit ? 'border-primary' : 'border-transparent'
            }`}
          />
          <input
            type="text"
            name="postal"
            value={userData.postal}
            onChange={handleInputChange}
            disabled={!isAddressEdit}
            className={`w-full border p-2 mt-2 ${
              isAddressEdit ? 'border-primary' : 'border-transparent'
            }`}
          />
        </div>
        <div className="lg:col-span-2">
        <PubImage />
        </div>
      </div>
      <Chatbox />
    </>
  );
}

export default Profile;
