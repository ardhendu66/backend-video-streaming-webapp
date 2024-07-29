import mongoose from "mongoose";

const aggregateSchema = new mongoose.Schema({
    name: String,
    size: String,
    price: Number,
    quantity: Number,
    date: Date,
})

const AggregateModel = mongoose.models?.Aggregate || mongoose.model("Aggregate", aggregateSchema);

export default AggregateModel;