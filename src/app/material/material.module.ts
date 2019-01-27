import { MatPaginatorImpl } from './mat-paginator';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatTableModule, MatPaginatorModule, MatSortModule, MatCardModule, MatToolbarModule, MatIconModule, MatFormFieldModule, MatSnackBarModule, MatInputModule, MatMenuModule, MatSidenavModule, MatDividerModule, MatDialogModule, MatSelectModule, MatPaginatorIntl, MatDatepickerModule, MatNativeDateModule, MAT_DATE_LOCALE, MatExpansionModule, MatListModule, MatAutocompleteModule, MatProgressBarModule, MAT_DATE_FORMATS, DateAdapter } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
 

@NgModule({
    imports: [ 
        CommonModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatToolbarModule,
        MatIconModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatMenuModule,
        MatSidenavModule,
        MatDividerModule,
        MatDialogModule,
        MatSortModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatExpansionModule,
        MatListModule,
        MatAutocompleteModule,
        MatProgressBarModule
             ],
    exports: [
        MatButtonModule,
        MatTableModule, 
        MatPaginatorModule,
        MatSortModule,
        MatToolbarModule,
        MatIconModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatMenuModule,
        MatSidenavModule,
        MatDividerModule,
        MatDialogModule,
        MatSortModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatExpansionModule,
        MatListModule,
        MatAutocompleteModule,
        MatProgressBarModule
    ],
    providers: [
        { provide: MatPaginatorIntl, useClass: MatPaginatorImpl },
        { provide: MAT_DATE_LOCALE, useValue: 'es' }
    ]
})
export class MaterialModule {}