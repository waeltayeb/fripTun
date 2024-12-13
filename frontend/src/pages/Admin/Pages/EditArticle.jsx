import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArchiveRestore, User } from "lucide-react";
import { GrRestroomWomen } from "react-icons/gr";
import DefaultLayout from "../Layout/DefaultLayout";
import { Link } from "react-router-dom";

function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletedImages, setDeletedImages] = useState([]);
  const [images, setImages] = useState([]);
  const [sold, setSold] = useState(false);
  const [recomended, setRecomended] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('men');
  const MEN_PLAN = "men";
  const WOMEN_PLAN = "women";
  
  const [formData, setFormData] = useState({
    title: '',
    size: '',
    brand: '',
    description: '',
    price: '',
    newPrice: '',
    gender: 'men',
    category: '',
    status: '',
    images: []
  });

  const [brands] = useState(["Adidas", "Nike", "Puma", "Reebok", "Under Armour"]);

  useEffect(() => {
    fetchArticleData();
  }, [id]);

  const fetchArticleData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/articles/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch article');
      }
      const data = await response.json();
      
      setFormData({
        title: data.title || '',
        size: data.size || '',
        brand: data.brand || '',
        description: data.description || '',
        price: data.price || '',
        newPrice: data.newPrice || '',
        gender: data.gender || 'men',
        isSold: data.isSold || false,
        isRecommended: data.isRecommended || false,
        images: data.images || []
      });

      setSelectedPlan(data.gender || 'men');
      setSold(data.isSold || false);
      setRecomended(data.isRecommended || false);
      
      // Set existing images with preview URLs
      if (data.images && data.images.length > 0) {
        setImages(data.images.map(url => ({
          preview: url,
          file: null
        })));
      }
    } catch (error) {
      console.error("Error fetching article:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: value
    }));
};

const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
};

const removeImage = (index) => {
    setImages((prevImages) => {
        const removedImage = prevImages[index];
        
        // If the image has a preview URL but no associated file, it's an existing image
        if (!removedImage.file) {
            setDeletedImages((prevDeleted) => [...prevDeleted, removedImage.preview]);
        }
        
        return prevImages.filter((_, i) => i !== index);
    });
};


