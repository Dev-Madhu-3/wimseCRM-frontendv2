import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  User,
  MessageSquare,
  Edit,
  Trash2,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../lib/api";

const FollowUpList = ({ followUps, onEdit, onDelete, onStatusChange }) => {
  const [expandedId, setExpandedId] = useState(null);

  const handleToggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this follow-up?")) {
      try {
        await api.delete(`/followups/${id}`);
        toast.success("Follow-up deleted successfully");
        if (onDelete) onDelete(id);
      } catch (error) {
        toast.error("Failed to delete follow-up");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Converted":
        return "bg-green-100 text-green-800";
      case "Dropped":
        return "bg-red-100 text-red-800";
      case "Visit Office":
        return "bg-blue-100 text-blue-800";
      case "Not Interested":
        return "bg-red-100 text-red-800";
      case "Interested":
        return "bg-green-100 text-green-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const isOverdue = (date) => {
    return new Date(date) < new Date();
  };

  if (!followUps || followUps.length === 0) {
    return (
      <div className="p-4 text-center">
        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No follow-ups
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          No follow-ups have been recorded for this lead yet.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {followUps.map((followUp) => (
        <motion.div
          key={followUp.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 hover:bg-gray-50"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-primary-600" />
              </div>
            </div>
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(followUp.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    at{" "}
                    {new Date(followUp.time).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <div className="flex items-center mt-1">
                    <User className="h-4 w-4 text-gray-400 mr-1" />
                    <p className="text-xs text-gray-500">
                      {followUp.followedBy}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(followUp.status)}`}
                  >
                    {followUp.status}
                  </span>
                  <button
                    onClick={() => handleToggleExpand(followUp.id)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    {expandedId === followUp.id ? "Hide" : "Show"} Details
                  </button>
                </div>
              </div>

              {expandedId === followUp.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 pt-3 border-t border-gray-200"
                >
                  <div className="mb-3">
                    <div className="flex items-start">
                      <MessageSquare className="h-4 w-4 text-gray-400 mr-1 mt-0.5" />
                      <p className="text-sm text-gray-700">
                        {followUp.feedback}
                      </p>
                    </div>
                  </div>

                  {followUp.nextFollowUpDate && (
                    <div className="mb-3">
                      <div className="flex items-center">
                        <Clock
                          className={`h-4 w-4 mr-1 ${isOverdue(followUp.nextFollowUpDate) ? "text-red-500" : "text-gray-400"}`}
                        />
                        <p
                          className={`text-sm ${isOverdue(followUp.nextFollowUpDate) ? "text-red-600 font-medium" : "text-gray-700"}`}
                        >
                          Next Follow-up:{" "}
                          {new Date(
                            followUp.nextFollowUpDate,
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          at{" "}
                          {new Date(
                            followUp.nextFollowUpTime,
                          ).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {isOverdue(followUp.nextFollowUpDate) && " (Overdue)"}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(followUp)}
                        className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => handleDelete(followUp.id)}
                        className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FollowUpList;
