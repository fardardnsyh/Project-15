import { Offer, PrismaClient } from '@prisma/client';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { HttpStatusCode } from '@jhh/shared/domain';

import { JhhServerDb } from '@jhh/jhh-server/db';

const removeOffers = async (req: any, res: any): Promise<void> => {
  const prisma: PrismaClient = JhhServerDb();

  try {
    let { offersId } = req.query;
    const userId = req.user.id;

    offersId = Array.isArray(offersId) ? offersId : [offersId];

    if (!offersId || offersId.length === 0) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Array of offers ID is required.'
      );
    }

    const offers: Offer[] = await prisma.offer.findMany({
      where: { id: { in: offersId }, userId: userId },
    });

    if (offers.length !== offersId.length) {
      return respondWithError(
        res,
        HttpStatusCode.NotFound,
        'One or more offers not found or not owned by the user'
      );
    }

    await prisma.offer.deleteMany({
      where: { id: { in: offersId }, userId: userId },
    });

    res.status(HttpStatusCode.OK).json({ data: { removedOffers: offers } });
  } catch (error) {
    console.error(error);
    return respondWithError(
      res,
      HttpStatusCode.InternalServerError,
      'Internal Server Error'
    );
  }
};

export default removeOffers;
