"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Camera,
  Save,
  AlertCircle,
  CheckCircle,
  Loader2,
  Lock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
} from "lucide-react";
import Navigation from "@/components/Navigation";

export default function ProfileEditPage() {
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState({});
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [imagePreview, setImagePreview] = useState("");
  const [completionDetails, setCompletionDetails] = useState({
    missingFields: [],
    completedFields: [],
  });

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    profileImage: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
    },
    preferences: {
      categories: [],
      brands: [],
      priceRange: { min: 0, max: 1000 },
      sizes: [],
      colors: [],
    },
  });

  const categories = [
    "Clothing",
    "Shoes",
    "Accessories",
    "Bags",
    "Jewelry",
    "Watches",
    "Sportswear",
    "Formal Wear",
    "Casual Wear",
    "Denim",
    "Outerwear",
  ];

  const brands = [
    "Nike",
    "Adidas",
    "Zara",
    "H&M",
    "Uniqlo",
    "Gap",
    "Levi's",
    "Tommy Hilfiger",
    "Calvin Klein",
    "Puma",
    "Reebok",
    "Forever 21",
  ];

  const sizes = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "28",
    "30",
    "32",
    "34",
    "36",
    "38",
  ];
  const colors = [
    "Black",
    "White",
    "Blue",
    "Red",
    "Green",
    "Yellow",
    "Pink",
    "Purple",
    "Gray",
    "Brown",
  ];
  const genderOptions = ["male", "female", "other", "prefer-not-to-say"];

  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile();
      fetchProfileCompletion();
    }
  }, [status]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user/profile");
      const data = await response.json();

      if (data.success) {
        setProfileData(data.user);
        setFormData({
          name: data.user.name || "",
          firstName: data.user.firstName || "",
          lastName: data.user.lastName || "",
          phone: data.user.phone || "",
          dateOfBirth: data.user.dateOfBirth
            ? new Date(data.user.dateOfBirth).toISOString().split("T")[0]
            : "",
          gender: data.user.gender || "",
          profileImage: data.user.profileImage || "",
          address: {
            street: data.user.address?.street || "",
            city: data.user.address?.city || "",
            state: data.user.address?.state || "",
            zipCode: data.user.address?.zipCode || "",
            country: data.user.address?.country || "US",
          },
          preferences: {
            categories: data.user.preferences?.categories || [],
            brands: data.user.preferences?.brands || [],
            priceRange: data.user.preferences?.priceRange || {
              min: 0,
              max: 1000,
            },
            sizes: data.user.preferences?.sizes || [],
            colors: data.user.preferences?.colors || [],
          },
        });
        setImagePreview(data.user.profileImage || "");
        setProfileCompletion(data.profileCompleteness || 0);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage({ type: "error", text: "Failed to load profile data" });
    } finally {
      setLoading(false);
    }
  };

  const fetchProfileCompletion = async () => {
    try {
      const response = await fetch("/api/user/profile-completion");
      const data = await response.json();

      if (data.success) {
        setProfileCompletion(data.profileCompleteness);
        setCompletionDetails({
          missingFields: data.missingFields,
          completedFields: data.completedFields,
        });
      }
    } catch (error) {
      console.error("Error fetching profile completion:", error);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleArrayChange = (field, value, isChecked) => {
    const [parent, child] = field.split(".");
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: isChecked
          ? [...prev[parent][child], value]
          : prev[parent][child].filter((item) => item !== value),
      },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you'd upload to a service like Cloudinary
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setProfileCompletion(data.user.profileCompleteness);
        fetchProfileCompletion(); // Refresh completion details

        // Auto-hide success message
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to update profile",
        });
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage({ type: "error", text: "Failed to save profile" });
    } finally {
      setSaving(false);
    }
  };

  const MinimalDoodles = () => (
    <div className="fixed inset-0 pointer-events-none opacity-5 z-0">
      <div className="absolute top-20 left-10 w-8 h-8 border border-stone-400 rotate-45"></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-stone-300 rounded-full"></div>
      <div className="absolute top-60 left-1/4 w-12 h-1 bg-stone-400"></div>
      <div className="absolute bottom-40 right-10 w-10 h-10 border border-stone-400 rounded-full"></div>
      <div className="absolute bottom-60 left-20 w-16 h-1 bg-stone-300"></div>
    </div>
  );

  const ProgressBar = ({ percentage }) => (
    <div className="w-full bg-stone-800 h-2 overflow-hidden">
      <div
        className="h-full bg-stone-300 transition-all duration-1000 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );

  // Custom Radio Button Component
  const RadioButton = ({ name, value, checked, onChange, children }) => (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div
          className={`w-5 h-5 border-2 rounded-full transition-all duration-300 ${
            checked
              ? "border-stone-400 bg-stone-400"
              : "border-stone-600 bg-transparent group-hover:border-stone-500"
          }`}
        >
          {checked && (
            <div className="w-2 h-2 bg-black rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          )}
        </div>
      </div>
      <span className="text-stone-300 font-light group-hover:text-stone-200 transition-colors">
        {children}
      </span>
    </label>
  );

  // Custom Checkbox Component
  const CheckboxButton = ({ checked, onChange, children }) => (
    <label className="flex items-center gap-3 cursor-pointer group p-3 bg-stone-900/30 border border-stone-800 hover:border-stone-600 transition-all duration-300 hover:bg-stone-900/50">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div
          className={`w-5 h-5 border-2 transition-all duration-300 ${
            checked
              ? "border-stone-400 bg-stone-400"
              : "border-stone-600 bg-transparent group-hover:border-stone-500"
          }`}
        >
          {checked && (
            <svg
              className="w-3 h-3 text-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
      <span className="text-stone-300 font-light group-hover:text-stone-200 transition-colors text-sm">
        {children}
      </span>
    </label>
  );

  // Custom Range Slider Component
  const RangeSlider = ({ min, max, step, value, onChange, label }) => (
    <div className="space-y-2">
      <label className="block text-xs font-light text-stone-400 uppercase tracking-wider">
        {label}: ₹{value}
      </label>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer slider"
        />
        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #d6d3d1;
            cursor: pointer;
            border: 2px solid #000;
            box-shadow: 0 0 0 1px #d6d3d1;
          }

          .slider::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #d6d3d1;
            cursor: pointer;
            border: 2px solid #000;
            box-shadow: 0 0 0 1px #d6d3d1;
          }

          .slider::-webkit-slider-track {
            height: 8px;
            background: #292524;
            border-radius: 4px;
          }

          .slider::-moz-range-track {
            height: 8px;
            background: #292524;
            border-radius: 4px;
            border: none;
          }
        `}</style>
      </div>
    </div>
  );

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="flex items-center justify-center h-[70vh]">
          <div className="flex items-center gap-3 text-stone-400">
            <Loader2 className="animate-spin" size={20} />
            <p className="font-light">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center text-stone-400">
            <Lock size={48} className="mx-auto mb-4 opacity-50" />
            <p className="font-light">Please sign in to edit your profile</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-stone-100 relative">
      <MinimalDoodles />
      <Navigation />

      {/* Header */}
      <div className="relative z-10 pt-12 pb-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-light mb-3 text-stone-200 tracking-wider">
              PROFILE
            </h1>
            <div className="w-24 h-px bg-stone-500 mx-auto mb-4"></div>
            <p className="text-stone-400 text-sm font-light tracking-wide uppercase">
              Complete your profile to unlock posting
            </p>
          </div>

          {/* Profile Completion */}
          <div className="mb-12 bg-stone-900/50 border border-stone-800 p-6 rounded-none">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-light text-stone-200">
                Profile Completion
              </h2>
              <span className="text-2xl font-light text-stone-300">
                {profileCompletion}%
              </span>
            </div>
            <ProgressBar percentage={profileCompletion} />
            <div className="mt-4 flex items-center gap-2 text-sm">
              {profileCompletion >= 50 ? (
                <CheckCircle size={16} className="text-green-400" />
              ) : (
                <AlertCircle size={16} className="text-yellow-400" />
              )}
              <span className="text-stone-400 font-light">
                {profileCompletion >= 50
                  ? "You can create posts!"
                  : `${50 - profileCompletion}% more to unlock posting`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className="relative z-10 max-w-4xl mx-auto px-6 mb-6">
          <div
            className={`p-4 border rounded-none ${
              message.type === "success"
                ? "border-green-800 bg-green-900/20 text-green-300"
                : "border-red-800 bg-red-900/20 text-red-300"
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === "success" ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              <span className="font-light">{message.text}</span>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-20">
        <div className="grid gap-8">
          {/* Profile Picture */}
          <Card className="bg-stone-900/50 border-stone-800 rounded-none">
            <CardContent className="p-6">
              <h3 className="text-lg font-light text-stone-200 mb-6 flex items-center gap-2">
                <Camera size={20} />
                Profile Picture
              </h3>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-stone-800 border border-stone-700 overflow-hidden rounded-none">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User size={32} className="text-stone-600" />
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="profileImage"
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-stone-700 border border-stone-600 flex items-center justify-center cursor-pointer hover:bg-stone-600 transition-colors rounded-none"
                  >
                    <Camera size={14} />
                  </label>
                </div>
                <div className="text-stone-400 text-sm font-light">
                  <p>Upload a profile picture</p>
                  <p className="text-stone-600">JPG, PNG up to 5MB</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card className="bg-stone-900/50 border-stone-800 rounded-none">
            <CardContent className="p-6">
              <h3 className="text-lg font-light text-stone-200 mb-6 flex items-center gap-2">
                <User size={20} />
                Basic Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-light text-stone-400 mb-2 uppercase tracking-wider">
                    Full Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="bg-transparent border-stone-700 text-stone-200 focus:border-stone-500 rounded-none"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-light text-stone-400 mb-2 uppercase tracking-wider">
                    First Name
                  </label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className="bg-transparent border-stone-700 text-stone-200 focus:border-stone-500 rounded-none"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-light text-stone-400 mb-2 uppercase tracking-wider">
                    Last Name
                  </label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className="bg-transparent border-stone-700 text-stone-200 focus:border-stone-500 rounded-none"
                    placeholder="Last name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-light text-stone-400 mb-3 uppercase tracking-wider">
                    Gender
                  </label>
                  <div className="space-y-3">
                    {genderOptions.map((option) => (
                      <RadioButton
                        key={option}
                        name="gender"
                        value={option}
                        checked={formData.gender === option}
                        onChange={(e) =>
                          handleInputChange("gender", e.target.value)
                        }
                      >
                        {option === "male"
                          ? "Male"
                          : option === "female"
                          ? "Female"
                          : option === "other"
                          ? "Other"
                          : "Prefer not to say"}
                      </RadioButton>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-stone-900/50 border-stone-800 rounded-none">
            <CardContent className="p-6">
              <h3 className="text-lg font-light text-stone-200 mb-6 flex items-center gap-2">
                <Phone size={20} />
                Contact Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-light text-stone-400 mb-2 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="bg-transparent border-stone-700 text-stone-200 focus:border-stone-500 rounded-none"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-xs font-light text-stone-400 mb-2 uppercase tracking-wider">
                    Date of Birth
                  </label>
                  <Input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    className="bg-transparent border-stone-700 text-stone-200 focus:border-stone-500 rounded-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card className="bg-stone-900/50 border-stone-800 rounded-none">
            <CardContent className="p-6">
              <h3 className="text-lg font-light text-stone-200 mb-6 flex items-center gap-2">
                <MapPin size={20} />
                Address
              </h3>
              <div className="grid gap-6">
                <div>
                  <label className="block text-xs font-light text-stone-400 mb-2 uppercase tracking-wider">
                    Street Address
                  </label>
                  <Input
                    value={formData.address.street}
                    onChange={(e) =>
                      handleInputChange("address.street", e.target.value)
                    }
                    className="bg-transparent border-stone-700 text-stone-200 focus:border-stone-500 rounded-none"
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-light text-stone-400 mb-2 uppercase tracking-wider">
                      City
                    </label>
                    <Input
                      value={formData.address.city}
                      onChange={(e) =>
                        handleInputChange("address.city", e.target.value)
                      }
                      className="bg-transparent border-stone-700 text-stone-200 focus:border-stone-500 rounded-none"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-light text-stone-400 mb-2 uppercase tracking-wider">
                      State
                    </label>
                    <Input
                      value={formData.address.state}
                      onChange={(e) =>
                        handleInputChange("address.state", e.target.value)
                      }
                      className="bg-transparent border-stone-700 text-stone-200 focus:border-stone-500 rounded-none"
                      placeholder="NY"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="bg-stone-900/50 border-stone-800 rounded-none">
            <CardContent className="p-6">
              <h3 className="text-lg font-light text-stone-200 mb-6 flex items-center gap-2">
                <Heart size={20} />
                Style Preferences
              </h3>

              {/* Categories */}
              <div className="mb-8">
                <label className="block text-xs font-light text-stone-400 mb-4 uppercase tracking-wider">
                  Favorite Categories
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((category) => (
                    <CheckboxButton
                      key={category}
                      checked={formData.preferences.categories.includes(
                        category
                      )}
                      onChange={(e) =>
                        handleArrayChange(
                          "preferences.categories",
                          category,
                          e.target.checked
                        )
                      }
                    >
                      {category}
                    </CheckboxButton>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <RangeSlider
                    min="0"
                    max="5000"
                    step="100"
                    value={formData.preferences.priceRange.min}
                    onChange={(e) =>
                      handleInputChange(
                        "preferences.priceRange.min",
                        parseInt(e.target.value)
                      )
                    }
                    label="Minimum Price"
                  />
                  <RangeSlider
                    min="100"
                    max="10000"
                    step="100"
                    value={formData.preferences.priceRange.max}
                    onChange={(e) =>
                      handleInputChange(
                        "preferences.priceRange.max",
                        parseInt(e.target.value)
                      )
                    }
                    label="Maximum Price"
                  />
                </div>
              </div>

              {/* Sizes */}
              <div className="mb-8">
                <label className="block text-xs font-light text-stone-400 mb-4 uppercase tracking-wider">
                  Sizes
                </label>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                  {sizes.map((size) => (
                    <CheckboxButton
                      key={size}
                      checked={formData.preferences.sizes.includes(size)}
                      onChange={(e) =>
                        handleArrayChange(
                          "preferences.sizes",
                          size,
                          e.target.checked
                        )
                      }
                    >
                      {size}
                    </CheckboxButton>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="mb-6">
                <label className="block text-xs font-light text-stone-400 mb-4 uppercase tracking-wider">
                  Favorite Colors
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {colors.map((color) => (
                    <CheckboxButton
                      key={color}
                      checked={formData.preferences.colors.includes(color)}
                      onChange={(e) =>
                        handleArrayChange(
                          "preferences.colors",
                          color,
                          e.target.checked
                        )
                      }
                    >
                      {color}
                    </CheckboxButton>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-center pt-6">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-stone-200 hover:bg-stone-300 text-stone-900 font-light py-3 px-12 transition-all duration-300 text-sm tracking-wider uppercase rounded-none"
            >
              {saving ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  Saving...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save size={16} />
                  Save Profile
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
