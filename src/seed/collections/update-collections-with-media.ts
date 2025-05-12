import type { Payload } from 'payload';
import type { SeedArgs } from '../utils';

export const updateCollectionsWithMedia = async (args: Pick<SeedArgs, 'payload' | 'simulatedReq' | 'seededImageIds' | 'serviceVodoinstalacije' | 'serviceMontaza' | 'projectAdaptacija' | 'projectNovogradnja'>): Promise<void> => {
  const { payload, simulatedReq, seededImageIds, serviceVodoinstalacije, serviceMontaza, projectAdaptacija, projectNovogradnja } = args;
  payload.logger.info('--- Updating Collections with Media --- ');

  // --- Update Services with Images ---
  payload.logger.info('Attempting to update Services with images...');
  try {
    if (serviceVodoinstalacije?.id && seededImageIds['gorenje-bojler-vodovodne-napeljave.jpg']) {
      await payload.update({
        collection: 'services',
        id: serviceVodoinstalacije.id,
        data: {
          images: [
            { image: seededImageIds['gorenje-bojler-vodovodne-napeljave.jpg'] },
            ...(seededImageIds['talno-ogrevanje-sistem-namestitev.jpg'] ? [{ image: seededImageIds['talno-ogrevanje-sistem-namestitev.jpg'] }] : []),
          ],
        },
        req: simulatedReq,
      });
      payload.logger.info(`Updated Service '${serviceVodoinstalacije.title}' with images.`);
    }
    if (serviceMontaza?.id && seededImageIds['kopalnica-umivalnik-wc-pralni-stroj.jpg']) {
      await payload.update({
        collection: 'services',
        id: serviceMontaza.id,
        data: {
          images: [
            { image: seededImageIds['kopalnica-umivalnik-wc-pralni-stroj.jpg'] },
            ...(seededImageIds['kopalnica-prha-črna-armatura.jpg'] ? [{ image: seededImageIds['kopalnica-prha-črna-armatura.jpg'] }] : []),
          ],
        },
        req: simulatedReq,
      });
      payload.logger.info(`Updated Service '${serviceMontaza.title}' with images.`);
    }
  } catch (err) {
    payload.logger.error('Error updating Services with images:', err);
  }

  // --- Update Projects with Images ---
  payload.logger.info('Attempting to update Projects with images...');
  try {
    if (projectAdaptacija?.id && seededImageIds['kopalnica-prenova-ploščice-okno.jpg']) {
      await payload.update({
        collection: 'projects',
        id: projectAdaptacija.id,
        data: {
          projectImages: [
            {
              image1: seededImageIds['kopalnica-prenova-ploščice-okno.jpg'],
            },
            ...(seededImageIds['kopalnica-prenova-polaganje-ploščic.jpg'] ? [{
              image1: seededImageIds['kopalnica-prenova-polaganje-ploščic.jpg'],
            }] : []),
             ...(seededImageIds['kopalnica-ploščice-stene-prenova.jpg'] ? [{
              image1: seededImageIds['kopalnica-ploščice-stene-prenova.jpg'],
            }] : []),
          ],
        },
        req: simulatedReq,
      });
      payload.logger.info(`Updated Project '${projectAdaptacija.title}' with images.`);
    }
    if (projectNovogradnja?.id && seededImageIds['hiša-terasa-zunanje-ureditve.jpg']) {
      await payload.update({
        collection: 'projects',
        id: projectNovogradnja.id,
        data: {
          projectImages: [
            {
              image1: seededImageIds['hiša-terasa-zunanje-ureditve.jpg'],
            },
            ...(seededImageIds['talno-ogrevanje-razdelilnik-cevi.jpg'] ? [{
              image1: seededImageIds['talno-ogrevanje-razdelilnik-cevi.jpg'],
            }] : []),
          ],
        },
        req: simulatedReq,
      });
      payload.logger.info(`Updated Project '${projectNovogradnja.title}' with images.`);
    }
  } catch (err) {
    payload.logger.error('Error updating Projects with images:', err);
  }
}; 