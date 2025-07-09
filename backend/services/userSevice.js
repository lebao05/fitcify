const User = require('../models/user');
const cloudinary = require('../configs/cloudinary');
const { uploadToCloudinary } = require('./cloudinaryService');
const extractCloudinaryPublicId = require('../helpers/extractPublicId');

/** ------------------------- PUBLIC API ------------------------- **/

async function getProfileInfo(userId) {
    const me = await User.findById(userId)
        .select('username avatarUrl followees')
        .lean();
    if (!me) throw new Error('USER_NOT_FOUND');

    const followedArtistCount = await User.countDocuments({
        _id: { $in: me.followees },
        role: 'artist',
    });

    return {
        username: me.username,
        avatarUrl: me.avatarUrl,
        followedArtistCount,
    };
}

async function getFollowedArtists(userId) {
    const me = await User.findById(userId).select('followees');
    if (!me || !me.followees.length) return [];

    return User.find({ _id: { $in: me.followees }, role: 'artist' })
        .select('username avatarUrl')
        .sort({ _id: -1 })
        .lean();
}

async function updateProfileInfo(userId, { username }, file) {
    const updates = {};
    if (username?.trim()) updates.username = username.trim();

    /* ---------- avatar upload logic ---------- */
    if (file) {
        // 1️⃣ Upload to Cloudinary – the helper already deletes the temp file.
        const { secure_url, public_id } = await uploadToCloudinary(
            file.path,
            'avatars'
        );

        // 2️⃣ Delete the previous avatar in Cloudinary (if any).
        const { avatarUrl: oldUrl } = await User.findById(userId).select('avatarUrl');
        if (oldUrl) {
            const oldId = extractCloudinaryPublicId(oldUrl);
            if (oldId && oldId !== public_id) await cloudinary.uploader.destroy(oldId, { invalidate: true });
        }

        updates.avatarUrl = secure_url;
    }

    /* ---------- save ---------- */
    const me = await User.findByIdAndUpdate(userId, updates, {
        new: true,
        runValidators: true,
        select: 'username avatarUrl',
    });
    if (!me) throw new Error('USER_NOT_FOUND');

    return { username: me.username, avatarUrl: me.avatarUrl };
}

async function deleteProfileAvatar(userId) {
    const user = await User.findById(userId).select('avatarUrl');
    if (!user) throw new Error('USER_NOT_FOUND');

    if (user.avatarUrl) {
        const id = extractCloudinaryPublicId(user.avatarUrl);
        if (id) await cloudinary.uploader.destroy(id, { invalidate: true });
        user.avatarUrl = '';
        await user.save();
    }
    return '';
}

async function getAccountInfo(userId) {
    const me = await User.findById(userId).select(
        'username email gender dateOfBirth'
    );
    if (!me) throw new Error('USER_NOT_FOUND');
    return me;
}

async function updateAccountInfo(userId, payload) {
    const { email, gender, dateOfBirth } = payload;
    const updates = {};

    if (email) updates.email = email.toLowerCase().trim();
    if (['male', 'female', 'other'].includes(gender)) updates.gender = gender;
    if (dateOfBirth && !Number.isNaN(Date.parse(dateOfBirth)))
        updates.dateOfBirth = new Date(dateOfBirth);

    try {
        const me = await User.findByIdAndUpdate(userId, updates, {
            new: true,
            runValidators: true,
            select: 'username email gender dateOfBirth',
        });
        if (!me) throw new Error('USER_NOT_FOUND');
        return me;
    } catch (err) {
        if (err.code === 11000) throw new Error('EMAIL_DUPLICATE');
        throw err;
    }
}

module.exports = {
    getProfileInfo,
    getFollowedArtists,
    updateProfileInfo,
    deleteProfileAvatar,
    getAccountInfo,
    updateAccountInfo,
};
