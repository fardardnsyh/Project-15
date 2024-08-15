import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { TableComponent } from './table.component';

import { OffersFacade } from '@jhh/jhh-client/dashboard/offers/data-access';
import { QueryParamsService } from '@jhh/jhh-client/dashboard/data-access';

import {
  OfferCompanyType,
  OfferLocation,
  OfferPriority,
  OfferSalaryCurrency,
  OfferStatus,
} from '@jhh/shared/domain';
import { SimpleChange } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { GetOfferStatusIcon } from '@jhh/jhh-client/dashboard/offers/util-get-offer-status-icon';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let mockActivatedRoute;
  let mockOffersFacade: any;
  let mockQueryParamsService: any;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockActivatedRoute = {
      queryParams: of({}),
      snapshot: {
        queryParamMap: convertToParamMap({
          filter: '',
          sort: ',',
          page: '1',
          per_page: '15',
        }),
      },
    };

    mockOffersFacade = {
      removeOffersSuccess$: of(false),
    };

    mockQueryParamsService = {
      getAllQueryParams$: jest.fn(() => of({})),
      updateCurrentFilter: jest.fn(),
      updateCurrentSort: jest.fn(),
      updateCurrentPage: jest.fn(),
      updateCurrentPerPage: jest.fn(),
      updateQueryParams: jest.fn(),
      setFromCurrentRoute: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TableComponent, NoopAnimationsModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: OffersFacade, useValue: mockOffersFacade },
        { provide: QueryParamsService, useValue: mockQueryParamsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    component.offers = [
      {
        position: 'Frontend Developer',
        link: 'http://example.com/frontend',
        company: 'Tech Solutions',
        companyType: OfferCompanyType.SoftwareHouse,
        location: OfferLocation.Remote,
        status: OfferStatus.Applied,
        priority: OfferPriority.High,
        minSalary: 11500,
        maxSalary: 16000,
        salaryCurrency: OfferSalaryCurrency.PLN,
        email: 'hr@example.com',
        description: 'description',
      },
    ] as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update dataSource when offers input changes', () => {
    const newOffers = [
      {
        id: '2',
        slug: 'backend-developer',
        position: 'Backend Developer',
        link: 'http://example.com/backend',
        company: 'Tech Solutions',
        companyType: OfferCompanyType.Product,
        location: OfferLocation.Remote,
        status: OfferStatus.Rejected,
        statusIcon: 'cancel',
        priority: OfferPriority.Medium,
        minSalary: 11500,
        maxSalary: 16000,
        salaryCurrency: OfferSalaryCurrency.PLN,
        email: 'hr@example.com',
        description: 'description',
      },
    ] as any;
    component['offers'] = newOffers;
    component.ngOnChanges({
      offers: new SimpleChange(null, newOffers, true),
    });

    fixture.detectChanges();

    expect(component.dataSource.data).toEqual(newOffers);
  });

  it('should apply filter correctly', () => {
    const filterValue = 'test';
    component.applyFilter(filterValue);
    expect(component.dataSource.filter).toBe(filterValue.trim().toLowerCase());
  });

  it('should toggle selection correctly', () => {
    component.dataSource.data = [component.offers[0] as any];
    component.toggleAllOnCurrentPage();
    expect(component.selection.isSelected(component.offers[0])).toBeTruthy();
  });

  it('should handle page event correctly', () => {
    fixture.detectChanges();
    const mockEvent: PageEvent = { pageIndex: 1, pageSize: 5, length: 10 };
    component.handlePaginator(mockEvent);
    expect(component['paginator'].pageIndex).toBe(mockEvent.pageIndex - 1);
  });

  it('should handle sort changes correctly', () => {
    const sortEvent: Sort = { active: 'position', direction: 'asc' };
    component.handleSort(sortEvent);
    expect(component.dataSource.sort!.active).toBe(sortEvent.active);
    expect(component.dataSource.sort!.direction).toBe(sortEvent.direction);
  });

  it('should react to changes in @Input() offers', () => {
    const newOffers = [
      {
        id: '2',
        slug: 'backend-developer',
        position: 'Backend Developer',
        link: 'http://example.com/backend',
        company: 'Tech Solutions',
        companyType: OfferCompanyType.Product,
        location: OfferLocation.Remote,
        status: OfferStatus.Rejected,
        statusIcon: 'cancel',
        priority: OfferPriority.Medium,
        minSalary: 11500,
        maxSalary: 16000,
        salaryCurrency: OfferSalaryCurrency.PLN,
        email: 'hr@example.com',
        description: 'description',
      },
    ] as any;
    component.offers = newOffers;
    component.ngOnChanges({
      offers: new SimpleChange(null, newOffers, false),
    });
    fixture.detectChanges();

    expect(component.dataSource.data).toEqual(
      newOffers.map((offer: any) => ({
        ...offer,
        statusIcon: GetOfferStatusIcon(offer.status),
      }))
    );
  });

  it('should select all offers when toggleAllOnCurrentPage is called', () => {
    component.toggleAllOnCurrentPage();
    const allSelected = component.dataSource.data.every((row) =>
      component.selection.isSelected(row)
    );
    expect(allSelected).toBe(true);
  });

  it('should call removeOffersDialogService.openDialog when removeSelectedOffers is called with selected offers', async () => {
    const mockOfferData = { id: 1, position: 'Mock Offer' } as any;

    component.selection.select(mockOfferData);

    component['removeOffersDialogService'].openDialog = jest.fn();

    component.removeSelectedOffers();

    expect(
      component['removeOffersDialogService'].openDialog
    ).toHaveBeenCalledWith([mockOfferData]);
  });

  it('should clear selection on successful offer removal', () => {
    mockOffersFacade.removeOffersSuccess$ = of(true);
    component['handleRemoveSuccess']();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(component.selection.isEmpty()).toBe(true);
    });
  });
});
