import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../core/services/profile.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ProfileComponent implements OnInit {
  private profileService = inject(ProfileService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  profileForm!: FormGroup;
  isEditing = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  currentUser = this.profileService.currentUser;

  ngOnInit(): void {
    this.initializeForm();
    this.loadUserProfile();
  }

  /**
   * Initialiser le formulaire
   */
  private initializeForm(): void {
    this.profileForm = this.formBuilder.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
    this.profileForm.disable();
  }

  /**
   * Charger le profil utilisateur
   */
  private loadUserProfile(): void {
    const user = this.profileService.getCurrentUser();
    if (user) {
      this.profileForm.patchValue({
        nom: user.nom,
        prenom: user.prenom,
        email: user.email
      });
    }
  }

  /**
   * Activer le mode édition
   */
  enableEditing(): void {
    this.isEditing.set(true);
    this.profileForm.enable();
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  /**
   * Annuler l'édition
   */
  cancelEditing(): void {
    this.isEditing.set(false);
    this.profileForm.disable();
    this.loadUserProfile();
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  /**
   * Sauvegarder les modifications
   */
  saveChanges(): void {
    if (this.profileForm.invalid) {
      this.errorMessage.set('Veuillez remplir correctement tous les champs');
      return;
    }

    const user = this.currentUser();
    if (!user || !user.id) {
      this.errorMessage.set('Utilisateur non trouvé');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const updatedData = this.profileForm.getRawValue();

    this.profileService.updateProfile(user.id, updatedData).subscribe({
      next: (updatedUser) => {
        this.profileService.updateLocalUser(updatedUser);
        this.isEditing.set(false);
        this.profileForm.disable();
        this.isLoading.set(false);
        this.successMessage.set('Profil mis à jour avec succès');
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set('Erreur lors de la mise à jour du profil');
        console.error('Erreur:', error);
      }
    });
  }

  /**
   * Naviguer vers le dashboard
   */
  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
