import webpush from 'web-push';

const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;

if (publicKey && privateKey) {
  try {
    webpush.setVapidDetails(
      'mailto:contato@negocios.ninja',
      publicKey,
      privateKey
    );
  } catch (err) {
    console.error('Failed to set VAPID details:', err);
  }
}

export default webpush;

