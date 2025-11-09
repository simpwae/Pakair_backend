import User from '../models/User.js';

const DEFAULT_OFFICIAL_EMAIL = process.env.DEFAULT_OFFICIAL_EMAIL || 'naqashamjad777@gmail.com';
const DEFAULT_OFFICIAL_PASSWORD = process.env.DEFAULT_OFFICIAL_PASSWORD || '5712345';
const DEFAULT_OFFICIAL_FIRST_NAME = process.env.DEFAULT_OFFICIAL_FIRST_NAME || 'Developer';
const DEFAULT_OFFICIAL_LAST_NAME = process.env.DEFAULT_OFFICIAL_LAST_NAME || 'Official';
const DEFAULT_OFFICIAL_PHONE = process.env.DEFAULT_OFFICIAL_PHONE || '0000000000';

export const seedDefaultOfficial = async () => {
  try {
    const existingUser = await User.findOne({ email: DEFAULT_OFFICIAL_EMAIL.toLowerCase() }).select('+password');

    if (!existingUser) {
      await User.create({
        firstName: DEFAULT_OFFICIAL_FIRST_NAME,
        lastName: DEFAULT_OFFICIAL_LAST_NAME,
        email: DEFAULT_OFFICIAL_EMAIL.toLowerCase(),
        phone: DEFAULT_OFFICIAL_PHONE,
        password: DEFAULT_OFFICIAL_PASSWORD,
        role: 'official',
        agreeToTerms: true,
        isVerified: true,
      });

      console.log('Default official account created:', DEFAULT_OFFICIAL_EMAIL);
      return;
    }

    let shouldSave = false;

    if (existingUser.role !== 'official') {
      existingUser.role = 'official';
      shouldSave = true;
    }

    if (!existingUser.isActive) {
      existingUser.isActive = true;
      shouldSave = true;
    }

    if (existingUser.password) {
      const bcrypt = (await import('bcryptjs')).default;
      const isMatch = await bcrypt.compare(DEFAULT_OFFICIAL_PASSWORD, existingUser.password);
      if (!isMatch) {
        existingUser.password = DEFAULT_OFFICIAL_PASSWORD;
        shouldSave = true;
      }
    }

    if (!existingUser.agreeToTerms) {
      existingUser.agreeToTerms = true;
      shouldSave = true;
    }

    if (!existingUser.firstName || existingUser.firstName === 'Citizen') {
      existingUser.firstName = DEFAULT_OFFICIAL_FIRST_NAME;
      shouldSave = true;
    }

    if (!existingUser.lastName || existingUser.lastName === 'User') {
      existingUser.lastName = DEFAULT_OFFICIAL_LAST_NAME;
      shouldSave = true;
    }

    if (!existingUser.phone) {
      existingUser.phone = DEFAULT_OFFICIAL_PHONE;
      shouldSave = true;
    }

    if (shouldSave) {
      await existingUser.save();
      console.log('Default official account updated:', DEFAULT_OFFICIAL_EMAIL);
    }
  } catch (error) {
    console.error('Error seeding default official account:', error.message);
  }
};

export default seedDefaultOfficial;

