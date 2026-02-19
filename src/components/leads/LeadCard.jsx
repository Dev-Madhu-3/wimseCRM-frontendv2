import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Edit, Trash2, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const LeadCard = ({ lead, onDelete, onEdit }) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow rounded-lg overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-medium">
                  {lead.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-3 flex-1">
              <div className="flex items-center">
                <h3 className="text-sm font-medium text-gray-900">
                  {lead.name}
                </h3>
                <span
                  className={`ml-2 inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(lead.leadStatus)}`}
                >
                  {lead.leadStatus}
                </span>
              </div>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <Phone className="h-4 w-4 mr-1" />
                {lead.mobile}
              </div>
              {lead.email && (
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <Mail className="h-4 w-4 mr-1" />
                  {lead.email}
                </div>
              )}
              {lead.location && (
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  {lead.location}
                </div>
              )}
              <div className="mt-2 text-xs text-gray-500">
                <span>{lead.course}</span>
                {lead.specialization && <span className="mx-1">•</span>}
                <span>{lead.specialization}</span>
                <span className="mx-1">•</span>
                <span>{lead.branch}</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-1">
            <Link
              to={`/leads/${lead.id}`}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <Eye className="h-4 w-4 text-gray-400" />
            </Link>
            {onEdit && (
              <button
                onClick={() => onEdit(lead)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <Edit className="h-4 w-4 text-gray-400" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(lead.id)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <Trash2 className="h-4 w-4 text-red-400" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LeadCard;
