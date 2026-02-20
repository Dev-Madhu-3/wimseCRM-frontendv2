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
import FollowUpCard from "./FollowUpCard";

const FollowUpList = ({ followUps, onEdit, onDelete, onStatusChange, lead }) => {
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
          className="hover:bg-gray-50"
        >
          <div className="flex items-start">
            <div className="flex-1">
              <FollowUpCard
                followUp={followUp}
                expanded={expandedId === followUp.id}
                onToggle={() => handleToggleExpand(followUp.id)}
                onEdit={onEdit}
                onDelete={handleDelete}
                lead={lead}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FollowUpList;
