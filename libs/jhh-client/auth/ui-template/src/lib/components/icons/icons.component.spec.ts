import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconsComponent } from './icons.component';
import { By } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

describe('IconsComponent', () => {
  let component: IconsComponent;
  let fixture: ComponentFixture<IconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconsComponent, HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(IconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call registerIcons on ngOnInit', () => {
    const registerIconsSpy = jest.spyOn(component as any, 'registerIcons');
    component.ngOnInit();
    expect(registerIconsSpy).toHaveBeenCalled();
  });

  it('should render icons if icons array is not empty', () => {
    fixture.detectChanges();

    const iconList = fixture.debugElement.queryAll(By.css('.icons mat-icon'));
    expect(iconList.length).toBe(component.icons.length);
  });

  it('should not render icons if icons array is empty', () => {
    component.icons = [];
    fixture.detectChanges();
    const iconList = fixture.debugElement.query(By.css('.icons'));
    expect(iconList).toBeNull();
  });
});
