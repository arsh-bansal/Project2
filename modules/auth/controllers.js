import User from "./model.js";

export const saveLogin = async (req, resp) => {
  console.log("[AUTH] Saving new login credentials:", {
    username: req.body.username,
    timestamp: new Date().toISOString(),
  });

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
    console.log("[AUTH] Successfully saved user:", savedDoc._id);
    console.log("Login credentials saved:", savedDoc);

    resp.status(200).json({
      status: true,
      msg: "Login credentials saved successfully",
      doc: savedDoc,
    });
  } catch (error) {
    console.error("[AUTH] Failed to save login:", error.message);
    console.error("Error saving login credentials:", error);
    resp.status(500).json({
      status: false,
      msg: "An error occurred while saving login credentials",
    });
  }
};

export const validateLogin = async (req, resp) => {
  console.log("[AUTH] Validating login attempt:", {
    username: req.query.username,
    timestamp: new Date().toISOString(),
  });

  const { username, password } = req.query;

  if (!username || !password) {
    return resp.status(400).json({
      status: false,
      msg: "Username and password are required",
    });
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

    console.log("[AUTH] Login validation result:", {
      username: username,
      found: !!user,
      success: user?.pwd === password,
    });
  } catch (error) {
    console.error("[AUTH] Login validation error:", error.message);
    console.error("Login validation error:", error);
    resp.status(500).json({ status: false, msg: "Internal server error" });
  }
};

export const updatePassword = async (req, resp) => {
  console.log("[AUTH] Password update request:", {
    email: req.body.email,
    timestamp: new Date().toISOString(),
  });

  const { email, currentPassword, newPassword } = req.body;

  if (!email || !currentPassword || !newPassword) {
    return resp.status(400).json({
      status: false,
      msg: "All fields are required",
    });
  }

  try {
    const user = await User.findOne({ user: email });

    if (!user) {
      return resp.status(404).json({
        status: false,
        msg: "User not found",
      });
    }

    if (user.pwd !== currentPassword) {
      return resp.status(401).json({
        status: false,
        msg: "Current password is incorrect",
      });
    }

    await User.findOneAndUpdate(
      { user: email },
      { $set: { pwd: newPassword } },
      { new: true }
    );

    console.log("[AUTH] Password update successful for:", email);
    resp.status(200).json({
      status: true,
      msg: "Password updated successfully",
    });
  } catch (error) {
    console.error("[AUTH] Password update failed:", error.message);
    console.error("Error updating password:", error);
    resp.status(500).json({
      status: false,
      msg: "An error occurred while updating password",
    });
  }
};
