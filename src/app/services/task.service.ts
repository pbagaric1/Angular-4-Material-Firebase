import { DataService } from './data.service';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class TaskService implements OnInit {

  taskValue: any;
  private taskSource = new BehaviorSubject<any>(this.taskValue);
  /**Observable for the selected task */
  currentTask = this.taskSource.asObservable();

  tasksRef: AngularFireList<any>;
  tasks: Observable<any[]>;

  dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  // Temporarily stores data from dialogs
  dialogData: any;

  constructor(private httpClient: HttpClient, private database: AngularFireDatabase) {
    /**Get all tasks from firebase database */
    this.tasksRef = this.database.list('/data');
  }

  get data(): any[] {
    return this.dataChange.value;
  }

  /**Update selected task */
  onChangeTask(task: any) {
    this.taskSource.next(task);
  }

  ngOnInit() {
    //this.getTasks();
  }

  getDialogData() {
    return this.dialogData;
  }

  getTasks() {
    /**Get tasks together with their keys */
    this.tasks = this.tasksRef.snapshotChanges()
      .map(changes => {
        return changes.map(c => ({
          key: c.payload.key, data: c.payload.val()

        }));
      });
    this.tasks.subscribe(data => {
      this.dataChange.value.push(data);
      this.dataChange.next(data);

      console.log(this.dataChange.value);
    }
    )
  }

  addTask(task: Task) {
    /**Get firebase server current time for timeOfCreation property*/
    let dateCreated = firebase.database.ServerValue.TIMESTAMP;
    this.dialogData = task;

    this.tasksRef.push({
      id: task.id,
      name: task.name,
      description: task.description,
      timeOfCreation: dateCreated
    });
  }

  updateTask(task: any): void {
    this.dialogData = task;

    this.tasksRef.update(task.key, {
      id: task.id,
      name: task.name,
      description: task.description,
      timeOfCreation: task.timeOfCreation
    });

    const editedTask = {
      key: task.key,
      data: {
        id: task.id,
        name: task.name,
        description: task.description,
        timeOfCreation: task.timeOfCreation
      }
    }

    /**Update task info when task gets edited from details page */
    this.onChangeTask(editedTask);
  }

  deleteTask(key: string) {
    this.database.list('data').remove(key);
  }
}

