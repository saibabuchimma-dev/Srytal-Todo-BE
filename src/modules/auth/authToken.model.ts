import mongoose, { InferSchemaType, Schema } from "mongoose";

const authTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },

    token: {
      type: String,
      required: true,
      unique: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    revoked: {
      type: Boolean,
      default: false,
    },

    revokedAt: {
      type: Date,
    },

    replacedByToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

authTokenSchema.index({ user: 1, expiresAt: 1 });

export type AuthTokenDocument = InferSchemaType<typeof authTokenSchema>;

export const AuthToken = mongoose.model<AuthTokenDocument>(
  "AuthToken",
  authTokenSchema,
);
