import express from "express";
import cors from "cors";
import fileuploader from "express-fileupload";
import User from "./models/User.js";
import dotenv from "dotenv";
import { connectToDb } from "./lib/connectToDb.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileuploader());
app.use(cors());

connectToDb();

app.listen(2006, async function () {
  console.log("Server Started...");

  const adminExists = await User.findOne({ user: "admin" });
  if (!adminExists) {
    const adminUser = new User({
      user: "admin",
      pwd: "admin123",
      role: "admin",
    });
    await adminUser.save();
    console.log("Admin user created successfully");
  }
});

app.get("/showfilter/:status", async (req, resp) => {
  try {
    const status = parseInt(req.params.status);

    if (isNaN(status)) {
      return resp.status(400).json({
        error: "Invalid status parameter",
      });
    }

    const documents = await ApplicantRef.find({ status: status });

    console.log(
      `Filtered applications for status ${status}:`,
      documents.length
    );
    resp.status(200).json(documents);
  } catch (err) {
    console.error("Error fetching filtered data:", err.message);
    resp.status(500).json({
      error: err.message,
    });
  }
});

app.post("/savelogin", async (req, resp) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return resp.status(400).json({
      status: false,
      msg: "Username and password are required",
    });
  }

  try {
    const loginDoc = new User({
      user: username,
      pwd: password,
      role: "user",
    });

    const savedDoc = await loginDoc.save();
    console.log("Login credentials saved:", savedDoc);

    resp.status(200).json({
      status: true,
      msg: "Login credentials saved successfully",
      doc: savedDoc,
    });
  } catch (error) {
    console.error("Error saving login credentials:", error);
    resp.status(500).json({
      status: false,
      msg: "An error occurred while saving login credentials",
    });
  }
});

