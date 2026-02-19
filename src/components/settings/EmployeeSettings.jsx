import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, User, Mail, Phone, Shield } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Modal from "../common/Modal";

const EmployeeSettings = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    role: "Employee",
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get("/settings/employees");
        setEmployees(response.data);
      } catch (error) {
        toast.error("Failed to fetch employees");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      mobile: "",
      role: "Employee",
    });
    setShowModal(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      password: "",
      mobile: employee.mobile || "",
      role: employee.role,
    });
    setShowModal(true);
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await api.delete(`/settings/employees/${id}`);
        setEmployees(employees.filter((employee) => employee.id !== id));
        toast.success("Employee deleted successfully");
      } catch (error) {
        toast.error("Failed to delete employee");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingEmployee) {
        // Update existing employee
        const response = await api.put(
          `/settings/employees/${editingEmployee.id}`,
          formData,
        );
        setEmployees(
          employees.map((employee) =>
            employee.id === editingEmployee.id ? response.data : employee,
          ),
        );
        toast.success("Employee updated successfully");
      } else {
        // Create new employee
        const response = await api.post("/settings/employees", formData);
        setEmployees([...employees, response.data]);
        toast.success("Employee created successfully");
      }

      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save employee");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-800";
      case "Manager":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
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
        <h1 className="text-2xl font-bold text-gray-900">Employee Settings</h1>
        <button
          onClick={handleAddEmployee}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {employees.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {employees.map((employee) => (
              <motion.li key={employee.id} variants={itemVariants}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">
                            {employee.name}
                          </p>
                          <span
                            className={`ml-2 inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getRoleBadgeColor(employee.role)}`}
                          >
                            {employee.role}
                          </span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Mail className="h-4 w-4 text-gray-400 mr-1" />
                          <p className="text-sm text-gray-500">
                            {employee.email}
                          </p>
                        </div>
                        {employee.mobile && (
                          <div className="flex items-center mt-1">
                            <Phone className="h-4 w-4 text-gray-400 mr-1" />
                            <p className="text-sm text-gray-500">
                              {employee.mobile}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditEmployee(employee)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Edit className="h-5 w-5 text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(employee.id)}
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
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No employees
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a new employee.
            </p>
            <div className="mt-6">
              <button
                onClick={handleAddEmployee}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Employee
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Employee Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingEmployee ? "Edit Employee" : "Add New Employee"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
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
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password {editingEmployee && "(Leave blank to keep current)"}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!editingEmployee}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="mobile"
              className="block text-sm font-medium text-gray-700"
            >
              Mobile Number
            </label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="Employee">Employee</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
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
              {editingEmployee ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default EmployeeSettings;
