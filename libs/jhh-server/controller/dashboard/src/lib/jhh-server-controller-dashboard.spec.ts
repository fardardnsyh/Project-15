import { JhhServerControllerDashboard } from './jhh-server-controller-dashboard';

import { JhhServerDb } from '@jhh/jhh-server/db';

import { HttpStatusCode } from '@jhh/shared/domain';

import { createJWT } from '@jhh/jhh-server/shared/utils';

jest.mock('@jhh/jhh-server/db', () => ({
  JhhServerDb: jest.fn().mockReturnValue({
    user: {
      findUnique: jest.fn().mockResolvedValue({}),
    },
    notesGroup: {
      findMany: jest.fn().mockResolvedValue([]),
    },
    boardColumn: {
      findMany: jest.fn().mockResolvedValue([]),
    },
    offer: {
      findMany: jest.fn().mockResolvedValue([]),
    },
    scheduleEvent: {
      findMany: jest.fn().mockResolvedValue([]),
    },
    quiz: {
      findMany: jest.fn().mockResolvedValue([]),
    },
  }),
}));

jest.mock('@jhh/jhh-server/shared/utils', () => ({
  createJWT: jest.fn().mockReturnValue('newToken'),
  respondWithError: jest.fn(),
}));

describe('JhhServerControllerDashboard - loadAssignedData', () => {
  const { loadAssignedData } = JhhServerControllerDashboard();
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      user: { id: 1 },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should ensure all database calls are made for the user', async () => {
    await loadAssignedData(req, res);

    const prisma = JhhServerDb();

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(prisma.notesGroup.findMany).toHaveBeenCalledWith({
      where: { userId: 1 },
      include: { notes: true },
    });
    expect(prisma.boardColumn.findMany).toHaveBeenCalledWith({
      where: { userId: 1, isTemporary: false },
      orderBy: { order: 'asc' },
      include: { items: { orderBy: { order: 'asc' } } },
    });
    expect(prisma.offer.findMany).toHaveBeenCalledWith({
      where: { userId: 1 },
    });
    expect(prisma.scheduleEvent.findMany).toHaveBeenCalledWith({
      where: { userId: 1 },
    });
    expect(prisma.quiz.findMany).toHaveBeenCalledWith({
      where: { userId: 1 },
      include: { results: true },
    });

    expect(createJWT).toHaveBeenCalledWith(
      expect.any(Object),
      process.env.JWT_SECRET
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(res.json).toHaveBeenCalledWith(expect.any(Object));
  });
});
