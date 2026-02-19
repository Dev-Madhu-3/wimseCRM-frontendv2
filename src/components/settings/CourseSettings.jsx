import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, BookOpen, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Modal from "../common/Modal";

const CourseSettings = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/settings/courses");
        setCourses(response.data);
      } catch (error) {
        toast.error("Failed to fetch courses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleAddCourse = () => {
    setEditingCourse(null);
    setFormData({
      name: "",
      description: "",
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      description: course.description || "",
      isActive: course.isActive,
    });
    setShowModal(true);
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await api.delete(`/settings/courses/${id}`);
        setCourses(courses.filter((course) => course.id !== id));
        toast.success("Course deleted successfully");
      } catch (error) {
        toast.error("Failed to delete course");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCourse) {
        // Update existing course
        const response = await api.put(
          `/settings/courses/${editingCourse.id}`,
          formData,
        );
        setCourses(
          courses.map((course) =>
            course.id === editingCourse.id ? response.data : course,
          ),
        );
        toast.success("Course updated successfully");
      } else {
        // Create new course
        const response = await api.post("/settings/courses", formData);
        setCourses([...courses, response.data]);
        toast.success("Course created successfully");
      }

      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save course");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="px-4 py-6 sm:px-0"
    >
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Course Settings</h1>
        <button
          onClick={handleAddCourse}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {courses.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {courses.map((course) => (
              <motion.li key={course.id} variants={itemVariants}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">
                            {course.name}
                          </p>
                          <span
                            className={`ml-2 inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                              course.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {course.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        {course.description && (
                          <p className="text-sm text-gray-500 mt-1">
                            {course.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditCourse(course)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Edit className="h-5 w-5 text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Trash2 className="h-5 w-5 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No courses
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a new course.
            </p>
            <div className="mt-6">
              <button
                onClick={handleAddCourse}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Course
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Course Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCourse ? "Edit Course" : "Add New Course"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Course Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isActive"
              className="ml-2 block text-sm text-gray-900"
            >
              Active
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              {editingCourse ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default CourseSettings;
