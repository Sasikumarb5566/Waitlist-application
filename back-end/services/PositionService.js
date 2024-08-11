const User = require("../models/User");

const generatePosition = async (user) => {
  try {
    const lastUser = await User.findOne()
      .sort({ position: -1 })
      .select("position");
    user.position = lastUser ? lastUser.position + 1 : 99;
  } catch (error) {
    console.error("Error generating position:", error);
    throw new Error("Failed to generate position");
  }
};

const findMinPosition = async () => {
  try {
    const minPositionResult = await User.findOne()
      .sort({ position: 1 })
      .select("position");
    const minPosition = minPositionResult ? minPositionResult.position : 99;
    return minPosition;
  } catch (error) {
    console.error("Error finding minimum position:", error);
    throw new Error("Failed to find minimum position");
  }
};

const updatePosition = async () => {
  try {
    const minPosition = await findMinPosition();
    let position = Number(minPosition);

    const users = await User.find().sort({ referrals: -1, createdAt: 1 });

    for (const user of users) {
      user.position = position++;
      if (isNaN(user.position)) {
        user.position = 99;
      }
      await user.save();
    }
  } catch (error) {
    console.error("Error updating user positions:", error);
  }
};

module.exports = {
  generatePosition,
  updatePosition,
};
