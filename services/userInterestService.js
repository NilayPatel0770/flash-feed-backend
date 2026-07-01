const User = require("../models/User");

const updateUserInterest = async (userId, category) => {

    const user = await User.findById(userId);

    if (!user) return;

    const existing = user.preferredCategories.find(
        item => item.category === category
    );

    if (existing) {

        existing.score += 1;

    } else {

        user.preferredCategories.push({
            category,
            score: 1
        });

    }

    await user.save();

};

module.exports = {
    updateUserInterest
};