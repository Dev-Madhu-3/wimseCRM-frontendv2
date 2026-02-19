import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  BookOpen,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../lib/api";
import FollowUpList from "../followups/FollowUpList";
import FollowUpForm from "../followups/FollowUpForm";

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFollowUpForm, setShowFollowUpForm] = useState(false);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const response = await api.get(`/leads/${id}`);
        setLead(response.data);
      } catch (error) {
        toast.error("Failed to fetch lead details");
        navigate("/leads");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLead();
  }, [id, navigate]);

  const handleDeleteLead = async () => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await api.delete(`/leads/${id}`);
        toast.success("Lead deleted successfully");
        navigate("/leads");
      } catch (error) {
        toast.error("Failed to delete lead");
      }
    }
  };

  const handleFollowUpAdded = (newFollowUp) => {
    setLead((prev) => ({
      ...prev,
      followUps: [newFollowUp, ...prev.followUps],
    }));
    setShowFollowUpForm(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-500">Lead not found</p>
        <Link
          to="/leads"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          Back to Leads
        </Link>
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
          <h1 className="text-2xl font-bold text-gray-900">Lead Details</h1>
        </div>
        <div className="flex space-x-2">
          <Link
            to={`/leads/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
          <button
            onClick={handleDeleteLead}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Lead Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lead Details Card */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Lead Information
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Personal details and lead source information.
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Full name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {lead.name}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Mobile number
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {lead.mobile}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    WhatsApp number
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {lead.whatsapp || "Not provided"}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Email address
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {lead.email || "Not provided"}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Location
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {lead.location || "Not provided"}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Lead date
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(lead.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Lead time
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(lead.time).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Lead source
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {lead.leadSource} {lead.subSource && `(${lead.subSource})`}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Handled by
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {lead.handledBy}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Branch</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {lead.branch}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 sm:mt-0 sm:col-span-2">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        lead.leadStatus === "Converted"
                          ? "bg-green-100 text-green-800"
                          : lead.leadStatus === "Dropped"
                            ? "bg-red-100 text-red-800"
                            : lead.leadStatus === "Visit Office"
                              ? "bg-blue-100 text-blue-800"
                              : lead.leadStatus === "Not Interested"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {lead.leadStatus}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Course Information Card */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Course Information
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Details about the course the student is interested in.
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Course</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {lead.course}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Specialization
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {lead.specialization || "Not specified"}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Mode</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {lead.mode}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Qualification
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {lead.qualification || "Not specified"}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Academic Status
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {lead.status}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Year of Study
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {lead.yearOfStudy || "Not specified"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Follow-ups Section */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Follow-ups
              </h3>
              <button
                onClick={() => setShowFollowUpForm(!showFollowUpForm)}
                className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="border-t border-gray-200">
              {showFollowUpForm && (
                <div className="p-4 border-b border-gray-200">
                  <FollowUpForm
                    leadId={id}
                    onFollowUpAdded={handleFollowUpAdded}
                  />
                </div>
              )}
              <FollowUpList followUps={lead.followUps || []} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LeadDetail;
