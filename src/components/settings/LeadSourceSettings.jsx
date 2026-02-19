import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Globe, Check, X, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Modal from "../common/Modal";

const LeadSourceSettings = () => {
  const [leadSources, setLeadSources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSource, setEditingSource] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    subSources: [""],
    isActive: true,
  });

  useEffect(() => {
    const fetchLeadSources = async () => {
      try {
        const response = await api.get("/settings/lead-sources");
        setLeadSources(response.data);
      } catch (error) {
        toast.error("Failed to fetch lead sources");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeadSources();
  }, []);

  const handleAddLeadSource = () => {
    setEditingSource(null);
    setFormData({
      name: "",
      subSources: [""],
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEditLeadSource = (source) => {
    setEditingSource(source);
    setFormData({
      name: source.name,
      subSources: source.subSources.length > 0 ? source.subSources : [""],
      isActive: source.isActive,
    });
    setShowModal(true);
  };

  const handleDeleteLeadSource = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead source?")) {
      try {
        await api.delete(`/settings/lead-sources/${id}`);
        setLeadSources(leadSources.filter((source) => source.id !== id));
        toast.success("Lead source deleted successfully");
      } catch (error) {
        toast.error("Failed to delete lead source");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Filter out empty sub-sources
    const filteredSubSources = formData.subSources.filter(
      (sub) => sub.trim() !== "",
    );

    try {
      if (editingSource) {
        // Update existing lead source
        const response = await api.put(
          `/settings/lead-sources/${editingSource.id}`,
          {
            ...formData,
            subSources: filteredSubSources,
          },
        );
        setLeadSources(
          leadSources.map((source) =>
            source.id === editingSource.id ? response.data : source,
          ),
        );
        toast.success("Lead source updated successfully");
      } else {
        // Create new lead source
        const response = await api.post("/settings/lead-sources", {
          ...formData,
          subSources: filteredSubSources,
        });
        setLeadSources([...leadSources, response.data]);
        toast.success("Lead source created successfully");
      }

      setShowModal(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save lead source",
      );
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubSourceChange = (index, value) => {
    const newSubSources = [...formData.subSources];
    newSubSources[index] = value;
    setFormData((prev) => ({
      ...prev,
      subSources: newSubSources,
    }));
  };

  const addSubSource = () => {
    setFormData((prev) => ({
      ...prev,
      subSources: [...prev.subSources, ""],
    }));
  };

  const removeSubSource = (index) => {
    if (formData.subSources.length > 1) {
      const newSubSources = [...formData.subSources];
      newSubSources.splice(index, 1);
      setFormData((prev) => ({
        ...prev,
        subSources: newSubSources,
      }));
    }
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
        <h1 className="text-2xl font-bold text-gray-900">
          Lead Source Settings
        </h1>
        <button
          onClick={handleAddLeadSource}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Lead Source
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {leadSources.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {leadSources.map((source) => (
              <motion.li key={source.id} variants={itemVariants}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <Globe className="h-5 w-5 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">
                            {source.name}
                          </p>
                          <span
                            className={`ml-2 inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                              source.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {source.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        {source.subSources.length > 0 && (
                          <div className="mt-1">
                            <p className="text-xs text-gray-500">
                              Sub-sources:
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {source.subSources.map((subSource, index) => (
                                <span
                                  key={index}
                                  className="inline-flex px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-800"
                                >
                                  {subSource}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditLeadSource(source)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Edit className="h-5 w-5 text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteLeadSource(source.id)}
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
            <Globe className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No lead sources
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a new lead source.
            </p>
            <div className="mt-6">
              <button
                onClick={handleAddLeadSource}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Lead Source
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Lead Source Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingSource ? "Edit Lead Source" : "Add New Lead Source"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Source Name
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sub-sources
            </label>
            {formData.subSources.map((subSource, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={subSource}
                  onChange={(e) => handleSubSourceChange(index, e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Enter sub-source"
                />
                {formData.subSources.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSubSource(index)}
                    className="p-2 border border-gray-300 rounded-md text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addSubSource}
              className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
            >
              <PlusCircle className="h-3 w-3 mr-1" />
              Add Sub-source
            </button>
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
              {editingSource ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default LeadSourceSettings;
