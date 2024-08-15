import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { OffersComponent } from './offers.component';

describe('OffersComponent', () => {
  let component: OffersComponent;
  let fixture: ComponentFixture<OffersComponent>;
  let mockActivatedRoute;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockActivatedRoute = {
      queryParams: of({}),
    };

    await TestBed.configureTestingModule({
      imports: [OffersComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();

    fixture = TestBed.createComponent(OffersComponent);
    component = fixture.componentInstance;
    component.extendedOffers = [
      {
        id: '1',
        position: 'Frontend Developer',
        slug: 'frontend-developer-tech-inc',
        company: 'Tech Inc.',
      },
    ] as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display offers if provided', () => {
    fixture.detectChanges();
    const offerElements = fixture.nativeElement.querySelectorAll('li');
    expect(offerElements.length).toBeGreaterThan(0);
    expect(offerElements[0].textContent).toContain('Frontend Developer');
  });

  it('should display "No offers found." if offers are empty', () => {
    component.extendedOffers = [];
    fixture.detectChanges();

    const emptyListText =
      fixture.nativeElement.querySelector('.box p').textContent;
    expect(emptyListText).toContain('No offers found.');
  });

  it('should display "Add offer" link if no offers are provided', () => {
    component.extendedOffers = [];
    fixture.detectChanges();

    const addOfferLink = fixture.nativeElement.querySelector('.seeMore a');
    expect(addOfferLink.textContent).toContain('Add offer');
  });

  it('should display "See more" link if offers are provided', () => {
    component.extendedOffers = [
      {
        id: '1',
        position: 'Backend Developer',
        company: 'Code World',
        slug: 'backend-developer-code-world',
      },
    ] as any;
    fixture.detectChanges();

    const seeMoreLink = fixture.nativeElement.querySelector('.seeMore a');
    expect(seeMoreLink.textContent).toContain('See more');
  });
});
