const { Schema, model } = require("mongoose");

const ImageSchema = new Schema({

    uid: {
        type: String, // URL
        required: true
    },

    name: {
        type: String,
        required: true
    },

    owner: {
        type: Schema.Types.ObjectId,
        required: true
    }
});

ImageSchema.methods.toJSON = function () {

    const image = this;

    const {
        uid,
        name
    } = image.toObject();

    const public = {
        uid,
        name
    }

    return public;

}

// Get user by credentials
const ImageModel = model("Image", ImageSchema);

module.exports = ImageModel;