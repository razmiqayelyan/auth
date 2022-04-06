import mongoose from "mongoose";

const Schema = mongoose.Schema

const ProductSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    text : {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    }
}, {timestamps: true})

const Product = mongoose.model('product', ProductSchema)

export default Product