app.get("/validatelogin", async (req, resp) => {
  const { username, password } = req.query;

  if (!username || !password) {
    return resp
      .status(400)
      .json({ status: false, msg: "Username and password are required" });
  }

  try {
    const user = await User.findOne({ user: username });

    if (!user) {
      return resp.status(404).json({ status: false, msg: "User not found" });
    }

    if (user.pwd === password) {
      resp.status(200).json({
        status: true,
        msg: "Login successful",
        role: user.role,
      });
    } else {
      resp.status(401).json({ status: false, msg: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login validation error:", error);
    resp.status(500).json({ status: false, msg: "Internal server error" });
  }
});

app.post("/savesales", async (req, resp) => {
  try {
    const { sales, customers } = req.body;

    const salesDoc = new SalesRef({
      sales: sales,
      customers: customers,
    });

    const savedDoc = await salesDoc.save();
    resp.status(200).json({
      status: true,
      msg: "Sales data saved successfully",
      doc: savedDoc,
    });
  } catch (error) {
    console.error("Error saving sales data:", error);
    resp.status(500).json({
      status: false,
      msg: "Error saving sales data",
    });
  }
});

app.get("/saleshistory", async (req, resp) => {
  try {
    const { from, to } = req.query;
    const startDate = new Date(from);
    const endDate = new Date(to);
    endDate.setHours(23, 59, 59, 999); // Include the entire end date

    const sales = await SalesRef.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ date: 1 });

    resp.status(200).json({
      status: true,
      data: sales,
    });
  } catch (error) {
    console.error("Error fetching sales history:", error);
    resp.status(500).json({
      status: false,
      msg: "Error fetching sales history",
    });
  }
});

app.get("/totalsales", async (req, resp) => {
  try {
    const { from, to } = req.query;
    const startDate = new Date(from);
    const endDate = new Date(to);
    endDate.setHours(23, 59, 59, 999);

    const result = await SalesRef.aggregate([
      {
        $match: {
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$sales" },
          totalCustomers: { $sum: "$customers" },
        },
      },
    ]);

    const totals = result[0] || { totalSales: 0, totalCustomers: 0 };

    resp.status(200).json({
      status: true,
      data: totals,
    });
  } catch (error) {
    console.error("Error calculating total sales:", error);
    resp.status(500).json({
      status: false,
      msg: "Error calculating total sales",
    });
  }
});

// Add this new endpoint to your existing server.js file
app.post("/updatepassword", async (req, resp) => {
  const { email, currentPassword, newPassword } = req.body;

  if (!email || !currentPassword || !newPassword) {
    return resp.status(400).json({
      status: false,
      msg: "All fields are required",
    });
  }

  try {
    // Find the user
    const user = await User.findOne({ user: email });

    if (!user) {
      return resp.status(404).json({
        status: false,
        msg: "User not found",
      });
    }

    // Check if current password matches
    if (user.pwd !== currentPassword) {
      return resp.status(401).json({
        status: false,
        msg: "Current password is incorrect",
      });
    }

    // Update the password
    const updatedUser = await User.findOneAndUpdate(
      { user: email },
      { $set: { pwd: newPassword } },
      { new: true }
    );

    resp.status(200).json({
      status: true,
      msg: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    resp.status(500).json({
      status: false,
      msg: "An error occurred while updating password",
    });
  }
});

// Add this new endpoint to your existing server.js
app.get("/chartdata", async (req, resp) => {
  try {
    // Get data for the last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const salesData = await SalesRef.aggregate([
      {
        $match: {
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          totalSales: { $sum: "$sales" },
          totalCustomers: { $sum: "$customers" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Calculate average sales per customer
    const enrichedData = salesData.map((day) => ({
      date: day._id,
      sales: day.totalSales,
      customers: day.totalCustomers,
      averagePerCustomer: (day.totalSales / day.totalCustomers).toFixed(2),
    }));

    resp.status(200).json({
      status: true,
      data: enrichedData,
    });
  } catch (error) {
    console.error("Error fetching chart data:", error);
    resp.status(500).json({
      status: false,
      msg: "Error fetching chart data",
    });
  }
});

// Add these new endpoints to your existing server.js

// Endpoint for sales distribution by day of week
app.get("/salesbyday", async (req, resp) => {
  try {
    const salesData = await SalesRef.aggregate([
      {
        $group: {
          _id: { $dayOfWeek: "$date" },
          totalSales: { $sum: "$sales" },
        },
      },
      {
        $project: {
          day: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 1] }, then: "Sunday" },
                { case: { $eq: ["$_id", 2] }, then: "Monday" },
                { case: { $eq: ["$_id", 3] }, then: "Tuesday" },
                { case: { $eq: ["$_id", 4] }, then: "Wednesday" },
                { case: { $eq: ["$_id", 5] }, then: "Thursday" },
                { case: { $eq: ["$_id", 6] }, then: "Friday" },
                { case: { $eq: ["$_id", 7] }, then: "Saturday" },
              ],
            },
          },
          value: "$totalSales",
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    resp.status(200).json({
      status: true,
      data: salesData,
    });
  } catch (error) {
    console.error("Error fetching sales by day data:", error);
    resp.status(500).json({
      status: false,
      msg: "Error fetching sales by day data",
    });
  }
});

// Endpoint for customer distribution
app.get("/customerdistribution", async (req, resp) => {
  try {
    const currentDate = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const customerData = await SalesRef.aggregate([
      {
        $match: {
          date: {
            $gte: thirtyDaysAgo,
            $lte: currentDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: "$customers" },
          data: {
            $push: {
              customers: "$customers",
              date: "$date",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          segments: [
            {
              name: "High Traffic (>50)",
              value: {
                $size: {
                  $filter: {
                    input: "$data",
                    as: "item",
                    cond: { $gt: ["$$item.customers", 50] },
                  },
                },
              },
            },
            {
              name: "Medium Traffic (20-50)",
              value: {
                $size: {
                  $filter: {
                    input: "$data",
                    as: "item",
                    cond: {
                      $and: [
                        { $gte: ["$$item.customers", 20] },
                        { $lte: ["$$item.customers", 50] },
                      ],
                    },
                  },
                },
              },
            },
            {
              name: "Low Traffic (<20)",
              value: {
                $size: {
                  $filter: {
                    input: "$data",
                    as: "item",
                    cond: { $lt: ["$$item.customers", 20] },
                  },
                },
              },
            },
          ],
        },
      },
    ]);

    resp.status(200).json({
      status: true,
      data: customerData[0]?.segments || [],
    });
  } catch (error) {
    console.error("Error fetching customer distribution:", error);
    resp.status(500).json({
      status: false,
      msg: "Error fetching customer distribution",
    });
  }
});

// Add this new endpoint for filtered chart data
app.get("/filteredchartdata", async (req, resp) => {
  try {
    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const salesData = await SalesRef.aggregate([
      {
        $match: {
          date: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          totalSales: { $sum: "$sales" },
          totalCustomers: { $sum: "$customers" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const enrichedData = salesData.map((day) => ({
      date: day._id,
      sales: day.totalSales,
      customers: day.totalCustomers,
      averagePerCustomer: (day.totalSales / day.totalCustomers).toFixed(2),
    }));

    resp.status(200).json({
      status: true,
      data: enrichedData,
    });
  } catch (error) {
    console.error("Error fetching filtered chart data:", error);
    resp.status(500).json({
      status: false,
      msg: "Error fetching filtered chart data",
    });
  }
});

app.get("/filteredsalesbyday", async (req, resp) => {
  try {
    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const salesData = await SalesRef.aggregate([
      {
        $match: {
          date: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$date" },
          totalSales: { $sum: "$sales" },
        },
      },
      {
        $project: {
          day: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 1] }, then: "Sunday" },
                { case: { $eq: ["$_id", 2] }, then: "Monday" },
                { case: { $eq: ["$_id", 3] }, then: "Tuesday" },
                { case: { $eq: ["$_id", 4] }, then: "Wednesday" },
                { case: { $eq: ["$_id", 5] }, then: "Thursday" },
                { case: { $eq: ["$_id", 6] }, then: "Friday" },
                { case: { $eq: ["$_id", 7] }, then: "Saturday" },
              ],
            },
          },
          value: "$totalSales",
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    resp.status(200).json({
      status: true,
      data: salesData,
    });
  } catch (error) {
    console.error("Error fetching filtered sales by day data:", error);
    resp.status(500).json({
      status: false,
      msg: "Error fetching filtered sales by day data",
    });
  }
});

app.get("/filteredcustomerdistribution", async (req, resp) => {
  try {
    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const customerData = await SalesRef.aggregate([
      {
        $match: {
          date: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: "$customers" },
          data: {
            $push: {
              customers: "$customers",
              date: "$date",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          segments: [
            {
              name: "High Traffic (>50)",
              value: {
                $size: {
                  $filter: {
                    input: "$data",
                    as: "item",
                    cond: { $gt: ["$$item.customers", 50] },
                  },
                },
              },
            },
            {
              name: "Medium Traffic (20-50)",
              value: {
                $size: {
                  $filter: {
                    input: "$data",
                    as: "item",
                    cond: {
                      $and: [
                        { $gte: ["$$item.customers", 20] },
                        { $lte: ["$$item.customers", 50] },
                      ],
                    },
                  },
                },
              },
            },
            {
              name: "Low Traffic (<20)",
              value: {
                $size: {
                  $filter: {
                    input: "$data",
                    as: "item",
                    cond: { $lt: ["$$item.customers", 20] },
                  },
                },
              },
            },
          ],
        },
      },
    ]);

    resp.status(200).json({
      status: true,
      data: customerData[0]?.segments || [],
    });
  } catch (error) {
    console.error("Error fetching filtered customer distribution:", error);
    resp.status(500).json({
      status: false,
      msg: "Error fetching filtered customer distribution",
    });
  }
});
