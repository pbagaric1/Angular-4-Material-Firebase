import { getTestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatSort, MatSortable, MatTableDataSource, MatFormField, MatPaginator, MatDialog } from '@angular/material';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Task } from '../models/task.model';
import { AddModalComponent } from '../modals/add-modal/add-modal.component';
import { TaskService } from '../services/task.service';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { DeleteModalComponent } from '../modals/delete-modal/delete-modal.component';
import { EditModalComponent } from '../modals/edit-modal/edit-modal.component';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { BehaviorSubject, Observable } from 'rxjs';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('filter') filter: ElementRef;

  selection = new SelectionModel<Element>(true, []);
  displayedColumns = ['select', 'id', 'name', 'description', 'timeOfCreation', 'actions'];
  dataSource: ExampleDataSource | null;
  exampleDatabase: TaskService | null;
  itemsPerPage = 5;

  constructor(public dialog: MatDialog, public taskService: TaskService,
    public database: AngularFireDatabase, private httpClient: HttpClient) { }

  ngOnInit() {

    this.exampleDatabase = new TaskService(this.httpClient, this.database);
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });

  }
    /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    if (!this.dataSource) { return false; }
    if (this.selection.isEmpty()) { return false; }

    if (this.filter.nativeElement.value) {
      return this.selection.selected.length == this.dataSource.renderedData.length;
    }
    else {
      const numSelected = this.selection.selected.length;
      const numRows = this.exampleDatabase.data.length;
      return numSelected === numRows;
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.exampleDatabase.data.forEach(row => this.selection.select(row));
  }


  addNewTask() {
    /**Open modal for new task */
    const dialogRef = this.dialog.open(AddModalComponent)

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        /** After modal is closed update pagination and filtering */
        this.refreshTable();
      }
    });
  }

  deleteTask() {
    if (this.selection.hasValue()) {
      console.log(this.selection);
      const dialogRef = this.dialog.open(DeleteModalComponent);

      dialogRef.afterClosed().subscribe(result => {
        if (result === 1) {
          console.log(this.selection.selected);

          for (let i = 0; i < this.selection.selected.length; i++) {
            let selectedTask: any = this.selection.selected[i];
            this.taskService.deleteTask(selectedTask.key);
          }
          this.selection.clear();
          this.refreshTable();
        }
      });
    }

  }

  editTask(key: string, id: string, name: string, description: string, timeOfCreation: string) {
    const dialogRef = this.dialog.open(EditModalComponent, {
      /**Pass task data to the edit modal */
      data: { key: key, id: id, name: name, description: description, timeOfCreation: timeOfCreation }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.refreshTable();
      }
    });
  }

  /**Pass selected task to the service which holds the reference to selected task so it can be passed to other components */
  onDetails(task: any) {
    this.taskService.onChangeTask(task);
  }

  /**Return to previous page if there are no tasks on the current page + update filter */
  private refreshTable() {
    if (this.dataSource.filteredData.length <= this.itemsPerPage && this.dataSource._paginator.hasPreviousPage()) {
    } else {
      this.dataSource.filter = '';
      this.dataSource.filter = this.filter.nativeElement.value;
    }
  }
}

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class ExampleDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: Task[] = [];
  renderedData: Task[] = [];

  constructor(public _exampleDatabase: TaskService,
    public _paginator: MatPaginator,
    public _sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Task[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];


    this._exampleDatabase.getTasks();

    return Observable.merge(...displayDataChanges).map(() => {
      // Filter data
      this.filteredData = this._exampleDatabase.data.slice().filter((task: any) => {
        const searchStr = (task.data.id + task.data.name + task.data.description + task.data.timeOfCreation).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });

      // Sort filtered data
      const sortedData = this.sortData(this.filteredData.slice());

      // Grab the page's slice of the filtered sorted data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
      return this.renderedData;
    });
  }
  disconnect() {
  }

  /** Returns a sorted copy of the database data. */
  sortData(data: Task[]): Task[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'name': [propertyA, propertyB] = [a.name, b.name]; break;
        case 'description': [propertyA, propertyB] = [a.description, b.description]; break;
        case 'timeOfCreation': [propertyA, propertyB] = [a.timeOfCreation, b.timeOfCreation]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}