const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const formDataToSend = new FormData();
        
        // Append text data
        formDataToSend.append('title', formData.title);
        formDataToSend.append('size', formData.size);
        formDataToSend.append('brand', formData.brand);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('gender', selectedPlan);
        formDataToSend.append('isSold', sold);
        formDataToSend.append('isRecommended', recomended);
        if (sold) {
            formDataToSend.append('newPrice', formData.newPrice);
        }

        // Append images
        images.forEach((image) => {
            if (image.file) {
                formDataToSend.append('images', image.file);
            }
        });

        // Append deleted images
        if (deletedImages.length > 0) {
            formDataToSend.append('removeImages', JSON.stringify(deletedImages));
        }

        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/articles/${id}`, {
            method: 'PUT',
            body: formDataToSend,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to update article');
        }

        setLoading(false);

        alert('Article updated successfully!');
        navigate('/listArticle');
    } catch (error) {
        console.error('Error updating article:', error);
        setError(error.message);
    }
};


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (error) return <div className="text-red-500"> Error: {error}</div>;

  return (
    <DefaultLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Edit Article</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6.5">
        <div className="mb-4.5">
                    <label className="mb-2.5 block text-black">
                        Title <span className="text-meta-1">*</span>
                    </label>
                    <input
                        required
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter title"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                    />
                </div>
          
                <div className="mb-4.5">
                    <label className="mb-2.5 block text-black">
                        Size <span className="text-meta-1">*</span>
                    </label>
                    <input
                        required
                        type="text"
                        name="size"
                        value={formData.size}
                        onChange={handleInputChange}
                        placeholder="Enter size 'XS, S, M, L, XL ..'"
                        maxLength={4}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                    />
                </div>

                <div className="mb-4.5">
                    <div className="flex flex-col md:flex-row gap-6 max-w-3xl mx-auto p-4">
                        {/* Men Plan */}
                        <div
                            className={`flex-1 p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg cursor-pointer ${selectedPlan === MEN_PLAN
                                    ? "border-[#9b87f5] bg-white"
                                    : "border-gray-200 bg-gray-50"
                                }`}
                            onClick={() => setSelectedPlan(MEN_PLAN)}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <User className="w-6 h-6 text-gray-600" />
                                    <h3 className="text-xl font-semibold text-gray-800">Men</h3>
                                </div>
                                <div className="relative w-5 h-5">
                                    <input
                                        type="radio"
                                        name="plan"
                                        checked={selectedPlan === MEN_PLAN}
                                        onChange={() => setSelectedPlan(MEN_PLAN)}
                                        className="appearance-none w-5 h-5 border-2 border-gray-300 rounded-sm checked:border-[#9b87f5] checked:bg-[#9b87f5] transition-all duration-200"
                                    />
                                    {selectedPlan === MEN_PLAN && (
                                        <svg
                                            className="absolute top-1 left-1 w-3 h-3 text-white pointer-events-none"
                                            fill="none"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M5 13l4 4L19 7"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Women Plan */}
                        <div
                            className={`flex-1 p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg cursor-pointer ${selectedPlan === WOMEN_PLAN
                                    ? "border-[#9b87f5] bg-white"
                                    : "border-gray-200 bg-gray-50"
                                }`}
                            onClick={() => setSelectedPlan(WOMEN_PLAN)}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <GrRestroomWomen className="w-6 h-6 text-[#9b87f5]" />
                                    <h3 className="text-xl font-semibold text-gray-800">Women</h3>
                                </div>
                                <div className="relative w-5 h-5">
                                    <input
                                        type="radio"
                                        name="plan"
                                        checked={selectedPlan === WOMEN_PLAN}
                                        onChange={() => setSelectedPlan(WOMEN_PLAN)}
                                        className="appearance-none w-5 h-5 border-2 border-gray-300 rounded-sm checked:border-[#9b87f5] checked:bg-[#9b87f5] transition-all duration-200"
                                    />
                                    {selectedPlan === WOMEN_PLAN && (
                                        <svg
                                            className="absolute top-1 left-1 w-3 h-3 text-white pointer-events-none"
                                            fill="none"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M5 13l4 4L19 7"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="mb-2.5 block text-black">
                        Brands <span className="text-meta-1">*</span>
                    </label>
                    <select 
                        required 
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter disabled:text-black">
                        <option value="">select brand</option>
                        {brands.map((brand, index) => (

                            <option key={index} value={brand}>{brand}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <label className="mb-2.5 block text-black">
                        Description <span className="text-meta-1">*</span>
                    </label>
                    <textarea
                        required
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={6}
                        placeholder="Enter description"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                    ></textarea>
                </div>

                <div className="mb-4.5">
                    <label className="mb-2.5 block text-black">
                        Prix <span className="text-meta-1">*</span>
                    </label>
                    <input
                        required
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="Enter price"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                    />
                </div>

                <div className="mb-4.5">
                    <div className="flex flex-col md:flex-row gap-6 max-w-3xl mx-auto p-4">
                        {/*  */}
                        <div
                            className={`flex-1 p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg cursor-pointer ${sold === true
                                    ? "border-[#9b87f5] bg-white"
                                    : "border-gray-200 bg-gray-50"
                                }`}
                            onClick={() => setSold(!sold)}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">

                                    <img src='/assets/images/sold.svg' className="w-10 h-10 text-gray-600" />
                                    <h3 className="text-xl font-semibold text-gray-800"> SOLD</h3>
                                </div>
                                <div className="relative w-5 h-5">
                                    <input
                                        type="checkbox"
                                        name="sold"
                                        checked={sold === true}
                                        onChange={() => (setSold(!sold))}
                                        className="appearance-none w-5 h-5 border-2 border-gray-300 rounded-sm checked:border-[#9b87f5] checked:bg-[#9b87f5] transition-all duration-200"
                                    />
                                    {selectedPlan === MEN_PLAN && (
                                        <svg
                                            className="absolute top-1 left-1 w-3 h-3 text-white pointer-events-none"
                                            fill="none"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M5 13l4 4L19 7"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    )}
                                </div>
                            </div>

                        </div>



                    </div>
                </div>

                {sold && (
                    <div className="mb-4.5">
                    <label className="mb-2.5 block text-black">
                        New Prix <span className="text-meta-1">*</span>
                    </label>
                    <input
                        required
                        type="number"
                        name="newPrice"
                        value={formData.newPrice}
                        onChange={handleInputChange}
                        placeholder="Enter New price"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                    />
                </div>
                )}



                <div className="mb-6">
                    <label className="mb-2.5 block text-black">
                        Images <span className="text-meta-1">*</span>
                    </label>
                    <div
                        id="FileUpload"
                        className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 sm:py-7.5"
                    >
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                        />
                        <div className="flex flex-col items-center justify-center space-y-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white">
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
                                        d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                                        fill="#3C50E0"
                                    />
                                </svg>
                            </span>
                            <p>
                                <span className="text-primary">Click to upload</span> or drag and
                                drop
                            </p>
                            <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                            <p>(max, 800 X 800px)</p>
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="flex flex-wrap gap-4">
                        {images.map((image, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={image.preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-24 h-24 rounded border"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
 
                <div className="mb-4.5">
                    <div className="flex flex-col md:flex-row gap-6 max-w-3xl mx-auto p-4">
                        {/*  */}
                        <div
                            className={`flex-1 p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg cursor-pointer ${recomended === true
                                    ? "border-[#9b87f5] bg-white"
                                    : "border-gray-200 bg-gray-50"
                                }`}
                            onClick={() => setRecomended(!recomended)}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">

                                    <ArchiveRestore className="w-6 h-6 text-gray-600" />
                                    <h3 className="text-xl font-semibold text-gray-800"> recommended</h3>
                                </div>
                                <div className="relative w-5 h-5">
                                    <input
                                        type="checkbox"
                                        name="recommended"
                                        checked={recomended === true}
                                        onChange={() => (setRecomended(!recomended))}
                                        className="appearance-none w-5 h-5 border-2 border-gray-300 rounded-sm checked:border-[#9b87f5] checked:bg-[#9b87f5] transition-all duration-200"
                                    />
                                    {selectedPlan === MEN_PLAN && (
                                        <svg
                                            className="absolute top-1 left-1 w-3 h-3 text-white pointer-events-none"
                                            fill="none"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M5 13l4 4L19 7"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    )}
                                </div>
                            </div>

                        </div>



                    </div>
                </div>


          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Update Article
            </button>
            <Link
              to="/ListArticle"
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </Link>
          </div>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
}

export default EditArticle;
