import mongoose from 'mongoose'

const durationSchema = new mongoose.Schema(
  {
    from: {
      type: Date,
      required: true,
    },
    to: {
      type: Date,
      required: true,
    },
    update_file:{
        type: Array,
    },
    previousDurations: [
      {
        from: Date,
        to: Date,
        updatedAt: {
          type: Date,
          default: Date.now()
        }
      },
    ],
    max_limit: {
        type: Number,
        default: 0
    },
  },
  {
    timestamps: true, // This will automatically manage createdAt and updatedAt fields
  }
);

export default mongoose.model('Durations', durationSchema)