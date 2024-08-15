import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { JhhClientDashboardBoardComponent } from './jhh-client-dashboard-board.component';

import { BoardFacade } from '@jhh/jhh-client/dashboard/board/data-access';

describe('JhhClientDashboardBoardComponent', () => {
  let component: JhhClientDashboardBoardComponent;
  let fixture: ComponentFixture<JhhClientDashboardBoardComponent>;
  let mockBoardFacade: Partial<BoardFacade>;
  let mockActions$;
  let mockMatSnackBar: jest.Mocked<MatSnackBar>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockBoardFacade = {
      addBoardColumnSuccess$: of(false),
      editBoardColumnSuccess$: of(false),
      boardColumns$: of([
        { id: '1', name: 'Test Column', items: [], color: '#FF0000' },
      ]),
    } as unknown as Partial<BoardFacade>;

    mockActions$ = of({ type: '[Board] Update Board Columns Success' });

    mockMatSnackBar = {
      open: jest.fn(),
    } as unknown as jest.Mocked<MatSnackBar>;

    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardBoardComponent],
      providers: [
        { provide: Actions, useValue: mockActions$ },
        { provide: BoardFacade, useValue: mockBoardFacade },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update isSaving$ and wasUpdateTriggeredByColumnsComponent$ based on actions', (done) => {
    component.isSaving$.subscribe((isSaving) => {
      expect(isSaving).toBeFalsy();
      done();
    });
    component.wasUpdateTriggeredByColumnsComponent$.subscribe(
      (triggeredByComponent) => {
        expect(triggeredByComponent).toBeTruthy();
      }
    );
  });

  it('should display "No columns found." message when boardColumns array is empty', () => {
    mockBoardFacade.boardColumns$ = of([]);

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const messageElement: HTMLElement =
        fixture.nativeElement.querySelector('p');
      expect(messageElement).not.toBeNull();
      expect(messageElement.textContent).toContain('No columns found.');
    });
  });
});
