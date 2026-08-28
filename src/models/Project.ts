import mongoose, { Schema, InferSchemaType } from "mongoose";

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["Planning", "In Progress", "Completed"],
      default: "Planning",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "Employee",
      },
    ],

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

projectSchema.index({
  name: 1,
});

export type ProjectDocument = InferSchemaType<typeof projectSchema>;

export const Project = mongoose.model<ProjectDocument>(
  "Project",
  projectSchema,
);
