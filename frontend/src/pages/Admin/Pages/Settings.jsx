import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DefaultLayout from '../Layout/DefaultLayout';
import axios from 'axios';
import { toast } from 'react-toastify';

function Settings() {

  const [isLoading, setIsLoading] = useState(false);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [pubPreview, setPubPreview] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [pubFile, setPubFile] = useState(null);
  const [brands, setBrands] = useState([]);
  const [newBrand, setNewBrand] = useState({ name: '', image: null });
  const [brandImagePreview, setBrandImagePreview] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const [bannerRes, pubRes] = await Promise.all([
          axios.get('http://localhost:5000/api/settings/banner'),
          axios.get('http://localhost:5000/api/settings/pub')
        ]);

        if (bannerRes.data.imageUrl) {
          setBannerPreview(bannerRes.data.imageUrl);
        }
        if (pubRes.data.imageUrl) {
          setPubPreview(pubRes.data.imageUrl);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        toast.error('Failed to load images');
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/settings/brands');
        setBrands(response.data);
      } catch (error) {
        console.error('Error fetching brands:', error);
        toast.error('Failed to load brands');
      }
    };

    fetchBrands();
  }, []);

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

  const handleImageUpload = async (type) => {
    try {
      if (type === 'banner' && !bannerFile) {
        toast.error('Please select a banner image before uploading.');
        return;
      }

      if (type === 'pub' && !pubFile) {
        toast.error('Please select a pub image before uploading.');
        return;
      }

      setIsLoading(true);
      const formData = new FormData();

      if (type === 'banner') {
        formData.append('image', bannerFile);
        await axios.put('http://localhost:5000/api/settings/banner', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        formData.append('image', pubFile);
        await axios.put('http://localhost:5000/api/settings/pub', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      toast.success(`${type} image updated successfully`);
      // Reset the file states
      if (type === 'banner') {
        setBannerFile(null);
        setBannerPreview(null);
      } else {
        setPubFile(null);
        setPubPreview(null);
      }

      // Reload the page after a short delay to show the success message
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error(`Failed to update ${type} image: ${error.response?.data?.message || 'Server error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBrandImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, and SVG files are allowed');
      return;
    }

    // Check file size (2MB = 2 * 1024 * 1024 bytes)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size too large. Max size is 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setBrandImagePreview(reader.result);
      setNewBrand(prev => ({ ...prev, image: file }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddBrand = async (e) => {
    e.preventDefault();
    if (!newBrand.name.trim() || !newBrand.image) {
      toast.error('Please provide both brand name and image');
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('name', newBrand.name.trim());
      formData.append('image', newBrand.image);

      const { data } = await axios.post('http://localhost:5000/api/settings/brands', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success(data.message || 'Brand added successfully');
      setNewBrand({ name: '', image: null });
      setBrandImagePreview(null);
      
      // Refresh brands list
      const response = await axios.get('http://localhost:5000/api/settings/brands');
      setBrands(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add brand';
      toast.error(errorMessage);
      setMessage(errorMessage);
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
                  {isLoading ? 'Uploading...' : 'Upload Pub'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-9">
          <div className="rounded-sm border bg-white shadow-default border-strokedark">
            <div className="border-b border-stroke py-4 px-6.5">
              <h3 className="font-medium text-black">
                Add New Brand 
              </h3>
              {message && (
                <div
                  className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700"
                  role="alert"
                >
                  <p>{message}</p>
                </div>
              )}
            </div>
            <div className="p-6.5">
              <div className="w-full">
                <h3 className="font-medium text-black mb-4">
                  Current Brands
                </h3>
                <div className="space-y-2 mb-6">
                  <select 
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary"
                  >
                    <option value="">Select a brand</option>
                    {brands.map((brand) => (
                      <option key={brand._id} value={brand._id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='mt-8'>
                  <h3 className="font-medium text-black mb-4">
                    Add New Brand
                  </h3>
                  <form onSubmit={handleAddBrand} className="space-y-4">
                    <input
                      type="text"
                      value={newBrand.name}
                      onChange={(e) => setNewBrand(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Brand Name"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary"
                    />
                    
                    <div className="relative mt-2 mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBrandImageChange}
                        className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                        disabled={isLoading}
                      />
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z" fill="#3C50E0"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z" fill="#3C50E0"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z" fill="#3C50E0"/>
                          </svg>
                        </span>
                        <p>
                          <span className="text-primary">Click to upload</span> or drag and drop
                        </p>
                        <p className="mt-1.5">SVG, PNG, JPG </p>
                        <p>(max, 150 X 150px)</p>
                      </div>
                    </div>

                    {brandImagePreview && (
                      <div className="mt-4">
                        <img
                          src={brandImagePreview}
                          alt="Brand preview"
                          className="max-w-[200px] h-auto rounded-lg"
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white"
                    >
                      {isLoading ? 'Adding Brand...' : 'Add Brand'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </DefaultLayout>
  );
}

export default Settings;
