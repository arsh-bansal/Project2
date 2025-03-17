import User from "./model.js";

export const saveLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.json({ status: false, msg: "Username and password are required" });
    }
    
    const existingUser = await User.findOne({ user: username });
    if (existingUser) {
      return res.json({ status: false, msg: "User already exists" });
    }
    
    const newUser = new User({ user: username, pwd: password, role: "franchise" });
    await newUser.save();
    
    return res.json({ status: true, msg: "Login credentials saved successfully" });
  } catch (err) {
    console.error("Error saving login credentials:", err);
    return res.json({ status: false, msg: "Error saving login credentials" });
  }
};

export const validateLogin = async (req, res) => {
  try {
    const { username, password } = req.query;
    
    if (!username || !password) {
      return res.json({ status: false, msg: "Username and password are required" });
    }
    
    const user = await User.findOne({ user: username, pwd: password });
    
    if (!user) {
      return res.json({ status: false, msg: "Invalid username or password" });
    }
    
    return res.json({ 
      status: true, 
      msg: "Login successful", 
      data: { username: user.user, role: user.role } 
    });
  } catch (err) {
    console.error("Error validating login:", err);
    return res.json({ status: false, msg: "Error validating login" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    
    if (!email || !currentPassword || !newPassword) {
      return res.json({ status: false, msg: "All fields are required" });
    }
    
    const user = await User.findOne({ user: email, pwd: currentPassword });
    
    if (!user) {
      return res.json({ status: false, msg: "Invalid current password" });
    }
    
    user.pwd = newPassword;
    await user.save();
    
    return res.json({ status: true, msg: "Password updated successfully" });
  } catch (err) {
    console.error("Error updating password:", err);
    return res.json({ status: false, msg: "Error updating password" });
  }
};
