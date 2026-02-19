import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../lib/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const LeadForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [branches, setBranches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [leadSources, setLeadSources] = useState([]);
  const [subSources, setSubSources] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [modes, setModes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [selectedSource, setSelectedSource] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      date: new Date(),
      time: new Date(),
      leadSource: "",
      subSource: "",
      handledBy: "",
      branch: "",
      name: "",
      mobile: "",
      whatsapp: "",
      email: "",
      location: "",
      course: "",
      specialization: "",
      mode: "",
      qualification: "",
      status: "Pass",
      yearOfStudy: "",
      leadStatus: "Interested",
    },
  });

  const watchedSource = watch("leadSource");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [branchesRes, coursesRes, sourcesRes, employeesRes] =
          await Promise.all([
            api.get("/settings/branches"),
            api.get("/settings/courses"),
            api.get("/settings/lead-sources"),
            api.get("/settings/employees"),
          ]);

        setBranches(branchesRes.data);
        setCourses(coursesRes.data);
        setLeadSources(sourcesRes.data);
        setEmployees(employeesRes.data);
        setSpecializations([
          "CS",
          "Maths",
          "Physics",
          "Chemistry",
          "Biology",
          "Commerce",
          "Arts",
        ]);
        setModes(["Distance", "Regular", "Online"]);
        setStatuses([
          "Next Follow-up",
          "Visit Office",
          "Interested",
          "Not Interested",
          "Converted",
          "Dropped",
        ]);
      } catch (error) {
        toast.error("Failed to load settings");
      }
    };

    fetchSettings();

    if (id) {
      const fetchLead = async () => {
        setIsLoading(true);
        try {
          const response = await api.get(`/leads/${id}`);
          const lead = response.data;

          setValue("date", new Date(lead.date));
          setValue("time", new Date(lead.time));
          setValue("leadSource", lead.leadSource);
          setValue("subSource", lead.subSource);
          setValue("handledBy", lead.handledBy);
          setValue("branch", lead.branch);
          setValue("name", lead.name);
          setValue("mobile", lead.mobile);
          setValue("whatsapp", lead.whatsapp);
          setValue("email", lead.email);
          setValue("location", lead.location);
          setValue("course", lead.course);
          setValue("specialization", lead.specialization);
          setValue("mode", lead.mode);
          setValue("qualification", lead.qualification);
          setValue("status", lead.status);
          setValue("yearOfStudy", lead.yearOfStudy);
          setValue("leadStatus", lead.leadStatus);

          setSelectedSource(lead.leadSource);
        } catch (error) {
          toast.error("Failed to load lead");
          navigate("/leads");
        } finally {
          setIsLoading(false);
        }
      };

      fetchLead();
    }
  }, [id, navigate, setValue]);

  useEffect(() => {
    if (watchedSource) {
      const source = leadSources.find((s) => s.name === watchedSource);
      if (source && source.subSources) {
        setSubSources(source.subSources);
      } else {
        setSubSources([]);
      }
    }
  }, [watchedSource, leadSources]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        date: data.date.toISOString(),
        time: data.time.toISOString(),
      };

      if (id) {
        await api.put(`/leads/${id}`, payload);
        toast.success("Lead updated successfully");
      } else {
        await api.post("/leads", payload);
        toast.success("Lead created successfully");
      }

      navigate("/leads");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save lead");
    } finally {
      setIsSubmitting(false);
    }
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="px-4 py-6 sm:px-0"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-md hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {id ? "Edit Lead" : "Add New Lead"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Lead Details Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Lead Details
            </h3>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date
                </label>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  )}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.date.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-700"
                >
                  Time
                </label>
                <Controller
                  name="time"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  )}
                />
                {errors.time && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.time.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="leadSource"
                  className="block text-sm font-medium text-gray-700"
                >
                  Lead Source
                </label>
                <select
                  id="leadSource"
                  {...register("leadSource", {
                    required: "Lead source is required",
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="">Select a source</option>
                  {leadSources.map((source) => (
                    <option key={source.id} value={source.name}>
                      {source.name}
                    </option>
                  ))}
                </select>
                {errors.leadSource && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.leadSource.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="subSource"
                  className="block text-sm font-medium text-gray-700"
                >
                  Sub Source
                </label>
                <select
                  id="subSource"
                  {...register("subSource")}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  disabled={subSources.length === 0}
                >
                  <option value="">Select a sub source</option>
                  {subSources.map((subSource) => (
                    <option key={subSource} value={subSource}>
                      {subSource}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="handledBy"
                  className="block text-sm font-medium text-gray-700"
                >
                  Handled By
                </label>
                <select
                  id="handledBy"
                  {...register("handledBy", {
                    required: "Handled by is required",
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="">Select an employee</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.name}>
                      {employee.name}
                    </option>
                  ))}
                </select>
                {errors.handledBy && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.handledBy.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="branch"
                  className="block text-sm font-medium text-gray-700"
                >
                  Branch
                </label>
                <select
                  id="branch"
                  {...register("branch", { required: "Branch is required" })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="">Select a branch</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.name}>
                      {branch.name}
                    </option>
                  ))}
                </select>
                {errors.branch && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.branch.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Student Details Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Student Details
            </h3>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 lg:grid-cols-3">
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
                  {...register("name", { required: "Name is required" })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
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
                  {...register("mobile", {
                    required: "Mobile number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Mobile number must be 10 digits",
                    },
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
                {errors.mobile && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.mobile.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="whatsapp"
                  className="block text-sm font-medium text-gray-700"
                >
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  id="whatsapp"
                  {...register("whatsapp", {
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "WhatsApp number must be 10 digits",
                    },
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
                {errors.whatsapp && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.whatsapp.message}
                  </p>
                )}
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
                  {...register("email", {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  {...register("location")}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Interested In Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Interested In
            </h3>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label
                  htmlFor="course"
                  className="block text-sm font-medium text-gray-700"
                >
                  Course
                </label>
                <select
                  id="course"
                  {...register("course", { required: "Course is required" })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.name}>
                      {course.name}
                    </option>
                  ))}
                </select>
                {errors.course && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.course.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="specialization"
                  className="block text-sm font-medium text-gray-700"
                >
                  Specialization
                </label>
                <select
                  id="specialization"
                  {...register("specialization")}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="">Select a specialization</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="mode"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mode
                </label>
                <select
                  id="mode"
                  {...register("mode", { required: "Mode is required" })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="">Select a mode</option>
                  {modes.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
                {errors.mode && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.mode.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="qualification"
                  className="block text-sm font-medium text-gray-700"
                >
                  Qualification
                </label>
                <input
                  type="text"
                  id="qualification"
                  {...register("qualification")}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  id="status"
                  {...register("status")}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="Pass">Pass</option>
                  <option value="Fail">Fail</option>
                  <option value="Appearing">Appearing</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="yearOfStudy"
                  className="block text-sm font-medium text-gray-700"
                >
                  Year of Study
                </label>
                <input
                  type="text"
                  id="yearOfStudy"
                  {...register("yearOfStudy")}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="leadStatus"
                  className="block text-sm font-medium text-gray-700"
                >
                  Lead Status
                </label>
                <select
                  id="leadStatus"
                  {...register("leadStatus")}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Lead
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default LeadForm;
