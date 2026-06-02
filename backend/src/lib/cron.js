import cron from 'node-cron';
import fetch from 'node-fetch';

const job = cron.schedule('*/14 * * * *', async () => {
  try {
    const response = await fetch(process.env.API_URL);
    console.log('Ping serveur OK — statut :', response.status);
  } catch (error) {
    console.error('Ping échoué :', error.message);
  }
});

export default job;
