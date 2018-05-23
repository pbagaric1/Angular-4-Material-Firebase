import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { DataTablesModule } from 'angular-datatables';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DetailsComponent } from './details/details.component';

import { MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule,
   MatPaginatorModule, MatDialogModule, MatIconModule, MatButtonModule, MatToolbarModule, MatCheckboxModule, MatSelectModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule  } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AddModalComponent } from './modals/add-modal/add-modal.component';
import { DeleteModalComponent } from './modals/delete-modal/delete-modal.component';
import { EditModalComponent } from './modals/edit-modal/edit-modal.component';
import { TaskService } from './services/task.service';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    DetailsComponent,
    AddModalComponent,
    DeleteModalComponent,
    EditModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    DataTablesModule,
    AppRoutingModule,
    MatTableModule,
    HttpClientModule,
    MatSortModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatSelectModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase, 'flipkod'),
        AngularFireDatabaseModule
  ],
  providers: [DatePipe, TaskService],
  entryComponents: [
    AddModalComponent,
    DeleteModalComponent,
    EditModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
