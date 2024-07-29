import AggregateModel from "../models/aggregation.js";
import { connectDB } from "./db.config.js";

const insertFullCollection = async () => {
    await AggregateModel.insertMany([
        {
            name: "Pepperoni", size: "small", price: 19,
            quantity: 10, date: new Date("2021-03-13T08:14:30Z")
        },
        {
            name: "Pepperoni", size: "medium", price: 20,
            quantity: 20, date: new Date("2021-03-13T09:13:24Z")
        },
        {
            name: "Pepperoni", size: "large", price: 21,
            quantity: 30, date: new Date("2021-03-17T09:22:12Z")
        },
        {
            name: "Cheese", size: "small", price: 12,
            quantity: 15, date: new Date("2021-03-13T11:21:39.736Z")
        },
        {
            name: "Cheese", size: "medium", price: 13,
            quantity: 50, date: new Date("2022-01-12T21:23:13.331Z")
        },
        {
            name: "Cheese", size: "large", price: 14,
            quantity: 10, date: new Date("2022-01-12T05:08:13Z")
        },
        {
            name: "Vegan", size: "small", price: 17,
            quantity: 10, date: new Date("2021-01-13T05:08:13Z")
        },
        {
            name: "Vegan", size: "medium", price: 18,
            quantity: 10, date: new Date("2021-01-13T05:10:13Z")
        }
    ])
}

const aggregateFunction = async () => {
    await connectDB();
    // await insertFullCollection();

    /** after matching grouping fields */
    // const res = await AggregateModel.aggregate([
    //     {
    //         $match: { size: "medium" }
    //     },
    //     {
    //         $group: {
    //             _id: "$_id", 
    //             name: {$first: "$name" },
    //             totalQty: { $sum: "$quantity"},
    //             amount: { $sum: "$price"}
    //         }
    //     }
    // ])

    /** Comparison Operator: [ $eq, $ne, $gte, $lt, $in ] */
    // const res = await AggregateModel.find({name: { $eq: "Pepperoni"}});
    // const res = await AggregateModel.find({name: { $ne: "Pepperoni"}});
    // const res = await AggregateModel.find({price: { $gte: 17}});
    // const res = await AggregateModel.find({price: { $lt: Number(16) }});
    // const res = await AggregateModel.find({size: { $in: ['large', 'small']}});

    /** Expression Operator: $expr */
    /** Finding those entries where { (price*quantity) > 170 } */
    // const res = await AggregateModel.find({
    //     $expr: {
    //         $gt: [
    //             {
    //                 $multiply: [
    //                     '$price', '$quantity'
    //                 ]
    //             }, 
    //             170
    //         ]
    //     }
    // })

    /** Projection */
    const res = await AggregateModel.find({}, {name: 1, size: 1, _id: 0});




    console.log(res);
}

aggregateFunction()
.then(() => process.exit(1));