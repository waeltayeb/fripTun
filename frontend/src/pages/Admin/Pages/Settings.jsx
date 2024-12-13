import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DefaultLayout from '../Layout/DefaultLayout';
import axios from 'axios';
import { toast } from 'react-toastify';

function Settings() {
  const [isPersonalEdit, setIsPersonalEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [personalData, setPersonalData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [pubPreview, setPubPreview] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [pubFile, setPubFile] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/user/profile');
      setPersonalData({
        username: response.data.username,
        email: response.data.email,
        password: ''
      });
    } catch (error) {
      toast.error('Failed to fetch user data');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 800 * 800) {
      toast.error('Image size too large. Max size is 800x800px');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'banner') {
        setBannerPreview(reader.result);
        setBannerFile(file);
      } else {
        setPubPreview(reader.result);
        setPubFile(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProfileUpdate = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('username', personalData.username);
      formData.append('email', personalData.email);
      if (personalData.password) {
        formData.append('password', personalData.password);
      }

      await axios.put('/api/user/profile', formData);
      toast.success('Profile updated successfully');
      setIsPersonalEdit(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (type) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      if (type === 'banner') {
        formData.append('image', bannerFile);
        await axios.put('/api/settings/banner', formData);
      } else {
        formData.append('image', pubFile);
        await axios.put('/api/settings/pub', formData);
      }
      toast.success(`${type} image updated successfully`);
    } catch (error) {
      toast.error(`Failed to update ${type} image`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DefaultLayout>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black ">
          Settings
        </h2>

        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <Link className="font-medium" to="/">
                Dashboard /
              </Link>
            </li>
            <li className="font-medium text-primary">Settings</li>
          </ol>
        </nav>
      </div>
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="col-span-2">
          {/* Personal Profile Section */}
          <div className="block border mb-6 border-stroke bg-white shadow-default p-6">
            <h2 className="flex justify-between text-title-md2 font-semibold text-black">
              Personal Profile
              <button
                className={`text-primary text-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={isPersonalEdit ? handleProfileUpdate : () => setIsPersonalEdit(true)}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : isPersonalEdit ? 'Save' : 'Edit'}
              </button>
            </h2>

            <input
              type="text"
              name="username"
              value={personalData.username}
              onChange={handleInputChange}
              disabled={!isPersonalEdit}
              className={`w-full border p-2 mt-2 ${
                isPersonalEdit ? 'border-primary' : 'border-transparent'
              }`}
              placeholder="Username"
            />

            <input
              type="email"
              name="email"
              value={personalData.email}
              onChange={handleInputChange}
              disabled={!isPersonalEdit}
              className={`w-full border p-2 mt-2 ${
                isPersonalEdit ? 'border-primary' : 'border-transparent'
              }`}
              placeholder="Email"
            />

            <div className="relative w-full mt-2">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={personalData.password}
                onChange={handleInputChange}
                disabled={!isPersonalEdit}
                className={`w-full border p-2 ${
                  isPersonalEdit ? "border-primary" : "border-transparent"
                }`}
                placeholder="Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.354 1.212-1.39 2.936-3.086 4.286M12 19c-4.477 0-8.268-2.943-9.542-7"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.971 0-9-4.03-9-9 0-1.286.263-2.515.737-3.63M4.242 19.758A9.961 9.961 0 013 12c0-.657.069-1.302.201-1.924M21 12c0 .657-.069 1.302-.201 1.924m-1.353 2.33a9.962 9.962 0 01-1.686 2.198M9.09 9.112c.293-.58.725-1.02 1.216-1.306m4.42 4.594c.173-.492.442-.934.786-1.316m1.9-1.654c.15-.314.32-.612.508-.89m-1.605 7.714c-.22-.502-.396-1.03-.523-1.576"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-9">
          {/* <!-- add new article Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default ">
            <div className="border-b border-stroke py-4 px-6.5 ">
              <h3 className="font-medium text-black ">
                Change Image Banner
              </h3>
            </div>
            <div className="p-6.5">

              <div className="w-full">
                <h3 className="font-medium text-black ">
                  Current Banner Image
                </h3>
                <img 
                  src={bannerPreview || "assets/images/banner-bg.jpg"} 
                  alt="banner" 
                  className="max-w-full h-auto"
                />
              </div>
              <div
                className="relative mt-5 mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'banner')}
                  className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                  disabled={isLoading}
                />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white ">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                        fill="#3C50E0"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                        fill="#3C50E0"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                        fill="#3C50E0"
                      />
                    </svg>
                  </span>
                  <p>
                    <span className="text-primary">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                  <p>(max, 800 X 800px)</p>
                </div>
              </div>

              {bannerFile && (
                <button
                  onClick={() => handleImageUpload('banner')}
                  className="bg-primary text-white px-4 py-2 rounded-md mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? 'Uploading...' : 'Upload Banner'}
                </button>
              )}
            </div>

          </div>
        </div>

        <div className="flex flex-col gap-9">

          <div className="rounded-sm border  bg-white shadow-default border-strokedark ">
            <div className="border-b border-stroke py-4 px-6.5 ">
              <h3 className="font-medium text-black ">
                Change Image pub
              </h3>
            </div>
            <div className="p-6.5">

              <div className="w-full">
                <h3 className="font-medium text-black ">
                  Current Pub Image
                </h3>
                <img 
                  src={pubPreview || "assets/images/offer.jpg"} 
                  alt="pub" 
                  className="max-w-full h-auto"
                />
              </div>
              <div
                className="relative mt-5 mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'pub')}
                  className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                  disabled={isLoading}
                />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white ">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                        fill="#3C50E0"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                        fill="#3C50E0"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                        fill="#3C50E0"
                      />
                    </svg>
                  </span>
                  <p>
                    <span className="text-primary">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                  <p>(max, 800 X 800px)</p>
                </div>
              </div>

              {pubFile && (
                <button
                  onClick={() => handleImageUpload('pub')}
                  className="bg-primary text-white px-4 py-2 rounded-md mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? 'Uploading...' : 'Upload Pub Image'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

    </DefaultLayout>
  );
}

export default Settings;
