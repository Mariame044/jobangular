import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterJeuDeRoleComponent } from './ajouter-jeu-de-role.component';

describe('AjouterJeuDeRoleComponent', () => {
  let component: AjouterJeuDeRoleComponent;
  let fixture: ComponentFixture<AjouterJeuDeRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterJeuDeRoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouterJeuDeRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
