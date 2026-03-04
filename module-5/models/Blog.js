'use strict';

const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type:      String,
      required:  [true, 'Title is required.'],
      minlength: [5,    'Title must be at least 5 characters.'],
      trim:      true,
    },
    content: {
      type:      String,
      required:  [true, 'Content is required.'],
      minlength: [10,   'Content must be at least 10 characters.'],
      trim:      true,
    },
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'Blog must be associated with a user.'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Blog', blogSchema);
