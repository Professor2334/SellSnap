'use server';

import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function updateSettings(data: any) {
  try {
    const session = await getSession();
    if (!session || !session.user || !session.user.email) {
      return { success: false, error: 'Unauthorized' };
    }

    const {
      name, email, phone,
      businessName, businessDescription, supportEmail, supportPhone, businessAddress,
      notifyOrderReceived, notifyPaymentSuccess, notifyWelcome, notifyProductUpdates, notifyMarketing,
      currency, timeZone, dateFormat
    } = data;

    const user = await db.user.update({
      where: { email: session.user.email },
      data: {
        name,
        email,
        phone,
        businessName,
        businessDescription,
        supportEmail,
        supportPhone,
        businessAddress,
        notifyOrderReceived,
        notifyPaymentSuccess,
        notifyWelcome,
        notifyProductUpdates,
        notifyMarketing,
        currency,
        timeZone,
        dateFormat,
      },
    });

    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard');

    return { success: true, data: user };
  } catch (error) {
    console.error('Error updating settings:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return { success: false, error: 'That email address is already in use.' };
      }
    }
    return { success: false, error: 'Failed to update settings.' };
  }
}

export async function updateProfileImage(imageUrl: string) {
  try {
    const session = await getSession();
    if (!session || !session.user || !session.user.email) {
      return { success: false, error: 'Unauthorized' };
    }

    const user = await db.user.update({
      where: { email: session.user.email },
      data: { image: imageUrl },
    });

    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard');

    return { success: true, data: user };
  } catch (error) {
    console.error('Error updating profile image:', error);
    return { success: false, error: 'Failed to update profile image.' };
  }
}

export async function updateBusinessLogo(logoUrl: string) {
  try {
    const session = await getSession();
    if (!session || !session.user || !session.user.email) {
      return { success: false, error: 'Unauthorized' };
    }

    const user = await db.user.update({
      where: { email: session.user.email },
      data: { businessLogo: logoUrl },
    });

    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard');

    return { success: true, data: user };
  } catch (error) {
    console.error('Error updating business logo:', error);
    return { success: false, error: 'Failed to update business logo.' };
  }
}

export async function disconnectGoogle() {
  try {
    const session = await getSession();
    if (!session || !session.user || !session.user.id) {
      return { success: false, error: 'Unauthorized' };
    }

    await db.account.deleteMany({
      where: {
        userId: session.user.id,
        provider: 'google',
      },
    });

    revalidatePath('/dashboard/settings');
    return { success: true, data: null };
  } catch (error) {
    console.error('Error disconnecting Google:', error);
    return { success: false, error: 'Failed to disconnect Google account.' };
  }
}

export async function signOutAllDevices() {
  try {
    const session = await getSession();
    if (!session || !session.user || !session.user.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // Keep the current session if possible, but simplest is to delete all.
    await db.session.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    return { success: true, data: null };
  } catch (error) {
    console.error('Error signing out of all devices:', error);
    return { success: false, error: 'Failed to sign out of devices.' };
  }
}
