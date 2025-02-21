import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 1,
    maxlength: 50
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", 
    required: true,
},
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;