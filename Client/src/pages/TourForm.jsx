import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaArrowLeft, FaUpload, FaPlus, FaTrash } from "react-icons/fa";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

const TourForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Form states
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [maxGroupSize, setMaxGroupSize] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [price, setPrice] = useState("");
  const [priceDiscount, setPriceDiscount] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [startDates, setStartDates] = useState([]);
  const [newDate, setNewDate] = useState("");

  // Start Location
  const [startAddress, setStartAddress] = useState("");
  const [startDesc, setStartDesc] = useState("");
  const [startLat, setStartLat] = useState("");
  const [startLng, setStartLng] = useState("");

  // Image Upload States
  const [imageCover, setImageCover] = useState(null);
  const [images, setImages] = useState([]);
  const [coverPreview, setCoverPreview] = useState("");
  const [imagesPreviews, setImagesPreviews] = useState([]);

  // Fetch tour data if editing
  const fetchTour = async () => {
    const res = await fetch(`${BASE_URL}/api/v1/tours/${id}`, {
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load tour details");
    return data?.data?.data;
  };

  const { data: tourData, isLoading, error } = useQuery({
    queryKey: ["admin-tour-form", id],
    queryFn: fetchTour,
    enabled: isEditMode,
  });

  // Populate form with existing data when editing
  useEffect(() => {
    if (isEditMode && tourData) {
      setName(tourData.name || "");
      setDuration(tourData.duration || "");
      setMaxGroupSize(tourData.maxGroupSize || "");
      setDifficulty(tourData.difficulty || "easy");
      setPrice(tourData.price || "");
      setPriceDiscount(tourData.priceDiscount || "");
      setSummary(tourData.summary || "");
      setDescription(tourData.description || "");

      // Start dates
      if (tourData.startDates) {
        const dates = tourData.startDates.map((d) => d.split("T")[0]);
        setStartDates(dates);
      }

      // Location details
      if (tourData.startLocation) {
        setStartAddress(tourData.startLocation.address || "");
        setStartDesc(tourData.startLocation.description || "");
        if (tourData.startLocation.coordinates) {
          setStartLng(tourData.startLocation.coordinates[0] || "");
          setStartLat(tourData.startLocation.coordinates[1] || "");
        }
      }

      // Image previews from existing paths
      if (tourData.imageCover) {
        setCoverPreview(`${BASE_URL}/public/img/tours/${tourData.imageCover}`);
      }
      if (tourData.images) {
        setImagesPreviews(
          tourData.images.map((img) => `${BASE_URL}/public/img/tours/${img}`)
        );
      }
    }
  }, [tourData, isEditMode]);

  // Date handlers
  const handleAddDate = () => {
    if (!newDate) return;
    if (startDates.includes(newDate)) {
      toast.warning("This date is already added");
      return;
    }
    setStartDates([...startDates, newDate]);
    setNewDate("");
  };

  const handleRemoveDate = (indexToRemove) => {
    setStartDates(startDates.filter((_, index) => index !== indexToRemove));
  };

  // Image Upload Handlers
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageCover(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3); // Max 3 images
    setImages(files);
    setImagesPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  // Mutation to save (Create/Update)
  const saveTour = async (formData) => {
    const url = isEditMode
      ? `${BASE_URL}/api/v1/tours/${id}`
      : `${BASE_URL}/api/v1/tours/`;
    const method = isEditMode ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      body: formData,
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to save tour");
    return data;
  };

  const mutation = useMutation({
    mutationFn: saveTour,
    onSuccess: () => {
      toast.success(
        isEditMode ? "Tour updated successfully" : "Tour created successfully"
      );
      queryClient.invalidateQueries({ queryKey: ["admin-tours"] });
      queryClient.invalidateQueries({ queryKey: ["home"] });
      navigate("/account/manage-tours");
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (name.length < 10 || name.length > 40) {
      toast.error("Tour name must be between 10 and 40 characters.");
      return;
    }
    if (priceDiscount && Number(priceDiscount) >= Number(price)) {
      toast.error("Discount price must be lower than the regular price.");
      return;
    }
    if (!isEditMode && !imageCover) {
      toast.error("Please upload a cover image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("duration", duration);
    formData.append("maxGroupSize", maxGroupSize);
    formData.append("difficulty", difficulty);
    formData.append("price", price);
    if (priceDiscount) formData.append("priceDiscount", priceDiscount);
    formData.append("summary", summary);
    formData.append("description", description);

    // Append dates
    startDates.forEach((date) => {
      formData.append("startDates", date);
    });

    // Start location coordinates and details
    if (startAddress || startDesc || startLat || startLng) {
      const coordinates = [
        startLng ? parseFloat(startLng) : 0,
        startLat ? parseFloat(startLat) : 0,
      ];
      formData.append("startLocation[address]", startAddress);
      formData.append("startLocation[description]", startDesc);
      formData.append("startLocation[coordinates][0]", coordinates[0]);
      formData.append("startLocation[coordinates][1]", coordinates[1]);
    }

    // Files
    if (imageCover) {
      formData.append("imageCover", imageCover);
    }
    if (images.length > 0) {
      images.forEach((img) => {
        formData.append("images", img);
      });
    }

    mutation.mutate(formData);
  };

  if (isEditMode && isLoading) return <Spinner />;

  if (isEditMode && error) {
    return (
      <div className="p-8 text-red-500 font-bold">
        Error loading tour details: {error.message}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header Navigation */}
      <button
        onClick={() => navigate("/account/manage-tours")}
        className="flex items-center gap-2 text-teal-700 hover:text-teal-900 font-semibold mb-6 transition-colors"
      >
        <FaArrowLeft /> Back to Manage Tours
      </button>

      <div className="bg-white rounded-2xl shadow-lg border p-8">
        <h2 className="text-3xl font-bold text-teal-800 mb-8 border-b pb-4">
          {isEditMode ? "Edit Tour Details ✏️" : "Create New Tour 🎒"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Info */}
          <div>
            <h3 className="text-lg font-bold text-teal-700 mb-4">1. Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Tour Name (10 - 40 chars) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. The Forest Adventurer"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Difficulty *
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="difficult">Difficult</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Duration (Days) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 5"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Max Group Size *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={maxGroupSize}
                  onChange={(e) => setMaxGroupSize(e.target.value)}
                  placeholder="e.g. 15"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Price ($) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 497"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Discount Price ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={priceDiscount}
                  onChange={(e) => setPriceDiscount(e.target.value)}
                  placeholder="e.g. 397 (must be less than price)"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>
          </div>

          <hr />

          {/* Section 2: Summary & Description */}
          <div>
            <h3 className="text-lg font-bold text-teal-700 mb-4">2. Tour Details & Summary</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Summary *
                </label>
                <input
                  type="text"
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Short summary displayed on cards..."
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed tour itinerary and overview..."
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>
          </div>

          <hr />

          {/* Section 3: Location Details */}
          <div>
            <h3 className="text-lg font-bold text-teal-700 mb-4">3. Start Location (Geospatial)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Address (Name of Town/State)
                </label>
                <input
                  type="text"
                  value={startAddress}
                  onChange={(e) => setStartAddress(e.target.value)}
                  placeholder="e.g. Yosemite Valley, USA"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Location Description
                </label>
                <input
                  type="text"
                  value={startDesc}
                  onChange={(e) => setStartDesc(e.target.value)}
                  placeholder="e.g. Yosemite National Park"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Latitude (-90 to 90)
                </label>
                <input
                  type="number"
                  step="0.000001"
                  value={startLat}
                  onChange={(e) => setStartLat(e.target.value)}
                  placeholder="e.g. 37.74557"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Longitude (-180 to 180)
                </label>
                <input
                  type="number"
                  step="0.000001"
                  value={startLng}
                  onChange={(e) => setStartLng(e.target.value)}
                  placeholder="e.g. -119.5332"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>
          </div>

          <hr />

          {/* Section 4: Start Dates */}
          <div>
            <h3 className="text-lg font-bold text-teal-700 mb-4">4. Start Dates</h3>
            <div className="flex gap-4 mb-4">
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
              <button
                type="button"
                onClick={handleAddDate}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-semibold shadow"
              >
                <FaPlus /> Add Date
              </button>
            </div>

            {startDates.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No start dates added yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {startDates.map((date, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-800 px-3 py-1.5 rounded-full text-sm font-semibold"
                  >
                    <span>{date}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDate(index)}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <FaTrash className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <hr />

          {/* Section 5: Media Files */}
          <div>
            <h3 className="text-lg font-bold text-teal-700 mb-4">5. Tour Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Cover Photo */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Cover Image (JPEG/PNG) *
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 border rounded-lg cursor-pointer text-sm font-semibold text-slate-700 transition-colors">
                    <FaUpload /> Upload Cover
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className="hidden"
                    />
                  </label>
                  {coverPreview && (
                    <img
                      src={coverPreview}
                      alt="Cover Preview"
                      className="w-20 h-20 object-cover rounded-lg border shadow-sm"
                    />
                  )}
                </div>
              </div>

              {/* Gallery Photos */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Gallery Images (Upload up to 3)
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 border rounded-lg cursor-pointer text-sm font-semibold text-slate-700 transition-colors">
                    <FaUpload /> Upload Gallery
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImagesChange}
                      className="hidden"
                    />
                  </label>
                  <div className="flex gap-2">
                    {imagesPreviews.map((preview, index) => (
                      <img
                        key={index}
                        src={preview}
                        alt={`Gallery Preview ${index + 1}`}
                        className="w-12 h-12 object-cover rounded-lg border shadow-sm"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 border-t pt-6 mt-8">
            <button
              type="button"
              onClick={() => navigate("/account/manage-tours")}
              className="px-6 py-2 border rounded-lg text-gray-700 font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-6 py-2 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-800 shadow transition-colors disabled:bg-teal-400"
            >
              {mutation.isPending ? "Saving..." : isEditMode ? "Save Changes" : "Create Tour"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TourForm;
