-- Manual migration for existing users
-- Run this if you have existing users without the name field
-- This sets a default name based on email prefix

-- For MongoDB, you'll need to update via MongoDB shell or Compass:
db.User.updateMany(
  { name: { $exists: false } },
  [
    {
      $set: {
        name: {
          $replaceAll: {
            input: { $arrayElemAt: [{ $split: ["$email", "@"] }, 0] },
            find: ".",
            replacement: " "
          }
        }
      }
    }
  ]
)
