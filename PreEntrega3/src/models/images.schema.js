import { Schema, model } from "mongoose";

const imageSchema = new Schema({
    filename: String,
    data: Buffer,
    contentTYpe: String,
}, { versionKey: false, timestamps: true });

const ImageModel = model("images", imageSchema);

export default ImageModel;