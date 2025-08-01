// seedThreePlays.js
require('dotenv').config();
const mongoose = require('mongoose');
const PlayHistory = require('./models/playHistory');
const Song = require('./models/song');
const ArtistProfile = require('./models/artistProfile');
const User = require('./models/user');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://lgbaowork05:BvBcVHx0wOqfY2YL@cluster0.m4t6v.mongodb.net/fitcify-project'; // adjust if needed

async function seed(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid userId');
  }

  await mongoose.connect(MONGO_URI, {});

  const user = await User.findById(userId);
  if (!user) {
    console.error('User not found:', userId);
    process.exit(1);
  }

  // pick 3 approved songs (or fewer if not available)
  const songs = await Song.find({ isApproved: true }).limit(3).lean();
  if (!songs || songs.length === 0) {
    console.error('No approved songs to seed');
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log(`Seeding ${songs.length} plays for user ${userId}`);

  const now = Date.now();
  for (let i = 0; i < songs.length; i++) {
    const song = songs[i];

    // Create play history with slight time offset so ordering is preserved
    const playedAt = new Date(now - i * 1000 * 60); // each one minute earlier

    // Record history
    await PlayHistory.create({
      userId: user._id,
      itemType: 'song',
      itemId: song._id,
      playedAt,
    });

    // Increment song playCount
    await Song.findByIdAndUpdate(song._id, { $inc: { playCount: 1 } });

    // Increment artist totalPlays
    if (song.artistId && mongoose.Types.ObjectId.isValid(song.artistId)) {
      await ArtistProfile.findOneAndUpdate(
        { userId: song.artistId },
        { $inc: { totalPlays: 1 } },
        { upsert: true }
      );
    }

    console.log(`- Recorded play for song "${song.title}" at ${playedAt.toISOString()}`);
  }

  // Show recent history for verification
  const recent = await PlayHistory.find({ userId: user._id, itemType: 'song' })
    .sort({ playedAt: -1 })
    .limit(5)
    .lean();

  console.log('Recent history:', recent);

  await mongoose.disconnect();
}

const [,, userId] = process.argv;
if (!userId) {
  console.error('Usage: node seedThreePlays.js <userId>');
  process.exit(1);
}

seed(userId)
  .then(() => {
    console.log('Seeding complete.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
  });
