import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, User, MessageSquare, Clock, ChevronDown, ChevronUp, Edit, Trash2 } from 'lucide-react'

const FollowUpCard = ({ followUp, expanded, onToggle, lead, onEdit, onDelete }) => {
  const isOverdue = (date) => {
    return new Date(date) < new Date()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Converted':
        return 'bg-green-100 text-green-800'
      case 'Dropped':
        return 'bg-red-100 text-red-800'
      case 'Visit Office':
        return 'bg-blue-100 text-blue-800'
      case 'Not Interested':
        return 'bg-red-100 text-red-800'
      case 'Interested':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white shadow rounded-lg overflow-hidden"
    >
      <div className="p-4 relative">
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary-600" />
              </div>
            </div>
            <div className="ml-3">
              <div className="flex items-center justify-between">
                <div className="">
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(followUp.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}{' '}
                    at{' '}
                    {new Date(followUp.time).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                   <div className="flex items-center mt-1 text-xs text-gray-500 justify-between">
                <div className="flex items-center">
                  {/* <User className="h-4 w-4 text-gray-400 mr-1" /> */}
                  <p className="text-xs text-gray-500 mr-3">Followed by {followUp.followedBy}</p>
                  {/* Lead details: either embedded followUp.lead or parent lead prop */}
                  
                </div>
              </div>
                  <p
                    className={`absolute top-1 right-1 inline-flex px-2 py-0.5 text-[0.5rem] font-semibold rounded-full z-10 ${getStatusColor(
                      followUp.status
                    )}`}
                  >
                    {followUp.status}
                  </p>
                </div>
              </div>


            </div>
          </div>
          <button
            onClick={onToggle}
            className="flex-shrink-0 mt-2 p-1 rounded-md hover:bg-gray-100"
          >
            {expanded ? (
              <ChevronUp className=" h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>

            {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <div className="mb-3">
              <div className="flex items-start">
                <MessageSquare className="h-4 w-4 text-gray-400 mr-1 mt-0.5" />
                <p className="text-sm text-gray-700">{followUp.feedback}</p>
              </div>
            </div>

            {followUp.nextFollowUpDate && (
              <div>
                <div className="flex items-center">
                  <Clock className={`h-4 w-4 mr-1 ${isOverdue(followUp.nextFollowUpDate) ? 'text-red-500' : 'text-gray-400'}`} />
                  <p className={`text-sm ${isOverdue(followUp.nextFollowUpDate) ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
                    Next Follow-up: {new Date(followUp.nextFollowUpDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })} at {new Date(followUp.nextFollowUpTime).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    {isOverdue(followUp.nextFollowUpDate) && ' (Overdue)'}
                  </p>
                </div>
              </div>
            )}

                <div className="flex justify-end space-x-2 mt-3">
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
                      onClick={() => onDelete(followUp.id)}
                      className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default FollowUpCard