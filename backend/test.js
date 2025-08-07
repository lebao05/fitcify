// seedThreePlays.js
require('dotenv').config();
const mongoose      = require('mongoose');
const PlayHistory   = require('./models/playHistory');
const Song          = require('./models/song');
const ArtistProfile = require('./models/artistProfile');
const User          = require('./models/user');

const MONGO_URI = process.env.MONGO_URI 
  || 'mongodb+srv://lgbaowork05:BvBcVHx0wOqfY2YL@cluster0.m4t6v.mongodb.net/fitcify-project';

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

  const songs = await Song.find({ isApproved: true }).limit(3).lean();
  if (!songs.length) {
    console.error('No approved songs to seed');
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log(`Seeding plays for user ${userId}: ${songs.map(s => s.title).join(', ')}`);

  const now = Date.now();
  for (let i = 0; i < songs.length; i++) {
    const song = songs[i];
    const playedAt = new Date(now - i * 60 * 1000); // stagger by minute

    // 1) record the song play
    await PlayHistory.create({
      userId:    user._id,
      itemType:  'song',
      itemId:    song._id,
      playCount: 1,
      playedAt
    });

    // 2) record the artist play
    if (song.artistId) {
      await PlayHistory.create({
        userId:    user._id,
        itemType:  'artist',
        itemId:    song.artistId,
        playCount: 1,
        playedAt
      });
    }

    // 3) bump song.playCount
    await Song.findByIdAndUpdate(song._id, { $inc: { playCount: 1 } });

    // 4) bump artist totalPlays
    if (song.artistId) {
      await ArtistProfile.findOneAndUpdate(
        { userId: song.artistId },
        { $inc: { totalPlays: 1 } },
        { upsert: true }
      );
    }

    console.log(`  • ${song.title} @ ${playedAt.toISOString()}`);
  }

  // show last few history entries
  const recent = await PlayHistory.find({ userId: user._id })
    .sort({ playedAt: -1 })
    .limit(6)
    .lean();
  console.log('Recent history:', recent);

  await mongoose.disconnect();
  console.log('Seeding complete.');
}

// execute
const [, , userId] = process.argv;
if (!userId) {
  console.error('Usage: node seedThreePlays.js <userId>');
  process.exit(1);
}
seed(userId).catch(err => {
  console.error('Error during seed:', err);
  process.exit(1);
});
