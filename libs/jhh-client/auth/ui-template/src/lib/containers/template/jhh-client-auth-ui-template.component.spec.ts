import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClientModule } from '@angular/common/http';

import { JhhClientAuthUiTemplateComponent } from './jhh-client-auth-ui-template.component';

describe('JhhClientAuthUiTemplateComponent', () => {
  let component: JhhClientAuthUiTemplateComponent;
  let fixture: ComponentFixture<JhhClientAuthUiTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatDividerModule,
        JhhClientAuthUiTemplateComponent,
        HttpClientModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientAuthUiTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
