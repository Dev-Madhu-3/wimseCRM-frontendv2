import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { Calendar, Clock, MessageSquare, Save, X } from "lucide-react";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../lib/api";

const FollowUpForm = ({
  leadId,
  followUp,
  onCancel,
  onFollowUpAdded,
  onFollowUpUpdated,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [statuses] = useState([
    "Next Follow-up",
    "Visit Office",
    "Interested",
    "Not Interested",
    "Converted",
    "Dropped",
  ]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      date: followUp ? new Date(followUp.date) : new Date(),
      time: followUp ? new Date(followUp.time) : new Date(),
      followedBy: followUp ? followUp.followedBy : "",
      feedback: followUp ? followUp.feedback : "",
      status: followUp ? followUp.status : "Next Follow-up",
      nextFollowUpDate:
        followUp && followUp.nextFollowUpDate
          ? new Date(followUp.nextFollowUpDate)
          : "",
      nextFollowUpTime:
        followUp && followUp.nextFollowUpTime
          ? new Date(followUp.nextFollowUpTime)
          : "",
    },
  });

  const watchedStatus = watch("status");

  useEffect(() => {
    // If status is converted or dropped, clear next follow-up fields
    if (watchedStatus === "Converted" || watchedStatus === "Dropped") {
      setValue("nextFollowUpDate", "");
      setValue("nextFollowUpTime", "");
    }
  }, [watchedStatus, setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const payload = {
        leadId,
        date: data.date.toISOString(),
        time: data.time.toISOString(),
        followedBy: data.followedBy,
        feedback: data.feedback,
        status: data.status,
        nextFollowUpDate: data.nextFollowUpDate
          ? data.nextFollowUpDate.toISOString()
          : null,
        nextFollowUpTime: data.nextFollowUpTime
          ? data.nextFollowUpTime.toISOString()
          : null,
      };

      if (followUp) {
        // Update existing follow-up
        const response = await api.put(`/followups/${followUp.id}`, payload);
        toast.success("Follow-up updated successfully");
        if (onFollowUpUpdated) onFollowUpUpdated(response.data);
      } else {
        // Create new follow-up
        const response = await api.post("/followups", payload);
        toast.success("Follow-up added successfully");
        if (onFollowUpAdded) onFollowUpAdded(response.data);
      }

      // Reset form if creating new follow-up
      if (!followUp) {
        setValue("date", new Date());
        setValue("time", new Date());
        setValue("feedback", "");
        setValue("status", "Next Follow-up");
        setValue("nextFollowUpDate", "");
        setValue("nextFollowUpTime", "");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save follow-up");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-50 p-4 rounded-md"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          {followUp ? "Edit Follow-up" : "Add Follow-up"}
        </h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
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
              <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="followedBy"
            className="block text-sm font-medium text-gray-700"
          >
            Followed By
          </label>
          <input
            type="text"
            id="followedBy"
            {...register("followedBy", { required: "Followed by is required" })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
          {errors.followedBy && (
            <p className="mt-1 text-sm text-red-600">
              {errors.followedBy.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="feedback"
            className="block text-sm font-medium text-gray-700"
          >
            Feedback
          </label>
          <textarea
            id="feedback"
            rows={3}
            {...register("feedback", { required: "Feedback is required" })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
          {errors.feedback && (
            <p className="mt-1 text-sm text-red-600">
              {errors.feedback.message}
            </p>
          )}
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
            {...register("status", { required: "Status is required" })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        {watchedStatus !== "Converted" && watchedStatus !== "Dropped" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="nextFollowUpDate"
                className="block text-sm font-medium text-gray-700"
              >
                Next Follow-up Date
              </label>
              <Controller
                name="nextFollowUpDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholderText="Select date"
                  />
                )}
              />
            </div>

            <div>
              <label
                htmlFor="nextFollowUpTime"
                className="block text-sm font-medium text-gray-700"
              >
                Next Follow-up Time
              </label>
              <Controller
                name="nextFollowUpTime"
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
                    placeholderText="Select time"
                  />
                )}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {followUp ? "Update" : "Save"}
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default FollowUpForm;
