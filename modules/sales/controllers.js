import Sales from "./model.js";

export const saveSales = async (req, resp) => {
  console.log("[SALES] Saving new sales data:", {
    sales: req.body.sales,
    customers: req.body.customers,
    timestamp: new Date().toISOString(),
  });

  try {
    const { sales, customers } = req.body;

    const salesDoc = new Sales({
      sales: sales,
      customers: customers,
    });

    const savedDoc = await salesDoc.save();
    console.log("[SALES] Successfully saved sales record:", savedDoc._id);
    resp.status(200).json({
      status: true,
      msg: "Sales data saved successfully",
      doc: savedDoc,
    });
  } catch (error) {
    console.error("[SALES] Failed to save sales data:", error.message);
    resp.status(500).json({
      status: false,
      msg: "Error saving sales data",
    });
  }
};

// ...existing sales controller functions from server.js...
