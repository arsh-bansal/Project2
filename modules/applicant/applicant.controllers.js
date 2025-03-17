import User from "../../models/User";

export const saveApplicant = async (req, res) => {
  if (req.files && req.files.ppic) {
    const uniqueFilename = `${Date.now()}_${req.files.ppic.name}`;
    const filepath = path.join(__dirname, "..", "uploads", uniqueFilename);

    try {
      await req.files.ppic.mv(filepath);
      console.log("File uploaded successfully");
      const filename = uniqueFilename;

      const user = await User.create(req.body);
      return res.json({ doc: user, status: true, msg: "saved" });
    } catch (err) {
      console.error("File upload failed:", err);
      return resp.json({ status: false, msg: "File upload failed" });
    }
  } else {
    console.log("No file uploaded");
  }
};

export const getApplicant = async (req, resp) => {
  try {
    const documents = await User.find();
    resp.status(200).json(documents);
  } catch (err) {
    console.error("Error fetching data:", err.message);
    resp.status(500).json({ error: err.message });
  }
};

export const updateApplicant = async (req, resp) => {
  console.log("Received update request:", req.body);
  const { uid, status } = req.body;

  if (!uid || status === undefined) {
    console.log("Invalid request data:", { uid, status });
    return resp
      .status(400)
      .json({ status: false, msg: "Invalid UID or status" });
  }

  try {
    const updatedDoc = await User.findOneAndUpdate(
      { uid: uid },
      { $set: { status: status } },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedDoc) {
      console.log("No document found for UID:", uid);
      return resp
        .status(404)
        .json({ status: false, msg: "Applicant not found" });
    }

    console.log("Successfully updated document:", updatedDoc);
    resp.status(200).json({
      status: true,
      msg: "Status updated successfully",
      doc: updatedDoc,
    });
  } catch (err) {
    console.error("Error updating status:", err);
    resp.status(500).json({ status: false, msg: err.message });
  }
};
