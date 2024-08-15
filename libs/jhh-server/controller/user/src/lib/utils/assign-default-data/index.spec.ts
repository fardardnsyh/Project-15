import * as JhhServerDbModule from '@jhh/jhh-server/db';
import assignDefaultData from '.';

jest.mock('@jhh/jhh-server/db', () => ({
  JhhServerDb: jest.fn().mockReturnValue({
    notesGroup: {
      create: jest.fn(),
    },
    boardColumn: {
      create: jest.fn(),
    },
    offer: {
      create: jest.fn(),
    },
    scheduleEvent: {
      create: jest.fn(),
    },
    quiz: {
      create: jest.fn(),
    },
  }),
}));

describe('assignDefaultData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls the correct Prisma methods to assign default data', async () => {
    const userId = 'testUserId';

    const prismaClientMock = JhhServerDbModule.JhhServerDb();

    await assignDefaultData(userId);

    expect(prismaClientMock.notesGroup.create).toHaveBeenCalled();
    expect(prismaClientMock.boardColumn.create).toHaveBeenCalled();
    expect(prismaClientMock.offer.create).toHaveBeenCalled();
    expect(prismaClientMock.scheduleEvent.create).toHaveBeenCalled();
    expect(prismaClientMock.quiz.create).toHaveBeenCalled();
  });
});
