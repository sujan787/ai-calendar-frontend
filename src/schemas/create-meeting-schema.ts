
import * as yup from "yup";

export const createMeetingSchema = yup
  .object({
    summary: yup.string().min(5).max(100).required(),
    description: yup.string().min(5).max(100).required(),
    start_time: yup
      .string()
      .matches(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/,
        "Start time must be in ISO 8601 format (YYYY-MM-DDTHH:mm:ss)"
      )
      .required(),
    end_time: yup
      .string()
      .matches(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/,
        "End time must be in ISO 8601 format (YYYY-MM-DDTHH:mm:ss)"
      )
      .required()
      .test(
        "is-greater",
        "End time must be greater than start time",
        function (value) {
          const { start_time } = this.parent;
          if (!start_time || !value) return false;
          return new Date(value).getTime() > new Date(start_time).getTime();
        }
      ),
    time_zone: yup.string().min(5).max(50).required(),
    attendees: yup.array().of(yup.string().email()).min(1).required(),
    video_conference: yup.boolean().required(),
  })
  .required();

export type CreateMeetingType = yup.InferType<typeof createMeetingSchema>;


